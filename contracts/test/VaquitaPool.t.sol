// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {Test} from "forge-std/Test.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "../src/interfaces/external/IPool.sol";
import {IPermit} from "../src/interfaces/external/IPermit.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {TestUtils} from "./TestUtils.sol";
import {console} from "forge-std/console.sol";

contract VaquitaPoolTest is Test, TestUtils {
    VaquitaPool vaquita;
    IERC20 public token;
    uint256 baseForkBlock = 32_346_386;
    address constant AAVE_POOL_ADDRESS = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5; // Aave Pool address on Base
    address constant TOKEN_ADDRESS = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC address on Base
    uint256 public initialAmount = 1_000e6;
    address public whale = 0x0B0A5886664376F59C351ba3f598C8A8B4D0A6f3;
    address public alice;
    uint256 public alicePrivateKey;
    uint256 public lockPeriod;
    address public owner;
    address public bob;
    uint256 public bobPrivateKey;
    address public charlie;
    uint256 public charliePrivateKey;
    IPool public aavePool;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("base"), baseForkBlock);
        token = IERC20(TOKEN_ADDRESS);
        (alice, alicePrivateKey) = makeAddrAndKey("alice");
        (bob, bobPrivateKey) = makeAddrAndKey("bob");
        (charlie, charliePrivateKey) = makeAddrAndKey("charlie");
        owner = address(this);
        lockPeriod = 1 days;
        aavePool = IPool(AAVE_POOL_ADDRESS);
        vaquita = new VaquitaPool();
        uint256[] memory lockPeriodsArr = new uint256[](1);
        lockPeriodsArr[0] = lockPeriod;
        // Deploy proxy and initialize via selector
        bytes memory initData = abi.encodeWithSelector(
            VaquitaPool.initialize.selector,
            TOKEN_ADDRESS,
            AAVE_POOL_ADDRESS,
            lockPeriodsArr
        );
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(vaquita),
            address(this),
            initData
        );
        vaquita = VaquitaPool(address(proxy));
        vm.startPrank(whale);
        token.transfer(alice, initialAmount);
        token.transfer(bob, initialAmount * 2);
        token.transfer(charlie, initialAmount * 3);
        token.transfer(owner, initialAmount * 4);
        vm.stopPrank();
    }

    function deposit(
        address user,
        uint256 depositAmount
    ) public {
        vm.startPrank(user);
        token.approve(address(vaquita), depositAmount);
        vaquita.deposit(depositAmount, lockPeriod, block.timestamp + 1 hours, "");
        vm.stopPrank();
    }

    function withdraw(
        address user,
        bytes32 depositId
    ) public returns (uint256) {
        vm.startPrank(user);
        uint256 amount = vaquita.withdraw(depositId);
        vm.stopPrank();
        return amount;
    }

    function test_DepositWithPermit() public {
        vm.startPrank(alice);
        
        // Prepare EIP-712 permit data
        uint256 nonce = IPermit(address(token)).nonces(alice);
        uint256 deadline = block.timestamp + 1 hours;
        uint256 chainId = block.chainid;
        string memory name = "Bridged USDC (Lisk)";
        string memory version = "2";
        address verifyingContract = address(token);
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        
        // EIP-712 JSON structure for permit
        string memory permitJson = string(abi.encodePacked(
            '{',
                '"types": {',
                    '"EIP712Domain": [',
                        '{"name": "name", "type": "string"},',
                        '{"name": "version", "type": "string"},',
                        '{"name": "chainId", "type": "uint256"},',
                        '{"name": "verifyingContract", "type": "address"}',
                    '],',
                    '"Permit": [',
                        '{"name": "owner", "type": "address"},',
                        '{"name": "spender", "type": "address"},',
                        '{"name": "value", "type": "uint256"},',
                        '{"name": "nonce", "type": "uint256"},',
                        '{"name": "deadline", "type": "uint256"}',
                    ']'
                '},',
                '"primaryType": "Permit",',
                '"domain": {',
                    '"name": "', name, '",',
                    '"version": "', version, '",',
                    '"chainId": ', vm.toString(chainId), ',',
                    '"verifyingContract": "', vm.toString(verifyingContract), '"',
                '},',
                '"message": {',
                    '"owner": "', vm.toString(alice), '",',
                    '"spender": "', vm.toString(address(vaquita)), '",',
                    '"value": ', vm.toString(initialAmount), ',',
                    '"nonce": ', vm.toString(nonce), ',',
                    '"deadline": ', vm.toString(deadline),
                '}',
            '}'
        ));

        // Compute the EIP-712 digest
        bytes32 digest = vm.eip712HashTypedData(permitJson);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        console.log("signature");
        console.logBytes(signature);
        
        // Now make the deposit
        token.approve(address(vaquita), initialAmount);
        vm.expectEmit(true, true, true, true);
        emit VaquitaPool.FundsDeposited(aliceDepositId, alice, initialAmount, lockPeriod);
        vaquita.deposit(initialAmount, lockPeriod, block.timestamp + 1 hours, signature);
        
        // Verify the deposit was successful
        (address positionOwner, uint256 positionAmount,,,) = vaquita.positions(aliceDepositId);
        assertEq(positionOwner, alice, "Position owner should be alice");
        assertEq(positionAmount, initialAmount, "Position amount should be initialAmount");
        
        vm.stopPrank();
    }

    function test_DepositWithApproval() public {
        vm.startPrank(alice);
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        token.approve(address(vaquita), initialAmount);
        vm.expectEmit(true, true, true, true);
        emit VaquitaPool.FundsDeposited(aliceDepositId, alice, initialAmount, lockPeriod);
        vaquita.deposit(initialAmount, lockPeriod, block.timestamp + 1 hours, "");
        (,uint256 aavePoolLiquidityIndex,,,,,,,,,,) = aavePool.getReserveData(address(token));
        (address positionOwner, uint256 positionAmount,uint256 positionLiquidityIndex,uint256 positionFinalizationTime,uint256 positionLockPeriod) = vaquita.positions(aliceDepositId);
        assertEq(positionOwner, alice, "Position owner should be alice");
        assertEq(positionAmount, initialAmount, "Position amount should be initialAmount");
        assertEq(positionLockPeriod, lockPeriod, "Position lock period should be lockPeriod");
        assertEq(positionFinalizationTime, block.timestamp + lockPeriod, "Position finalization time should be block.timestamp + lockPeriod");
        assertEq(positionLiquidityIndex, aavePoolLiquidityIndex, "Position liquidity index should be 1e18");
        assertEq(vaquita.depositNonces(alice), 1, "Deposit nonce should be 1");
        vm.stopPrank();
    }

    function test_WithdrawAfterLock() public {
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        deposit(alice, initialAmount);
        vm.warp(block.timestamp + lockPeriod);
        withdraw(alice, aliceDepositId);
        (address positionOwner,,,,) = vaquita.positions(aliceDepositId);
        assertEq(positionOwner, address(0));
    }

    function test_AddRewardsToRewardPool() public {
        vm.startPrank(owner);
        uint256 rewardAmount = 1000e6;
        uint256 ownerBalanceBefore = token.balanceOf(owner);
        (uint256 rewardPoolBefore,) = vaquita.periods(lockPeriod);
        token.approve(address(vaquita), rewardAmount);
        vaquita.addRewards(lockPeriod, rewardAmount);
        uint256 ownerBalanceAfter = token.balanceOf(owner);
        (uint256 rewardPoolAfter,) = vaquita.periods(lockPeriod);
        assertEq(rewardPoolAfter, rewardPoolBefore + rewardAmount, "Reward pool should increase by rewardAmount");
        assertEq(ownerBalanceAfter, ownerBalanceBefore - rewardAmount, "Owner balance should decrease by rewardAmount");
        vm.stopPrank();
    }

    function test_AddLockPeriod() public {
        uint256 newLockPeriod = 7 days;
        uint256 notSupportedLockPeriod = (1 weeks) * 4;
        // Should not be supported initially
        bool supportedBefore = vaquita.isSupportedLockPeriod(newLockPeriod);
        assertFalse(supportedBefore, "New lock period should not be supported before adding");
        // Add new lock period
        vaquita.addLockPeriod(newLockPeriod);
        // Should be supported after
        bool supportedAfter = vaquita.isSupportedLockPeriod(newLockPeriod);
        assertTrue(supportedAfter, "New lock period should be supported after adding");
        assertFalse(vaquita.isSupportedLockPeriod(notSupportedLockPeriod), "Not supported lock period should not be supported");
    }

    function test_EarlyWithdrawal() public {
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        deposit(alice, initialAmount);
        (,uint256 aliceDepositAmount,uint256 aliceEntryLiquidityIndex,,) = vaquita.positions(aliceDepositId);
        assertEq(aliceDepositAmount, initialAmount, "Alice should deposit all her tokens");
        console.log("Vaquita token balance after deposit:", token.balanceOf(address(vaquita)));

        generateInterestAndWarpToTime(whale, token, AAVE_POOL_ADDRESS, 5_000_000e6, lockPeriod / 2);

        uint256 aliceBalanceBeforeWithdraw = token.balanceOf(alice);
        console.log("Alice balance before withdraw:", aliceBalanceBeforeWithdraw);
        uint256 aliceWithdrawal = withdraw(alice, aliceDepositId);
        uint256 aliceBalanceAfter = token.balanceOf(alice);
        console.log("Alice balance after withdraw:", aliceBalanceAfter);

        (,uint256 liquidityIndex,,,,,,,,,,) = aavePool.getReserveData(address(token));
        uint256 currentValue = (aliceDepositAmount * liquidityIndex) / aliceEntryLiquidityIndex;
        uint256 interest = currentValue - aliceDepositAmount;
        console.log("Current value:", currentValue);
        console.log("Interest:", interest);

        (uint256 rewardPool, uint256 totalDeposits) = vaquita.periods(lockPeriod);
        assertEq(totalDeposits, 0, "Total deposits should be 0");
        assertEq(rewardPool, interest, "Reward pool should be 50e6");
        assertEq(aliceWithdrawal, initialAmount, "Alice should withdraw all her funds");
        assertEq(aliceBalanceBefore, aliceBalanceAfter, "Alice should not have lost any balance");
    }

    function test_MultipleUsersWithRewardDistribution() public {
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        bytes32 bobDepositId = keccak256(abi.encodePacked(bob, vaquita.depositNonces(bob)));
        
        // Add rewards to pool
        uint256 rewardAmount = 300e6;
        vm.startPrank(owner);
        token.approve(address(vaquita), rewardAmount);
        vaquita.addRewards(lockPeriod, rewardAmount);
        (uint256 rewardPoolInContract,) = vaquita.periods(lockPeriod);
        assertEq(rewardPoolInContract, rewardAmount, "Reward pool should be equal to rewardAmount");
        assertEq(token.balanceOf(address(vaquita)), rewardAmount, "Vaquita should have the reward amount");
        vm.stopPrank();

        // Alice deposits
        deposit(alice, initialAmount);
        (,uint256 aliceDepositAmount,,,) = vaquita.positions(aliceDepositId);
        assertEq(aliceDepositAmount, initialAmount, "Alice should deposit all her tokens");
        console.log("aliceDepositAmount", aliceDepositAmount);
        // Bob deposits twice as much as Alice
        deposit(bob, initialAmount * 2);
        (,uint256 bobDepositAmount,,,) = vaquita.positions(bobDepositId);
        assertEq(bobDepositAmount, initialAmount * 2, "Bob should deposit all his tokens");
        console.log("bobDepositAmount", bobDepositAmount);

        generateInterestAndWarpToTime(whale, token, AAVE_POOL_ADDRESS, 5_000_000e6, lockPeriod);

        (uint256 rewardPool, uint256 totalDeposits) = vaquita.periods(lockPeriod);

        console.log("vaquita.rewardPool()", rewardPool);

        uint256 aliceReward = aliceDepositAmount * rewardPool / totalDeposits;
        uint256 bobReward = bobDepositAmount * (rewardPool - aliceReward) / (totalDeposits - aliceDepositAmount);
        console.log("aliceReward", aliceReward);
        console.log("bobReward", bobReward);
        
        // Alice withdraws (should get 1/3 of reward pool since she deposited 1M out of 3M total)
        // (uint256 aliceCurrentValue, uint256 aliceInterest) = vaquita.getPositionValue(aliceDepositId);
        (,,uint256 aliceEntryLiquidityIndex,,) = vaquita.positions(aliceDepositId);
        // uint256 aliceCurrentValue = vaquita._calculateCurrentPositionValue(aliceDepositAmount, aliceEntryLiquidityIndex);
        (,uint256 currentLiquidityIndex,,,,,,,,,,) = aavePool.getReserveData(address(token));
        uint256 aliceCurrentValue = (aliceDepositAmount * currentLiquidityIndex) / aliceEntryLiquidityIndex;
        uint256 aliceInterest = aliceCurrentValue - aliceDepositAmount;
        console.log("Alice current value:", aliceCurrentValue);
        console.log("Alice interest:", aliceInterest);
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        uint256 aliceWithdrawal = withdraw(alice, aliceDepositId);
        console.log("Alice withdrawal:", aliceWithdrawal);
        uint256 aliceBalanceAfter = token.balanceOf(alice);
        
        // Bob withdraws (should get 2/3 of remaining reward pool)
        // (uint256 bobCurrentValue, uint256 bobInterest) = vaquita.getPositionValue(bobDepositId);
        (,,uint256 bobEntryLiquidityIndex,,) = vaquita.positions(bobDepositId);
        (,uint256 currentLiquidityIndex2,,,,,,,,,,) = aavePool.getReserveData(address(token));
        uint256 bobCurrentValue = (bobDepositAmount * currentLiquidityIndex2) / bobEntryLiquidityIndex;
        uint256 bobInterest = bobCurrentValue - bobDepositAmount;
        console.log("Bob current value:", bobCurrentValue);
        console.log("Bob interest:", bobInterest);
        uint256 bobBalanceBefore = token.balanceOf(bob);
        withdraw(bob, bobDepositId);
        uint256 bobBalanceAfter = token.balanceOf(bob);
        
        uint256 aliceTotal = aliceBalanceAfter - aliceBalanceBefore;
        uint256 bobTotal = bobBalanceAfter - bobBalanceBefore;
        
        console.log("Alice deposited:", initialAmount);
        console.log("Alice received:", aliceTotal);
        console.log("Alice interest:", aliceInterest);
        console.log("Alice reward:", aliceReward);
        
        console.log("Bob deposited:", initialAmount * 2);
        console.log("Bob received:", bobTotal);
        console.log("Bob interest:", bobInterest);
        console.log("Bob reward:", bobReward);
        assertEq(aliceTotal, initialAmount + aliceInterest + aliceReward, "Alice total should be initialAmount + aliceInterest + aliceReward");
        assertEq(bobTotal, initialAmount * 2 + bobInterest + bobReward, "Bob total should be initialAmount * 2 + bobInterest + bobReward");

        // Verify both users got more than they deposited
        assertGt(aliceTotal, initialAmount, "Alice should profit");
        assertGt(bobTotal, initialAmount * 2, "Bob should profit");
        (uint256 newRewardPool,) = vaquita.periods(lockPeriod);
        assertEq(newRewardPool, 0, "Reward pool should be 0");
    }

    function test_WhaleGeneratesInterest() public {
        console.log("=== Starting Whale Interest Generation Test ===");
        
        // Step 1: Alice deposits into VaquitaPool
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        deposit(alice, initialAmount);
        
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        console.log("Alice balance before deposit:", aliceBalanceBefore);
        
        (, uint256 positionAmount,,,) = vaquita.positions(aliceDepositId);
        console.log("Position amount:", positionAmount);

        // Step 2: Generate interest
        generateInterestAndWarpToTime(whale, token, AAVE_POOL_ADDRESS, 5_000_000e6, lockPeriod);
        
        // Step 3: Alice withdraws and check if she got more than she deposited
        console.log("\n=== Alice Withdrawal ===");
        
        uint256 aliceBalanceBeforeWithdraw = token.balanceOf(alice);
        console.log("Alice balance before withdraw:", aliceBalanceBeforeWithdraw);
        
        uint256 withdrawnAmount = withdraw(alice, aliceDepositId);
        
        uint256 aliceBalanceAfterWithdraw = token.balanceOf(alice);
        console.log("Alice balance after withdraw:", aliceBalanceAfterWithdraw);
        console.log("Amount withdrawn:", withdrawnAmount);
        console.log("Original deposit:", initialAmount);
        
        // Calculate profit/loss
        uint256 totalReceived = aliceBalanceAfterWithdraw - aliceBalanceBeforeWithdraw;
        console.log("Total received by Alice:", totalReceived);
        
        if (totalReceived > initialAmount) {
            uint256 profit = totalReceived - initialAmount;
            console.log("Alice made a profit of:", profit);
            console.log("Profit percentage:", (profit * 10000) / initialAmount, "basis points");
            
            // Assert that Alice made a profit
            assertGt(totalReceived, initialAmount, "Alice should have made a profit");
        } else {
            uint256 loss = initialAmount - totalReceived;
            console.log("Alice made a loss of:", loss);
            console.log("Loss percentage:", (loss * 10000) / initialAmount, "basis points");
        }
        
        // Step 4: Additional verification
        console.log("\n=== Final State Check ===");
        (uint256 rewardPool, uint256 totalDeposits) = vaquita.periods(lockPeriod);
        console.log("VaquitaPool reward pool:", rewardPool);
        console.log("VaquitaPool protocol fees:", vaquita.protocolFees());
        console.log("VaquitaPool total deposits:", totalDeposits);
        
        // Check if the position is now inactive
        (address positionOwner,,,,) = vaquita.positions(aliceDepositId);
        assertEq(positionOwner, address(0));
    }

    function test_MultipleUsersWithWhaleGeneratesInterest() public {
        // Multiple users deposit
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        bytes32 bobDepositId = keccak256(abi.encodePacked(bob, vaquita.depositNonces(bob)));
        bytes32 charlieDepositId = keccak256(abi.encodePacked(charlie, vaquita.depositNonces(charlie)));
        
        // Alice deposits
        deposit(alice, initialAmount);
        // Bob deposits
        deposit(bob, initialAmount);
        // Charlie deposits
        deposit(charlie, initialAmount);

        (, uint256 totalDeposits) = vaquita.periods(lockPeriod);
        
        console.log("Total deposits of vaquita", totalDeposits);
        assertEq(totalDeposits, 3 * initialAmount, "Total deposits should be 3 * initialAmount");
        
        // Whale makes multiple borrows and repayments to generate interest
        for (uint i = 0; i < 3; i++) {
            generateInterestAndWarpToTime(whale, token, AAVE_POOL_ADDRESS, 1_000_000e6, lockPeriod);
        }

        console.log("Token balance of vaquita before withdraws", token.balanceOf(address(vaquita)));
        
        // All users withdraw and check profits
        address[3] memory users = [alice, bob, charlie];
        bytes32[3] memory userDepositIds = [aliceDepositId, bobDepositId, charlieDepositId];
        
        for (uint i = 0; i < users.length; i++) {
            uint256 balanceBefore = token.balanceOf(users[i]);
            uint256 withdrawn = withdraw(users[i], userDepositIds[i]);
            uint256 balanceAfter = token.balanceOf(users[i]);
            
            assertEq(balanceAfter, balanceBefore + withdrawn, "User should have received the correct amount");

            console.log("User", i, "total received:", withdrawn);
            console.log("User", i, "original deposit:", initialAmount);
            
            if (withdrawn > initialAmount) {
                console.log("User", i, "profit:", withdrawn - initialAmount);
            }
        }

        console.log("Token balance of vaquita after withdraws", token.balanceOf(address(vaquita)));
        assertEq(token.balanceOf(address(vaquita)), 0, "Vaquita should have 0 balance after withdraws");
    }

    function test_PauseAndUnpause() public {
        // Only owner can pause
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        vaquita.pause();

        // Owner can pause
        vm.prank(owner);
        vaquita.pause();
        assertTrue(vaquita.paused(), "Contract should be paused");

        // Deposit should revert when paused
        vm.prank(alice);
        token.approve(address(vaquita), 1e6);
        vm.expectRevert();
        vaquita.deposit(1e6, 1 days, block.timestamp + 1 days, "");

        // Withdraw should revert when paused
        vm.expectRevert();
        vaquita.withdraw(bytes32(keccak256("id1")));

        // addRewards should revert when paused
        vm.prank(owner);
        token.approve(address(vaquita), 1e6);
        vm.expectEmit(true, true, true, true);
        emit VaquitaPool.RewardsAdded(1 days, 1e6);
        vaquita.addRewards(1 days, 1e6);

        // withdrawProtocolFees should not revert when paused
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit VaquitaPool.ProtocolFeesWithdrawn(vaquita.protocolFees());
        vaquita.withdrawProtocolFees();

        // Only owner can unpause
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        vaquita.unpause();

        // Owner can unpause
        vm.prank(owner);
        vaquita.unpause();
        assertFalse(vaquita.paused(), "Contract should be unpaused");
    }

    function test_UpdateEarlyWithdrawalFee() public {
        // Only owner can update
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        vaquita.updateEarlyWithdrawalFee(100);

        // Owner can update
        vm.prank(owner);
        vaquita.updateEarlyWithdrawalFee(100);
        assertEq(vaquita.earlyWithdrawalFee(), 100, "Early withdrawal fee should be updated");

        // Revert if fee > BASIS_POINTS
        vm.prank(owner);
        vm.expectRevert(VaquitaPool.InvalidFee.selector);
        vaquita.updateEarlyWithdrawalFee(10001);
    }

    function test_UpdateLockPeriod() public {
        // Only owner can update
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        vaquita.addLockPeriod(2 days);

        // Owner can update
        vm.prank(owner);
        vaquita.addLockPeriod(2 days);
        // lock period 2 days should be added
        assertEq(vaquita.isSupportedLockPeriod(2 days), true, "Lock period 2 days should be added");
    }

    function test_WithdrawProtocolFees() public {
        // Set early withdrawal fee to 5%
        vm.prank(owner);
        vaquita.updateEarlyWithdrawalFee(500); // 5%

        // Alice deposits
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        deposit(alice, initialAmount);

        generateInterestAndWarpToTime(whale, token, AAVE_POOL_ADDRESS, 5_000_000e6, lockPeriod / 2);

        withdraw(alice, aliceDepositId);

        // Protocol fees should be greater than 0
        assertGt(vaquita.protocolFees(), 0, "Protocol fees should be greater than 0 after early withdrawal");

        // Only owner can withdraw protocol fees
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        vaquita.withdrawProtocolFees();

        // Owner withdraws protocol fees
        vm.prank(owner);
        vaquita.withdrawProtocolFees();
        assertEq(vaquita.protocolFees(), 0, "Protocol fees should be zero after withdrawal");
    }

    function test_WithdrawRewards() public {
        // Set early withdrawal fee to 5%
        vm.prank(owner);
        vaquita.updateEarlyWithdrawalFee(500); // 5%

        // Alice deposits
        bytes32 aliceDepositId = keccak256(abi.encodePacked(alice, vaquita.depositNonces(alice)));
        deposit(alice, initialAmount);

        // Add rewards to pool
        vm.prank(owner);
        token.approve(address(vaquita), 100e6);
        vaquita.addRewards(lockPeriod, 100e6);

        vm.warp(block.timestamp + lockPeriod);

        withdraw(alice, aliceDepositId);

        // Protocol fees should be equal to 0
        assertEq(vaquita.protocolFees(), 0, "Protocol fees should be 0 after early withdrawal");
        assertGt(token.balanceOf(owner), 100e6 + initialAmount, "Owner should have received the protocol fees");
    }
}