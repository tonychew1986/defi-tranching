## `NutDistributor`





### `onlyNutmeg()`






### `setNutmegAddress(address addr)` (external)



Set the Nutmeg

### `setPriceOracle(address addr)` (external)



Set the oracle

### `initialize(address nutAddr, address _governor)` (public)





### `inNutDistribution() → bool` (external)





### `updateVtb(address token, address lender, uint256 incAmount, uint256 decAmount)` (external)

Update valueTimesBlocks of pools and the lender when they stake or unstake




### `_fillVtbGap(address token, address lender)` (internal)





### `_fillTotalVtbGap(address token)` (internal)





### `distribute()` (external)



Distribute NUT tokens for the previous epoch

### `collect()` (external)



Collect Nut tokens

### `getCollectionAmount() → uint256` (external)



getCollectionAmount get the # of NUT tokens for collection

### `getVtb(address pool, address lender, uint256 i) → uint256` (public)





### `getTotalVtb(address pool, uint256 i) → uint256` (public)





### `getVersionString() → string` (external)






