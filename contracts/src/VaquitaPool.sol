// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool, IAToken} from "./interfaces/IAave.sol";
import {IUSDCPermit} from "./interfaces/IUSDCPermit.sol";

/**
 * @title VaquitaPool
 * @dev A protocol that allows users to deposit tokens, earn Aave interest, and participate in a reward pool
 */
contract VaquitaPool is Ownable {
    using SafeERC20 for IERC20;

    // Position struct to store user position information
    struct Position {
        bytes32 id;
        address owner;
        uint256 amount;
        uint256 aTokensReceived;
        uint256 entryTime;
        uint256 finalizationTime;
        bool isActive;
    }

    // State variables
    IERC20 public immutable token;
    IPool public immutable aavePool;
    IAToken public immutable aToken;
    
    uint256 public lockPeriod = 1 days;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public earlyWithdrawalFee = 0; // Fee for early withdrawals (initially 0)
    
    uint256 public totalDeposits;
    uint256 public rewardPool;
    uint256 public protocolFees;  // New state variable for protocol fees
    
    // Mappings
    mapping(bytes32 => Position) public positions;
    mapping(address => uint256) public userTotalDeposits;

    // Events
    event FundsDeposited(bytes32 indexed depositId, address indexed owner, uint256 amount, uint256 aTokensReceived);
    event FundsWithdrawn(bytes32 indexed depositId, address indexed owner, uint256 amount, uint256 reward);
    event RewardDistributed(bytes32 indexed depositId, address indexed owner, uint256 reward);
    event LockPeriodUpdated(uint256 newLockPeriod);
    event EarlyWithdrawalFeeUpdated(uint256 newFee);

    // Errors
    error InvalidAmount();
    error PositionNotFound();
    error PositionAlreadyWithdrawn();
    error WithdrawalTooEarly();
    error NotPositionOwner();
    error InvalidAddress();
    error InvalidFee();
    error InvalidDepositId();

    constructor(
        address _token,
        address _aavePool,
        address _aToken,
        uint256 _lockPeriod
    ) Ownable(msg.sender) {
        if (_token == address(0) || _aavePool == address(0) || _aToken == address(0)) 
            revert InvalidAddress();

        token = IERC20(_token);
        aavePool = IPool(_aavePool);
        aToken = IAToken(_aToken);
        lockPeriod = _lockPeriod;

        // Verify aToken matches underlying token
        if (aToken.UNDERLYING_ASSET_ADDRESS() != _token) 
            revert InvalidAddress();
    }

    /**
     * @dev Update the lock period
     * @param newLockPeriod The new lock period in seconds
     */
    function updateLockPeriod(uint256 newLockPeriod) external onlyOwner {
        lockPeriod = newLockPeriod;
        emit LockPeriodUpdated(newLockPeriod);
    }

    /**
     * @dev Update the early withdrawal fee
     * @param newFee The new fee in basis points (0-10000)
     */
    function updateEarlyWithdrawalFee(uint256 newFee) external onlyOwner {
        if (newFee > BASIS_POINTS) revert InvalidFee();
        earlyWithdrawalFee = newFee;
        emit EarlyWithdrawalFeeUpdated(newFee);
    }

    /**
     * @dev Open a new position
     * @param depositId The unique identifier for the position
     * @param amount The amount of tokens to deposit
     */
    function deposit(bytes32 depositId, uint256 amount, uint256 deadline, bytes memory signature) external {
        if (amount == 0) revert InvalidAmount();
        if (depositId == bytes32(0)) revert InvalidDepositId();
        if (positions[depositId].id != bytes32(0)) revert InvalidDepositId();

        try IUSDCPermit(address(token)).permit(
            msg.sender, address(this), amount, deadline, signature
        ) {} catch {}

        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        uint256 balanceBefore = aToken.balanceOf(address(this));

        // Supply to Aave
        _supplyToAave(amount);

        uint256 aTokensReceived = aToken.balanceOf(address(this)) - balanceBefore;

        // Create position
        Position storage position = positions[depositId];
        position.id = depositId;
        position.owner = msg.sender;
        position.amount = amount;
        position.aTokensReceived = aTokensReceived;
        position.entryTime = block.timestamp;
        position.finalizationTime = block.timestamp + lockPeriod;
        position.isActive = true;

        // Update user info
        userTotalDeposits[msg.sender] += amount;
        totalDeposits += amount;

        emit FundsDeposited(depositId, msg.sender, amount, aTokensReceived);
    }

    /**
     * @dev Withdraw from a position
     * @param depositId The ID of the position to withdraw from
     */
    function withdraw(bytes32 depositId) external {
        Position storage position = positions[depositId];
        if (position.id == bytes32(0)) revert PositionNotFound();
        if (!position.isActive) revert PositionAlreadyWithdrawn();
        if (position.owner != msg.sender) revert NotPositionOwner();

        // Withdraw from Aave and get actual amount received
        uint256 withdrawnAmount = aavePool.withdraw(address(token), position.amount, address(this));
        uint256 interest = withdrawnAmount > position.amount ? withdrawnAmount - position.amount : 0;

        // Update position and user info
        position.isActive = false;
        userTotalDeposits[msg.sender] -= position.amount;
        totalDeposits -= position.amount;

        uint256 reward = 0;
        if (block.timestamp < position.finalizationTime) {
            // Early withdrawal - calculate fee and add remaining interest to reward pool
            uint256 feeAmount = (interest * earlyWithdrawalFee) / BASIS_POINTS;
            uint256 remainingInterest = interest - feeAmount;
            rewardPool += remainingInterest;  // Only remaining interest goes to reward pool
            protocolFees += feeAmount;        // Fees go to protocol fees
            
            // Transfer only principal to user
            token.safeTransfer(msg.sender, position.amount);
        } else {
            // Late withdrawal - calculate and distribute rewards
            reward = _calculateReward(position.amount);
            uint256 totalWithdrawal = withdrawnAmount + reward;
            rewardPool -= reward;
            
            token.safeTransfer(msg.sender, totalWithdrawal);
        }

        emit FundsWithdrawn(depositId, msg.sender, position.amount, reward);
    }

    /**
     * @dev Get position details
     * @param depositId The ID of the position
     * @return positionOwner The position owner
     * @return positionAmount The position amount
     * @return aTokensReceived The amount of aTokens received
     * @return entryTime The entry time
     * @return finalizationTime The finalization time
     * @return positionIsActive Whether the position is active
     */
    function getPosition(bytes32 depositId) external view returns (
        address positionOwner,
        uint256 positionAmount,
        uint256 aTokensReceived,
        uint256 entryTime,
        uint256 finalizationTime,
        bool positionIsActive
    ) {
        Position storage position = positions[depositId];
        return (
            position.owner,
            position.amount,
            position.aTokensReceived,
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

    /**
     * @dev Supply tokens to Aave
     * @param amount The amount to supply
     */
    function _supplyToAave(uint256 amount) internal {
        token.approve(address(aavePool), amount);
        aavePool.supply(address(token), amount, address(this), 0);
    }

    /**
     * @dev Get the current reward pool distribution percentage
     * @return The reward pool percentage (in basis points)
     */
    function getRewardPoolDistribution() external view returns (uint256) {
        if (totalDeposits == 0) return 0;
        return (rewardPool * BASIS_POINTS) / totalDeposits;
    }

    // function to withdraw protocol fees
    function withdrawProtocolFees() external onlyOwner {
        token.safeTransfer(owner(), protocolFees);
    }
    // function to withdraw reward pool
    function withdrawRewardPool(uint256 rewardAmount) external onlyOwner {
        token.safeTransfer(owner(), rewardAmount);
        rewardPool -= rewardAmount;
    }
    // function to update protocol fees
    function updateProtocolFees(uint256 newProtocolFees) external onlyOwner {
        protocolFees = newProtocolFees;
    }
    // function to update reward pool
    function addRewards(uint256 rewardAmount) external onlyOwner {
        // transfer funds from caller to the contract and add it to the reward pool
        token.safeTransferFrom(msg.sender, address(this), rewardAmount);
        rewardPool += rewardAmount;
    }
} 