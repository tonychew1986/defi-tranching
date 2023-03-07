// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "../Nutmeg.sol";

// @notice This contract is a version of Nutmeg that contains additional
// interfaces for testing

contract NutmegAltA is Nutmeg {
    //@notice output version string
    function getVersionString()
    external virtual pure returns (string memory) {
        return "nutmegalta";
   }
}

contract NutmegAltB is Nutmeg {
    //@notice output version string
    function getVersionString()
    external virtual pure returns (string memory) {
        return "nutmegaltb";
   }
   function ping() external returns (address) {
      return msg.sender;
  }
}

