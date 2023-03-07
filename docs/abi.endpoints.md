# abi needed

## Variables:

#### 1.[home page] Get TVL over time:
Solution:


#### 2. [home page] GET Treasury balance over time:
Solution:


#### 3. [home page] GET Funds Borrowed:
Solution:


#### 4. [home page] GET Treasury pool: 
Solution:


#### 5. [home page] GET user available balance for earn:
Solution:


#### 6. [home page] GET user available balance for farm:
Solution:


#### 7. [navigation] GET current earn %:
Solution:


#### 8. [navigation] GET max leverage:
Solution:


#### 9. [navigation] GET highest farming yield:
Solution:


#### 10. [portfolio page] GET user earn positions:
Solution:


#### 11. [portfolio page] GET user farm positions:
Solution:


#### 12. [earn page] GET tranche information (apy, tvl, leverage, fee, etc.):
Solution:


#### 13. [farm page] GET available asset to farm:
Solution:


#### 14. [farm page] GET available farms for chosen asset:
Solution:


#### 15. [farm page] GET available farms information (apy, tvl, leverage, fee, etc.):
Solution:

---

## Functions: - should probably change the names to stake/unstake

#### 1.[earn page] POST deposit:
Solution:
Nutmeg.stake(token, tranche, amount)

see borrow1.js for example

#### 2. [earn page] POST withdraw:
Solution:
Nutmeg.unstake(token, tranche, amount)

see borrow1.js for example

#### 2. [farm page] POST farm:  (This may be should be put into two different items borrow and redeem)

The Nutmeg interace is

Nutmeg.execute(0 or pos, adapter.address,
 openPosition.contract.method(token, ctoken, collateral, borrow))

Nutmeg.execute(0 or pos, adapter.address,
 closePosition.contract.method())

Nutmeg.execute(0 or pos, adapter.address,
 openPosition.contract.method(token, ctoken, collateral, borrow

Nutmeg.execute(0 or pos, adapter.address,
 openPosition.contract.method(token, ctoken, collateral, borrow

The TestNutmeg interface is (see borrow1.js)
TestNutmeg.borrowOpenPosition(0 or positionid, adapter, token, ctoken, collateral, borrow)

and

TestNutmeg.closePosition(positionId, adapter)


