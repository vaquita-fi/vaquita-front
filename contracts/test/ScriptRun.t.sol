// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {DeployVaquitaPoolBaseScript} from "../script/DeployVaquitaPoolBase.s.sol";
import {UpgradeVaquitaPoolScript} from "../script/UpgradeVaquitaPool.s.sol";
import {VaquitaPoolScript} from "../script/VaquitaPool.s.sol";
import {TestUtils} from "./TestUtils.sol";

contract ScriptRunTest is TestUtils {

    function setUp() public {
        // Fork mainnet
        uint256 baseForkBlock = 32_346_386;
        vm.createSelectFork(vm.rpcUrl("base"), baseForkBlock);
    }

    function test_VaquitaPoolProxyScriptRun() public {
        DeployVaquitaPoolBaseScript deployVaquitaPoolBaseScript = new DeployVaquitaPoolBaseScript();
        address vaquitaPool = deployVaquitaPoolBaseScript.run();
        assertNotEq(vaquitaPool, address(0), "Vaquita pool should be deployed");
    }

    function test_VaquitaPoolScriptRun() public {
        VaquitaPoolScript script = new VaquitaPoolScript();
        address vaquitaPool = script.run();
        assertNotEq(vaquitaPool, address(0), "Vaquita pool should be deployed");
    }

    function test_UpgradeVaquitaPoolScriptRun() public {
        DeployVaquitaPoolBaseScript deployVaquitaPoolBaseScript = new DeployVaquitaPoolBaseScript();
        address vaquitaPool = deployVaquitaPoolBaseScript.run();
        assertNotEq(vaquitaPool, address(0), "Vaquita pool should be deployed");

        VaquitaPoolScript vaquitaPoolScript = new VaquitaPoolScript();
        address newVaquitaPool = vaquitaPoolScript.run();
        assertNotEq(newVaquitaPool, address(0), "New vaquita pool should be deployed");

        UpgradeVaquitaPoolScript upgradeVaquitaPoolScript = new UpgradeVaquitaPoolScript();

        address proxyAdminAddress = _getProxyAdmin(address(vaquitaPool));

        // Run the upgrade with the admin private key and address
        address upgradedVaquitaPool = upgradeVaquitaPoolScript.run(proxyAdminAddress, address(vaquitaPool), address(newVaquitaPool));
        assertNotEq(upgradedVaquitaPool, address(0), "Upgraded vaquita pool should be deployed");
    }
} 