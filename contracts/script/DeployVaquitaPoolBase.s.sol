// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract DeployVaquitaPoolBaseScript is Script {
    function run() public returns (address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        VaquitaPool implementation = new VaquitaPool();
        console.log("VaquitaPool implementation:", address(implementation));

        // Encode initializer data
        address aavePool = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5; // Base Aave V3 Pool
        address token = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
        uint256 lockPeriod = 90 days;
        uint256[] memory lockPeriods = new uint256[](1);
        lockPeriods[0] = lockPeriod;
        bytes memory initData = abi.encodeWithSelector(
            implementation.initialize.selector,
            token,
            aavePool,
            lockPeriods
        );

        // Deploy proxy
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(implementation),
            owner,
            initData
        );
        console.log("VaquitaPool proxy:", address(proxy));

        vm.stopBroadcast();

        return address(proxy);
    }
} 