// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import '../lib/Governable.sol';
import "@openzeppelin/contracts/proxy/Initializable.sol";

contract TestProxy is Initializable, Governable  {
    event debugAddressEvent(uint code, address msgAddr);
    event debugStringEvent(uint code, string msgString);
    event debugIntEvent(uint code, uint msgInt);
    
   function initialize(address _governor) external initializer {
       __Governable__init(_governor);
   }
    function echoSender() external returns (address) {
        emit debugAddressEvent(1, msg.sender);
        return msg.sender;
    }
    function acceptGovernorDebug() external {
        if(msg.sender == pendingGovernor) {
            emit debugAddressEvent(3, msg.sender);
            emit debugAddressEvent(3, pendingGovernor);
            pendingGovernor = address(0);
            governor = msg.sender;
            emit debugStringEvent(5, 'acceptGovernor: success');
        } else {
            emit debugStringEvent(5, 'acceptGovernor: failed');
        }
    }
    
}
