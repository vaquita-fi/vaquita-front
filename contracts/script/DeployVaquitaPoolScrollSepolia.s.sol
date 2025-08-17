// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract DeployVaquitaPoolScrollSepoliaScript is Script {
    function run() public returns (address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        VaquitaPool implementation = new VaquitaPool();
        console.log("VaquitaPool implementation:", address(implementation));

        // Encode initializer data
        address aavePool = 0x48914C788295b5db23aF2b5F0B3BE775C4eA9440; // Scroll Sepolia Aave V3 Pool
        address token = 0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D; // Scroll Sepolia USDC
        uint256 lockPeriod = 1 weeks;
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