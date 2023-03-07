// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
import "./MockERC20.sol";

contract MockERC20AltA is
MockERC20("MockERC20AltA", "MOCKERC20ALTA", 18) {
}

contract MockERC20AltB is
MockERC20("MockERC20AltB", "MOCKERC20ALTB", 18) {
}

contract MockERC20AltC is
MockERC20("MockERC20AltC", "MOCKERC20ALTC", 6) {
}

import "./MockCERC20.sol";

contract MockCERC20AltA is MockCERC20Base {
    constructor(address tokenAddr)
    MockCERC20Base(tokenAddr, "MockCERC20 AltA", "MOCKCERC20ALTA", 18) {
    }
}
contract MockCERC20AltB is MockCERC20Base {
    constructor(address tokenAddr)
    MockCERC20Base(tokenAddr, "MockCERC20 AltB", "MOCKCERC20ALTB", 18) {
    }
}
contract MockCERC20AltC is MockCERC20Base {
    constructor(address tokenAddr)
    MockCERC20Base(tokenAddr, "MockCERC20 AltC", "MOCKCERC20ALTC", 6) {
    }
}

