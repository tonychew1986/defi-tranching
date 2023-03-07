## `INutmeg`






### `getStakeIds(address lender) → uint256[]` (external)



Get all stake IDs of a lender

### `getPositionIds(address borrower) → uint256[]` (external)



Get all position IDs of a borrower

### `getMaxBorrowAmount(address token, uint256 collAmount) → uint256` (external)



Get the maximum available borrow amount

### `getCurrPositionId() → uint256` (external)



Get the current position while under execution.

### `getNextPositionId() → uint256` (external)



Get the next position ID while under execution.

### `getCurrSender() → address` (external)



Get the current sender while under execution

### `getPosition(uint256 id) → struct INutmeg.Position` (external)





### `getPositionInterest(address token, uint256 positionId) → uint256` (external)





### `getPoolInfo(address token) → uint256, uint256, uint256` (external)





### `addCollToken(uint256 posId, uint256 collAmt)` (external)



Add Collateral token from the 3rd party pool to a position

### `borrow(address token, address collAddr, uint256 baseAmount, uint256 borrowAmount)` (external)



Borrow tokens from the pool.

### `repay(address token, uint256 repayAmount)` (external)



Repays tokens to the pool.

### `liquidate(address token, uint256 repayAmount)` (external)



Liquidate a position when conditions are satisfied

### `distributeCreditLosses(address baseToken, uint256 collateralLoss, uint256 poolLoss)` (external)



Settle credit event


### `addPoolEvent(address bank, uint256 interestRateA)`





### `stakeEvent(address bank, address owner, uint256 tranche, uint256 amount, uint256 depId)`





### `unstakeEvent(address bank, address owner, uint256 tranche, uint256 amount, uint256 depId)`





