// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {TransparentUpgradeableProxy} from "../lib/openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "../lib/openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol";

contract VaquitaPoolProxyScript is Script {
    function run() public returns (address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        VaquitaPool implementation = new VaquitaPool();
        console.log("VaquitaPool implementation:", address(implementation));

        // Encode initializer data
        address aavePool = 0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b; // Base Sepolia Aave V3 Pool
        address token = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // Base Sepolia USDC
        address aToken = 0xf53B60F4006cab2b3C4688ce41fD5362427A2A66; // Base Sepolia aUSDC
        uint256 lockPeriod = 1 days;
        bytes memory initData = abi.encodeWithSelector(
            implementation.initialize.selector,
            token,
            aavePool,
            aToken,
            lockPeriod
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