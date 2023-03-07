## `CompoundAdapter`





### `onlyNutmeg()`






### `constructor(contract INutmeg nutmegAddr)` (public)





### `addTokenPair(address baseToken, address collToken)` (external)



Add baseToken collToken pairs

### `removeTokenPair(address baseToken)` (external)



Remove baseToken collToken pairs

### `openPosition(address baseToken, address collToken, uint256 baseAmt, uint256 borrowAmt)` (external)

Open a position.




### `closePosition() → uint256` (external)

Close a position by the borrower



### `liquidate()` (external)

Liquidate a position



### `creditTokenValue(address baseToken) → uint256` (public)

Get value of credit tokens



### `settleCreditEvent(address baseToken, uint256 collateralLoss, uint256 poolLoss)` (external)

Settle credit event




### `_increaseDebtAndCollateral(address token, uint256 posId)` (internal)





### `_decreaseDebtAndCollateral(address token, uint256 posId, uint256 redeemAmt)` (internal)



decreaseDebtAndCollateral

### `_doMint(struct INutmeg.Position pos, uint256 amount) → uint256, uint256` (internal)



Do the mint from the 3rd party pool.this

### `_doRedeem(struct INutmeg.Position pos, uint256 amount) → uint256, uint256` (internal)



Do the redeem from the 3rd party pool.

### `_getCollTokenAmount(struct INutmeg.Position pos) → uint256` (internal)



Get the amount of collToken a position.

### `_calcLatestSumIpc(address collToken) → uint256` (internal)



Calculate the latest sumIpc.


### `_okToLiquidate(struct INutmeg.Position pos) → bool` (internal)



Check if the position is eligible to be liquidated.


