## `IAdapter`






### `openPosition(address baseToken, address collToken, uint256 collAmount, uint256 borrowAmount)` (external)





### `closePosition() → uint256` (external)





### `liquidate()` (external)





### `settleCreditEvent(address baseToken, uint256 collateralLoss, uint256 poolLoss)` (external)






### `openPositionEvent(uint256 positionId, address caller, uint256 baseAmt, uint256 borrowAmount)`





### `closePositionEvent(uint256 positionId, address caller, uint256 amount)`





### `liquidateEvent(uint256 positionId, address caller)`





### `creditEvent(address token, uint256 collateralLoss, uint256 poolLoss)`





