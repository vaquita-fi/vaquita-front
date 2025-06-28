// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {ERC20Mock} from "../lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";
import {IERC20} from "openzeppelin-contracts/contracts/interfaces/IERC20.sol";

contract VaquitaPoolTest is Test {
    VaquitaPool pool;
    address user = address(0x123);
    uint256 baseSepoliaForkBlock = 27_662_774;
    address constant AAVE_POOL = address(0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b); // Example Aave Pool address on Base Sepolia
    address constant TOKEN = address(0x036CbD53842c5426634e7929541eC2318f3dCF7e); // Example USDC address on Base Sepolia
    address constant ATOKEN = address(0xf53B60F4006cab2b3C4688ce41fD5362427A2A66); // Example aUSDC address on Base Sepolia
    address richUser = 0x52EdA770E87565ddB61cc1E9011192c5e3D5CbEc;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("base-sepolia"), baseSepoliaForkBlock);
        pool = new VaquitaPool(TOKEN, AAVE_POOL, ATOKEN, 1 days);
    }

    function test_withdrawEarly() public {
        bytes16 depositId = bytes16("testdepositid123");
        uint256 amount = 1e6; // 1 USDC (assuming 6 decimals)
        vm.startPrank(richUser);
        IERC20(TOKEN).approve(address(pool), amount);
        uint256 depositedAmount = pool.deposit(depositId, amount, 0, "");
        assertEq(depositedAmount, amount);
        (address owner,,,,,) = pool.getPosition(depositId);
        assertEq(owner, richUser);
        uint256 withdrawnAmount = pool.withdraw(depositId);
        assertEq(withdrawnAmount, amount);
        vm.stopPrank();
    }
}