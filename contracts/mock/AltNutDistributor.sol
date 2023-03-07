// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
import "../NutDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

// @notice This contract is a version of NutDistributor that allows
// the epoch intervals to be changed for testing

contract NutDistributorAltA is NutDistributor {
    //@notice output version string
    function getVersionString()
    external virtual pure override returns (string memory) {
        return "nutdistributoralta";
   }
}

contract NutDistributorAltB is NutDistributor {
    //@notice output version string
    function getVersionString()
    external virtual pure override returns (string memory) {
        return "nutdistributoraltb";
   }
}

