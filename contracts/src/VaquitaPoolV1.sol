// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IPool} from "./interfaces/external/IPool.sol";
import {IPermit} from "./interfaces/external/IPermit.sol";
import {console} from "forge-std/console.sol";

/**
 * @title VaquitaPool
 * @dev A protocol that allows users to deposit tokens, earn Aave interest, and participate in a reward pool
 */
contract VaquitaPool is Initializable, OwnableUpgradeable, PausableUpgradeable {
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

    /**
     * @notice Initializes the VaquitaPool contract with the given token, Aave pool, and lock period.
     * @param _token The address of the ERC20 token to be used for deposits.
     * @param _aavePool The address of the Aave pool contract.
     * @param _lockPeriod The lock period (in seconds) for deposits.
     */
    function initialize(
        address _token,
        address _aavePool,
        uint256 _lockPeriod
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        token = IERC20(_token);
        aavePool = IPool(_aavePool);
        lockPeriod = _lockPeriod;
        token.approve(address(aavePool), type(uint256).max);
    }

    /**
     * @notice Pauses the contract, disabling deposits and withdrawals.
     * @dev Only callable by the contract owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the contract, enabling deposits and withdrawals.
     * @dev Only callable by the contract owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Opens a new position by depositing tokens into the pool.
     * @dev Uses permit if available, then transfers tokens and supplies to Aave.
     * @param depositId The unique identifier for the position.
     * @param amount The amount of tokens to deposit.
     * @param deadline The deadline for the permit signature.
     * @param signature The permit signature for token approval.
     * @return The amount deposited.
     *
     * Emits a {FundsDeposited} event.
     *
     * Requirements:
     * - `amount` must be greater than 0.
     * - `depositId` must not be zero or already used.
     */
    function deposit(bytes16 depositId, uint256 amount, uint256 deadline, bytes memory signature) external whenNotPaused returns (uint256) {
        if (amount == 0) revert InvalidAmount();
        if (depositId == bytes16(0)) revert InvalidDepositId();
        if (positions[depositId].id != bytes16(0)) revert DepositAlreadyExists();

        try IPermit(address(token)).permit(
            msg.sender, address(this), amount, deadline, signature
        ) {} catch {}

        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Supply to Aave
        _supplyToAave(amount);

        // Get current liquidity index from Aave
        uint256 currentLiquidityIndex = _getLiquidityIndex();

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
     * @notice Withdraws funds from a position, including principal, interest, and rewards if eligible.
     * @param depositId The ID of the position to withdraw from.
     * @return amountToTransfer The amount of tokens transferred to the user.
     *
     * Emits a {FundsWithdrawn} event.
     *
     * Requirements:
     * - The position must exist and be active.
     * - The caller must be the position owner.
     */
    function withdraw(bytes16 depositId) external whenNotPaused returns (uint256) {
        Position storage position = positions[depositId];
        if (position.id == bytes16(0)) revert PositionNotFound();
        if (!position.isActive) revert PositionAlreadyWithdrawn();
        if (position.owner != msg.sender) revert NotPositionOwner();

        console.log("Position amount:", position.amount);
        console.log("Position liquidity index:", position.liquidityIndex);

        // Calculate current value and interest for this specific position
        uint256 currentValue = _calculateCurrentPositionValue(position.amount, position.liquidityIndex);
        console.log("Current value:", currentValue);
        uint256 interest = currentValue > position.amount ? currentValue - position.amount : 0;
        console.log("Interest:", interest);

        console.log("Contract balance before withdraw:", token.balanceOf(address(this)));
        // Withdraw the current value from Aave
        uint256 withdrawnAmount = _withdrawFromAave(currentValue);
        console.log("Withdrawn amount:", withdrawnAmount);
        console.log("Contract balance after withdraw:", token.balanceOf(address(this)));

        // Update position and user info
        position.isActive = false;
        userTotalDeposits[msg.sender] -= position.amount;

        uint256 reward = 0;
        uint256 amountToTransfer = 0;
        if (block.timestamp < position.finalizationTime) {
            // Early withdrawal - calculate fee and add remaining interest to reward pool
            uint256 feeAmount = (interest * earlyWithdrawalFee) / BASIS_POINTS;
            uint256 remainingInterest = interest - feeAmount;
            rewardPool += remainingInterest;
            protocolFees += feeAmount;
            amountToTransfer = withdrawnAmount - interest;
            totalDeposits -= position.amount;
            
            // Transfer only principal to user
            console.log("Vaquita token balance:", token.balanceOf(address(this)));
            token.safeTransfer(msg.sender, amountToTransfer);
        } else {
            // Late withdrawal - calculate and distribute rewards
            reward = _calculateReward(position.amount);
            amountToTransfer = withdrawnAmount + reward;
            rewardPool -= reward;
            totalDeposits -= position.amount;
            
            console.log("Vaquita token balance:", token.balanceOf(address(this)));
            token.safeTransfer(msg.sender, amountToTransfer);
        }

        emit FundsWithdrawn(depositId, msg.sender, position.amount, interest, reward);
        return amountToTransfer;
    }

    /**
     * @notice Calculates the current value of a position based on Aave's liquidity index.
     * @param principalAmount The original deposit amount.
     * @param entryLiquidityIndex The liquidity index when the position was created.
     * @return The current value including accrued interest.
     */
    function _calculateCurrentPositionValue(uint256 principalAmount, uint256 entryLiquidityIndex) internal view returns (uint256) {
        uint256 currentLiquidityIndex = _getLiquidityIndex();
        console.log("Current liquidity index:", currentLiquidityIndex);
        
        // Calculate the current value: principal * (currentIndex / entryIndex)
        return (principalAmount * currentLiquidityIndex) / entryLiquidityIndex;
    }

    /**
     * @notice Returns the current value and interest for a position.
     * @param depositId The ID of the position.
     * @return currentValue The current total value of the position.
     * @return interest The interest earned so far.
     */
    function getPositionValue(bytes16 depositId) external view returns (uint256 currentValue, uint256 interest) {
        Position storage position = positions[depositId];
        if (position.id == bytes16(0)) revert PositionNotFound();
        
        currentValue = _calculateCurrentPositionValue(position.amount, position.liquidityIndex);
        interest = currentValue > position.amount ? currentValue - position.amount : 0;
    }

    /**
     * @notice Supplies tokens to the Aave pool from this contract.
     * @dev Internal function. Assumes approval is already set.
     * @param amount The amount of tokens to supply.
     */
    function _supplyToAave(uint256 amount) internal {
        aavePool.supply(address(token), amount, address(this), 0);
    }

    /**
     * @notice Withdraws tokens from Aave to this contract.
     * @dev Internal function. Withdraws the specified amount of underlying tokens.
     * @param amount The amount of underlying tokens to withdraw.
     * @return The actual amount of underlying tokens received.
     */
    function _withdrawFromAave(uint256 amount) internal virtual returns (uint256) {
        uint256 balanceBefore = token.balanceOf(address(this));
        
        // Withdraw from Aave - amount represents underlying tokens to withdraw
        aavePool.withdraw(address(token), amount, address(this));
        
        uint256 balanceAfter = token.balanceOf(address(this));
        return balanceAfter - balanceBefore;
    }

    /**
     * @notice Gets the current liquidity index for the token from the Aave pool.
     * @dev Internal view function.
     * @return The current liquidity index.
     */
    function _getLiquidityIndex() internal view returns (uint256) {
        // ReserveData struct: liquidityIndex is the second value
        (, uint256 liquidityIndex, , , , , , , , , , ) = aavePool.getReserveData(address(token));
        return liquidityIndex;
    }

    /**
     * @notice Returns the details of a position.
     * @param depositId The ID of the position.
     * @return positionOwner The position owner.
     * @return positionAmount The position amount.
     * @return liquidityIndex The liquidity index at entry.
     * @return entryTime The entry time.
     * @return finalizationTime The finalization time.
     * @return positionIsActive Whether the position is active.
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
     * @notice Calculates the reward for a position based on the current reward pool and total deposits.
     * @dev Internal view function.
     * @param amount The position amount.
     * @return The calculated reward.
     */
    function _calculateReward(uint256 amount) internal view returns (uint256) {
        if (totalDeposits == 0) return 0;
        return (rewardPool * amount) / totalDeposits;
    }

    /**
     * @notice Withdraws accumulated protocol fees to the owner.
     * @dev Only callable by the contract owner when not paused.
     * Emits a {ProtocolFeesWithdrawn} event.
     */
    function withdrawProtocolFees() external onlyOwner whenNotPaused {
        protocolFees = 0;
        token.safeTransfer(owner(), protocolFees);
        emit ProtocolFeesWithdrawn(protocolFees);
    }

    /**
     * @notice Adds rewards to the reward pool.
     * @dev Only callable by the contract owner. Transfers tokens from the owner to the contract.
     * Emits a {RewardsAdded} event.
     * @param rewardAmount The amount of tokens to add to the reward pool.
     */
    function addRewards(uint256 rewardAmount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), rewardAmount);
        rewardPool += rewardAmount;
        emit RewardsAdded(rewardAmount);
    }

    /**
     * @notice Updates the lock period for new deposits.
     * @dev Only callable by the contract owner.
     * Emits a {LockPeriodUpdated} event.
     * @param newLockPeriod The new lock period in seconds.
     */
    function updateLockPeriod(uint256 newLockPeriod) external onlyOwner {
        lockPeriod = newLockPeriod;
        emit LockPeriodUpdated(newLockPeriod);
    }

    /**
     * @notice Updates the early withdrawal fee (in basis points).
     * @dev Only callable by the contract owner. Reverts if the new fee exceeds BASIS_POINTS.
     * Emits a {EarlyWithdrawalFeeUpdated} event.
     * @param newFee The new early withdrawal fee in basis points.
     */
    function updateEarlyWithdrawalFee(uint256 newFee) external onlyOwner {
        if (newFee > BASIS_POINTS) revert InvalidFee();
        earlyWithdrawalFee = newFee;
        emit EarlyWithdrawalFeeUpdated(newFee);
    }
}