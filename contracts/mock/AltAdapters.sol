// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../adapters/CompoundAdapter.sol";
import "../interfaces/INutmeg.sol";
contract CompoundAdapterAltA is CompoundAdapter {
    constructor(INutmeg nutmegAddr) CompoundAdapter(nutmegAddr) {
    }
}

contract CompoundAdapterAltB is CompoundAdapter {
    constructor(INutmeg nutmegAddr) CompoundAdapter(nutmegAddr) {
    }
}
