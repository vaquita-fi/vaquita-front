// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DepositScript is Script {
    function run(address vaquitaPoolAddress, address usdcAddress) public {
        // call deposit function from vaquita base sepolia contract
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        uint256 amount = 1000000;

        // approve usdc to be spent by vaquita pool
        IERC20(usdcAddress).approve(vaquitaPoolAddress, amount);

        // call deposit function from vaquita base sepolia contract
        VaquitaPool(vaquitaPoolAddress).deposit(
            amount,
            1 weeks,
            vm.getBlockNumber() + 1000,
            "0x0"
        );

        vm.stopBroadcast();
    }
}