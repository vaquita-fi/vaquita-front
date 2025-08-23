// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {IPermit} from "./interfaces/external/IPermit.sol";
import {IPool} from "./interfaces/external/IPool.sol";

/**
 * @title VaquitaPool
 * @dev A protocol that allows users to deposit tokens, earn Velodrome LP fees and participate in a reward pool
 */
contract VaquitaPool is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

    // Position struct to store user position information
    struct Position {
        address owner;
        uint256 amount;
        uint256 liquidityIndex;
        uint256 finalizationTime;
        uint256 lockPeriod;
    }

    // Period struct to store period information
    struct Period {
        uint256 rewardPool;
        uint256 totalDeposits;
    }
    
    // State variables
    IERC20 public token;
    IPool public aavePool;
    
    uint256 public constant BASIS_POINTS = 1e4;
    uint256 public earlyWithdrawalFee; // Fee for early withdrawals (initially 0)
    uint256 public protocolFees;  // protocol fees

    mapping(uint256 => Period) public periods; // lockPeriod => Period
    mapping(uint256 => bool) public isSupportedLockPeriod; // lockPeriod => isSupported
    
    // Mappings
    mapping(address => uint256) public depositNonces;
    mapping(bytes32 => Position) public positions;

    // Events
    event FundsDeposited(bytes32 indexed depositId, address indexed owner, uint256 amount, uint256 lockPeriod);
    event FundsWithdrawn(bytes32 indexed depositId, address indexed owner, uint256 amount, uint256 interest, uint256 reward, uint256 lockPeriod);
    event LockPeriodAdded(uint256 newLockPeriod);
    event EarlyWithdrawalFeeUpdated(uint256 newFee);
    event RewardsAdded(uint256 rewardAmount, uint256 lockPeriod);
    event ProtocolFeesAdded(uint256 protocolFees);
    event ProtocolFeesWithdrawn(uint256 protocolFees);
    // Errors
    error InvalidAmount();
    error PositionNotFound();
    error NotPositionOwner();
    error InvalidAddress();
    error InvalidFee();
    error PeriodNotSupported();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @notice Initializes the contract with the token, liquidity manager, and supported lock periods.
     * @dev Sets up the contract owner, pausable state, and approves the liquidity manager to spend tokens.
     * @param _token The address of the ERC20 token to be deposited.
     * @param _aavePool The address of the Aave pool contract.
     * @param _lockPeriods Array of supported lock periods in seconds.
     */
    function initialize(
        address _token,
        address _aavePool,
        uint256[] calldata _lockPeriods
    ) external initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        if (_token == address(0) || _aavePool == address(0)) revert InvalidAddress();
        token = IERC20(_token);
        aavePool = IPool(_aavePool);
        uint256 length = _lockPeriods.length;
        for (uint256 i = 0; i < length; i++) {
            isSupportedLockPeriod[_lockPeriods[i]] = true;
        }
        token.forceApprove(address(aavePool), type(uint256).max);
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
     * @notice Open a new position in the pool
     * @dev Allows a user to deposit tokens, which are supplied to the VelodromeLiquidityManager. Position is tracked by a unique depositId.
     * @param amount The amount of tokens to deposit
     * @param period The lock period chosen for this deposit
     * @param deadline The deadline for the permit signature
     * @param signature The permit signature for token approval
     * @return liquidityIndex The liquidity index of the position
     * @dev Emits FundsDeposited event
     */
    function deposit(uint256 amount, uint256 period, uint256 deadline, bytes memory signature) external nonReentrant whenNotPaused returns (uint256 liquidityIndex) {
        if (amount == 0) revert InvalidAmount();
        if (!isSupportedLockPeriod[period]) revert PeriodNotSupported();
        bytes32 depositId = keccak256(abi.encodePacked(msg.sender, depositNonces[msg.sender]++));

        // Create position
        Position storage position = positions[depositId];
        position.owner = msg.sender;
        position.amount = amount;
        position.finalizationTime = block.timestamp + period;
        position.lockPeriod = period;

        try IPermit(address(token)).permit(
            msg.sender, address(this), amount, deadline, signature
        ) {} catch {}

        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Supply to Aave
        aavePool.supply(address(token), amount, address(this), 0);
        (, liquidityIndex, , , , , , , , , , ) = aavePool.getReserveData(address(token));
        position.liquidityIndex = liquidityIndex;
        periods[period].totalDeposits += amount;

        emit FundsDeposited(depositId, msg.sender, amount, period);
    }

    /**
     * @notice Withdraw from a position
     * @dev Only the position owner can withdraw. Handles early withdrawal fees and reward distribution.
     * @param depositId The ID of the position to withdraw from
     * @return amountToTransfer The amount of token transferred to the user
     * @dev Emits FundsWithdrawn event
     * @dev Emits ProtocolFeesAdded event
     */
    function withdraw(bytes32 depositId) external nonReentrant whenNotPaused returns (uint256 amountToTransfer) {
        Position storage position = positions[depositId];
        if (position.owner == address(0)) revert PositionNotFound();
        if (position.owner != msg.sender) revert NotPositionOwner();

        // Remove position
        position.owner = address(0);

        uint256 period = position.lockPeriod;

        // Withdraw from Aave and get actual amount received
        uint256 currentValue = _calculateCurrentPositionValue(position.amount, position.liquidityIndex);
        uint256 interest = currentValue > position.amount ? currentValue - position.amount : 0;
        uint256 withdrawnAmount = aavePool.withdraw(address(token), currentValue, address(this));

        uint256 reward = 0;
        if (block.timestamp < position.finalizationTime) {
            // Early withdrawal - calculate fee and add remaining interest to reward pool
            uint256 feeAmount = (interest * earlyWithdrawalFee) / BASIS_POINTS;
            uint256 remainingInterest = interest - feeAmount;
            protocolFees += feeAmount;        // Fees go to protocol fees
            emit ProtocolFeesAdded(feeAmount);
            periods[period].rewardPool += remainingInterest;  // Only remaining interest goes to reward pool
            amountToTransfer = withdrawnAmount - interest;
        } else {
            // Late withdrawal - calculate and distribute rewards
            reward = _calculateReward(position.amount, period);
            periods[period].rewardPool -= reward;
            amountToTransfer = withdrawnAmount + reward;
        }
        periods[period].totalDeposits -= position.amount;
        token.safeTransfer(msg.sender, amountToTransfer);

        emit FundsWithdrawn(depositId, msg.sender, amountToTransfer, interest, reward, period);
    }

    /**
     * @notice Calculate reward for a position
     * @dev Proportional to the user's deposit amount
     * @param amount The position amount
     * @param period The lock period for this position
     * @return reward The calculated reward
     */
    function _calculateReward(uint256 amount, uint256 period) internal view returns (uint256 reward) {
        uint256 totalDepositsForPeriod = periods[period].totalDeposits;
        if (totalDepositsForPeriod == 0) return 0;
        reward = (periods[period].rewardPool * amount) / totalDepositsForPeriod;
    }

    /**
     * @notice Withdraw protocol fees to the contract owner
     * @dev Emits ProtocolFeesWithdrawn event
     */
    function withdrawProtocolFees() external onlyOwner {
        uint256 cacheProtocolFees = protocolFees;
        protocolFees = 0;
        token.safeTransfer(owner(), cacheProtocolFees);
        emit ProtocolFeesWithdrawn(cacheProtocolFees);
    }

    /**
     * @notice Add rewards to the reward pool (owner only)
     * @param period The lock period to add rewards to
     * @param rewardAmount The amount of rewards to add
     * @dev Emits RewardsAdded event
     */
    function addRewards(uint256 period, uint256 rewardAmount) external onlyOwner {
        if (!isSupportedLockPeriod[period]) revert PeriodNotSupported();
        token.safeTransferFrom(msg.sender, address(this), rewardAmount);
        periods[period].rewardPool += rewardAmount;
        emit RewardsAdded(period, rewardAmount);
    }

    /**
     * @notice Update the early withdrawal fee (owner only)
     * @param newFee The new fee in basis points (0-10000)
     * @dev Emits EarlyWithdrawalFeeUpdated event
     */
    function updateEarlyWithdrawalFee(uint256 newFee) external onlyOwner {
        if (newFee > BASIS_POINTS) revert InvalidFee();
        earlyWithdrawalFee = newFee;
        emit EarlyWithdrawalFeeUpdated(newFee);
    }

    /**
     * @notice Add a new lock period to the supported list.
     * @dev Only callable by the contract owner.
     * @param newLockPeriod The new lock period in seconds.
     * @dev Emits LockPeriodAdded event
     */
    function addLockPeriod(uint256 newLockPeriod) external onlyOwner {
        require(!isSupportedLockPeriod[newLockPeriod], "Lock period already supported");
        isSupportedLockPeriod[newLockPeriod] = true;
        emit LockPeriodAdded(newLockPeriod);
    }

    /**
     * @notice Calculates the current value of a position based on Aave's liquidity index.
     * @param principalAmount The original deposit amount.
     * @param entryLiquidityIndex The liquidity index when the position was created.
     * @return currentValue The current value including accrued interest.
     */
    function _calculateCurrentPositionValue(uint256 principalAmount, uint256 entryLiquidityIndex) internal view returns (uint256 currentValue) {
        uint256 currentIndex = aavePool.getReserveNormalizedIncome(address(token));
        currentValue = (principalAmount * currentIndex) / entryLiquidityIndex;
    }
} 