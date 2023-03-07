What the tests do
-----------------
borrow - basic borrow scenario
credit - check credit code
liquidate - check liquidation
stake - test stake

check-requires - test check requires
churn - add and remove large amounts of tokens
fork - test fork mainnet
interest - test interest algos
mock-adapter - basic tests using mock adapter
mock-adapter-borrow - basic borrow tests using mock adapter

utils - library

Where to start
--------------

borrow has a basic workflow that does borrowing
stake has a basic workflow that does stake
liquidate has a basic workflow that does liquidation
credit has a basic workflow that does credit events

interest and churn has obsolete interest rate routines

How to force interest accrue
----------------------------
test_nutmeg._forceAccrueInterest(token, {from: governor})

Todo
----

1) All of the console.logs need to be changed to asserts.  Look at
borrow1 for how to match a lot of outputs

2) Any time coins get moved (i.e. borrow or stake) there should be
an assert that looks at the coin balances

3) There are still some uncovered calls in "truffle run coverage"

4) Churn is an example of the code doing large deposits and withdraws,
we need some tests that run borrow1.js and stake1.js with large
amounts of coins

# Scenarios to test

There are more scenarios then one has time to do so get as many as possible

1) start with borrow.js and put in large inputs or small inputs
2) take borrow and stake and then just randomly change the inputs and add or remove commands
3) start with borrow.js and add in multiple borrows and multiple redeemds
4) start with borrow.js reset the exchange rate of compound contracts to return more coins
5) start with borrow.js reset the compound contract to create an error
6) put in a small stake, then have a borrower borrow as much stuff as possible, then have the staker try to get his coins
7) simulate a total loss with the compound contract
8) change the interest rate and see what happens - use very large or very small values

-----
Joe's todos
-----
1) add test that runs against actual compound adapter
2) add test that sees if interest numbers are correct
