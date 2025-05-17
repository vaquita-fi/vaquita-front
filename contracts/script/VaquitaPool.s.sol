// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";

contract DeployVaquitaPoolBaseSepolia is Script {
    function run() public returns (VaquitaPool) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Base Sepolia Aave V3 Pool addresses
        address aavePool = 0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b; // Base Sepolia Aave V3 Pool
        address usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // Base Sepolia USDC
        address aUSDC = 0xf53B60F4006cab2b3C4688ce41fD5362427A2A66; // Base Sepolia aUSDC

        // Deploy VaquitaPool with 1 day lock period
        VaquitaPool pool = new VaquitaPool(
            usdc,
            aavePool,
            aUSDC,
            1 days
        );

        vm.stopBroadcast();
        return pool;
    }
} 