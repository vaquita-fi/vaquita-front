// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "./interfaces/external/IPool.sol";
import {IAToken} from "./interfaces/external/IAToken.sol";
import {IPermit} from "./interfaces/external/IPermit.sol";

/**
 * @title VaquitaPool
 * @dev A protocol that allows users to deposit tokens, earn Aave interest, and participate in a reward pool
 */
contract VaquitaPool is Ownable {
    using SafeERC20 for IERC20;

    // Position struct to store user position information
    struct Position {
        bytes16 id;
        address owner;
        uint256 amount;
        uint256 liquidityIndex;  // Aave's liquidity index at deposit time
        uint256 entryTime;
        uint256 finalizationTime;
        bool isActive;
    }

    // State variables
    IERC20 public token;
    IPool public aavePool;
    IAToken public aToken;
    
    uint256 public lockPeriod = 1 days;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant RAY = 1e27; // Aave uses RAY precision for liquidity index
    uint256 public earlyWithdrawalFee = 0;
    
    uint256 public totalDeposits;
    uint256 public rewardPool;
    uint256 public protocolFees;
    
    // Mappings
    mapping(bytes16 => Position) public positions;
    mapping(address => uint256) public userTotalDeposits;

    // Events
    event FundsDeposited(bytes16 indexed depositId, address indexed owner, uint256 amount);
    event FundsWithdrawn(bytes16 indexed depositId, address indexed owner, uint256 amount, uint256 interest, uint256 reward);
    event RewardDistributed(bytes16 indexed depositId, address indexed owner, uint256 reward);
    event LockPeriodUpdated(uint256 newLockPeriod);
    event EarlyWithdrawalFeeUpdated(uint256 newFee);
    event RewardsAdded(uint256 rewardAmount);
    event ProtocolFeesUpdated(uint256 newProtocolFees);
    event ProtocolFeesWithdrawn(uint256 protocolFees);

    // Errors
    error InvalidAmount();
    error PositionNotFound();
    error PositionAlreadyWithdrawn();
    error WithdrawalTooEarly();
    error NotPositionOwner();
    error InvalidAddress();
    error InvalidFee();
    error InvalidDepositId();
    error DepositAlreadyExists();

    constructor(
        address _token,
        address _aavePool,
        address _aToken,
        uint256 _lockPeriod
    ) Ownable(msg.sender) {
        token = IERC20(_token);
        aavePool = IPool(_aavePool);
        aToken = IAToken(_aToken);
        lockPeriod = _lockPeriod;
        token.approve(address(aavePool), type(uint256).max);
    }

    /**
     * @dev Open a new position
     * @param depositId The unique identifier for the position
     * @param amount The amount of tokens to deposit
     */
    function deposit(bytes16 depositId, uint256 amount, uint256 deadline, bytes memory signature) external returns (uint256) {
        if (amount == 0) revert InvalidAmount();
        if (depositId == bytes16(0)) revert InvalidDepositId();
        if (positions[depositId].id != bytes16(0)) revert DepositAlreadyExists();

        try IPermit(address(token)).permit(
            msg.sender, address(this), amount, deadline, signature
        ) {} catch {}

        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Supply to Aave
        aavePool.supply(address(token), amount, address(this), 0);

        // Get current liquidity index from Aave
        uint256 currentLiquidityIndex = aToken.liquidityIndex();

        // Create position with liquidity index snapshot
        Position storage position = positions[depositId];
        position.id = depositId;
        position.owner = msg.sender;
        position.amount = amount;
        position.liquidityIndex = currentLiquidityIndex;
        position.entryTime = block.timestamp;
        position.finalizationTime = block.timestamp + lockPeriod;
        position.isActive = true;

        // Update totals
        userTotalDeposits[msg.sender] += amount;
        totalDeposits += amount;

        emit FundsDeposited(depositId, msg.sender, amount);
        return amount;
    }

    /**
     * @dev Withdraw from a position
     * @param depositId The ID of the position to withdraw from
     */
    function withdraw(bytes16 depositId) external {
        Position storage position = positions[depositId];
        if (position.id == bytes16(0)) revert PositionNotFound();
        if (!position.isActive) revert PositionAlreadyWithdrawn();
        if (position.owner != msg.sender) revert NotPositionOwner();

        // Calculate current value and interest for this specific position
        uint256 currentValue = _calculateCurrentPositionValue(position.amount, position.liquidityIndex);
        uint256 interest = currentValue > position.amount ? currentValue - position.amount : 0;

        // Withdraw the current value from Aave
        uint256 withdrawnAmount = _withdrawFromAave(currentValue);

        // Update position and user info
        position.isActive = false;
        userTotalDeposits[msg.sender] -= position.amount;
        totalDeposits -= position.amount;

        uint256 reward = 0;
        if (block.timestamp < position.finalizationTime) {
            // Early withdrawal - calculate fee and add remaining interest to reward pool
            uint256 feeAmount = (interest * earlyWithdrawalFee) / BASIS_POINTS;
            uint256 remainingInterest = interest - feeAmount;
            rewardPool += remainingInterest;
            protocolFees += feeAmount;
            
            // Transfer only principal to user
            token.safeTransfer(msg.sender, position.amount);
        } else {
            // Late withdrawal - calculate and distribute rewards
            reward = _calculateReward(position.amount);
            uint256 totalWithdrawal = withdrawnAmount + reward;
            rewardPool -= reward;
            
            token.safeTransfer(msg.sender, totalWithdrawal);
        }

        emit FundsWithdrawn(depositId, msg.sender, position.amount, interest, reward);
    }

    /**
     * @dev Calculate the current value of a position based on Aave's liquidity index
     * @param principalAmount The original deposit amount
     * @param entryLiquidityIndex The liquidity index when the position was created
     * @return The current value including accrued interest
     */
    function _calculateCurrentPositionValue(uint256 principalAmount, uint256 entryLiquidityIndex) internal view returns (uint256) {
        uint256 currentLiquidityIndex = aToken.liquidityIndex();
        
        // Calculate the current value: principal * (currentIndex / entryIndex)
        return (principalAmount * currentLiquidityIndex) / entryLiquidityIndex;
    }

    /**
     * @dev Get the current value and interest for a position
     * @param depositId The ID of the position
     * @return currentValue The current total value of the position
     * @return interest The interest earned so far
     */
    function getPositionValue(bytes16 depositId) external view returns (uint256 currentValue, uint256 interest) {
        Position storage position = positions[depositId];
        if (position.id == bytes16(0)) revert PositionNotFound();
        
        currentValue = _calculateCurrentPositionValue(position.amount, position.liquidityIndex);
        interest = currentValue > position.amount ? currentValue - position.amount : 0;
    }

    /**
     * @dev Withdraw tokens from Aave
     * @param amount The amount of underlying tokens to withdraw
     * @return The actual amount of underlying tokens received
     */
    function _withdrawFromAave(uint256 amount) internal returns (uint256) {
        uint256 balanceBefore = token.balanceOf(address(this));
        
        // Withdraw from Aave - amount represents underlying tokens to withdraw
        aavePool.withdraw(address(token), amount, address(this));
        
        uint256 balanceAfter = token.balanceOf(address(this));
        return balanceAfter - balanceBefore;
    }

    /**
     * @dev Get position details
     * @param depositId The ID of the position
     * @return positionOwner The position owner
     * @return positionAmount The position amount
     * @return liquidityIndex The liquidity index at entry
     * @return entryTime The entry time
     * @return finalizationTime The finalization time
     * @return positionIsActive Whether the position is active
     */
    function getPosition(bytes16 depositId) external view returns (
        address positionOwner,
        uint256 positionAmount,
        uint256 liquidityIndex,
        uint256 entryTime,
        uint256 finalizationTime,
        bool positionIsActive
    ) {
        Position storage position = positions[depositId];
        return (
            position.owner,
            position.amount,
            position.liquidityIndex,
            position.entryTime,
            position.finalizationTime,
            position.isActive
        );
    }

    /**
     * @dev Calculate reward for a position
     * @param amount The position amount
     * @return The calculated reward
     */
    function _calculateReward(uint256 amount) internal view returns (uint256) {
        if (totalDeposits == 0) return 0;
        return (rewardPool * amount) / totalDeposits;
    }

    // Owner functions remain the same...
    function withdrawProtocolFees() external onlyOwner {
        token.safeTransfer(owner(), protocolFees);
    }

    function withdrawRewardPool(uint256 rewardAmount) external onlyOwner {
        token.safeTransfer(owner(), rewardAmount);
        rewardPool -= rewardAmount;
    }

    function updateProtocolFees(uint256 newProtocolFees) external onlyOwner {
        protocolFees = newProtocolFees;
    }

    function addRewards(uint256 rewardAmount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), rewardAmount);
        rewardPool += rewardAmount;
    }

    function updateLockPeriod(uint256 newLockPeriod) external onlyOwner {
        lockPeriod = newLockPeriod;
        emit LockPeriodUpdated(newLockPeriod);
    }

    function updateEarlyWithdrawalFee(uint256 newFee) external onlyOwner {
        if (newFee > BASIS_POINTS) revert InvalidFee();
        earlyWithdrawalFee = newFee;
        emit EarlyWithdrawalFeeUpdated(newFee);
    }
}