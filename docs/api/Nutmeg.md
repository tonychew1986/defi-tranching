## `Nutmeg`





### `poolLock()`



Reentrancy lock guard.

### `inExecution()`



Reentrancy lock guard for execution.

### `accrue(address token)`



Accrue interests in a pool


### `initialize(address _governor)` (external)



Initialize the smart contract, using msg.sender as the first governor.

### `setNutDistributor(address addr)` (external)





### `setNut(address addr)` (external)





### `setMinNut4Borrowers(address poolAddr, address adapterAddr, uint256 val)` (external)





### `getStakeIds(address lender) → uint256[]` (external)

Get all stake IDs of a lender



### `getPositionIds(address borrower) → uint256[]` (external)

Get all position IDs of a borrower



### `getCurrPositionId() → uint256` (external)

Return current position ID



### `getNextPositionId() → uint256` (external)

Return next position ID



### `getPosition(uint256 id) → struct INutmeg.Position` (external)

Get position information



### `getCurrSender() → address` (external)



get current sender

### `getPools() → address[]` (external)



Get all treasury pools

### `getPool(address addr) → struct INutmeg.Pool` (external)



Get a specific pool given address

### `addPool(address token, uint256 interestRate)` (external)



Add a new treasury pool.


### `updateInterestRates(address token, uint256 interestRate)` (external)



Update interest rate of the pool


### `_isInterestRateValid(uint256 interestRate) → bool` (internal)





### `stake(address token, uint256 tranche, uint256 principal)` (external)

Stake to a treasury pool.




### `unstake(address token, uint256 tranche, uint256 amount)` (external)

Unstake from a treasury pool.




### `_scaleByLossMultiplier(struct INutmeg.Stake stk, uint256 quantity) → uint256` (internal)





### `accrueInterest(address token)` (internal)

Accrue interest for a given pool.




### `getPoolInfo(address token) → uint256, uint256, uint256` (external)

Get pool information




### `getPositionInterest(address token, uint256 posId) → uint256` (public)

Get interest a position need to pay




### `updateInterestRateAdjustment(address token)` (public)



Update the interest rate adjustment of the pool


### `_getWithdrawAmount(struct INutmeg.Pool pool, uint256 amount) → uint256` (internal)





### `_getCollateralRatioPct(address baseToken, uint256 baseAmt) → uint256` (public)



Get the collateral ratio of the pool.


### `getMaxBorrowAmount(address baseToken, uint256 baseAmt) → uint256` (public)

Get the maximum available borrow amount




### `getStake(address token, address owner) → struct INutmeg.Stake[3]` (public)

Get stakes of a user in a pool




### `addAdapter(address token)` (external)



Add adapter to Nutmeg


### `removeAdapter(address token)` (external)



Remove adapter from Nutmeg


### `borrow(address baseToken, address collToken, uint256 baseAmt, uint256 borrowAmt)` (external)

Borrow tokens from the pool. Must only be called by adapter while under execution.




### `_getRepayAmount(uint256[3] loans, uint256 totalAmt) → uint256[3]` (public)





### `repay(address baseToken, uint256 repayAmt)` (external)

Repay tokens to the pool and close the position. Must only be called while under execution.




### `liquidate(address baseToken, uint256 liquidateAmt)` (external)

Liquidate a position when conditions are satisfied




### `distributeCreditLosses(address baseToken, uint256 collateralLoss, uint256 poolLoss)` (external)

Settle credit event callback




### `addCollToken(uint256 posId, uint256 collAmt)` (external)

Add collateral token to position. Must be called during execution.




### `getEarnedInterest(address token, address owner, enum INutmeg.Tranche tranche) → uint256` (external)





### `beforeExecution(uint256 posId, contract IAdapter adapter)` (internal)

-------------------------------------------------------------------
functions to adapter



### `afterExecution()` (internal)





### `openPosition(uint256 posId, contract IAdapter adapter, address baseToken, address collToken, uint256 baseAmt, uint256 borrowAmt)` (external)





### `closePosition(uint256 posId, contract IAdapter adapter) → uint256` (external)





### `liquidatePosition(uint256 posId, contract IAdapter adapter)` (external)





### `settleCreditEvent(contract IAdapter adapter, address baseToken, uint256 collateralLoss, uint256 poolLoss)` (external)





### `getMaxUnstakePrincipal(address token, address owner, uint256 tranche) → uint256` (external)






