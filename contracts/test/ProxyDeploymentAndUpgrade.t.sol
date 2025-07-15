// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {VaquitaPool} from "../src/VaquitaPool.sol";
import {TestUtils} from "./TestUtils.sol";

contract ProxyDeploymentAndUpgradeTest is TestUtils {
    address constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5; // Base Aave V3 Pool
    address constant TOKEN = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
    uint256 lockPeriod = 1 days;

    function setUp() public {
        uint256 baseForkBlock = 32_346_386;
        vm.createSelectFork(vm.rpcUrl("base"), baseForkBlock);
    }

    function test_VaquitaPoolProxyDeploymentAndUpgrade() public {
        VaquitaPool implementation = new VaquitaPool();
        uint256[] memory lockPeriodsArr = new uint256[](1);
        lockPeriodsArr[0] = lockPeriod;
        bytes memory initData = abi.encodeWithSelector(
            implementation.initialize.selector,
            TOKEN,
            AAVE_POOL,
            lockPeriodsArr
        );
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(implementation),
            address(this),
            initData
        );
        VaquitaPool proxied = VaquitaPool(address(proxy));
        assertEq(proxied.lockPeriods(0), lockPeriod, "Lock period should be set");

        address proxyAdminAddress = _getProxyAdmin(address(proxy));
        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        VaquitaPool newImpl = new VaquitaPool();
        proxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(proxy)),
            address(newImpl),
            ""
        );
        assertEq(proxyAdmin.owner(), address(this), "ProxyAdmin owner should be test contract");
        assertEq(proxied.lockPeriods(0), lockPeriod, "Lock period should still be set after upgrade");
        assertEq(address(proxied.token()), TOKEN, "token should be set");
        assertEq(address(proxied.aavePool()), AAVE_POOL, "aavePool should be set");
    }
}