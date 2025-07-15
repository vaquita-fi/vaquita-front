// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title IAToken
 * @author Aave
 * @notice Defines the basic interface for an AToken in Aave V3.
 */
interface IAToken {
    /**
     * @dev Returns the address of the underlying asset of this aToken
     * @return The address of the underlying asset
     */
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);

    /**
     * @dev Returns the balance of the account
     * @param account The address of the account
     * @return The balance of the account
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Returns the total supply of the token
     * @return The total supply of the token
     */
    function totalSupply() external view returns (uint256);
}
