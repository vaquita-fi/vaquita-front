// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IUSDCPermit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        bytes memory signature
    ) external;
}