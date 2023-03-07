# References

- [Alpha Homora V2 code](https://github.com/AlphaFinanceLab/homora-v2) - source code for alpha homora
- https://compound.finance/
- [Setting up devenv](devenv.md)

# Structure
AlphaHomora has four parts.

1) Bank [source
code](https://github.com/AlphaFinanceLab/homora-v2/blob/master/contracts/HomoraBank.sol)
- The main part is a single smart contract called bank that handles
borrowers.  The bank can access several banks each of which is
connected to a single pool of tokens.  The bank manages positions for
each user connected to the bank.

- The bank is connected to the external liquidity pool using "spells"
and is connected to the pool of payment tokens using "ctokens" which
are smart contracts which contain interest rate tokens.

2) Spells [source code](https://github.com/AlphaFinanceLab/homora-v2/tree/master/contracts/spell) - AlphaHomora connects to the external liquidity pool using
spells.  Spells contain strategies which the bank can connect to
external liquidity pools with a strategy.

3) Interest rate tokens - AlphaHomora does not create its own interest
rate tokens but rather it uses tokens that use with the compound
protocol.  The interest rate tokens have a lot of internal
functionality.

4) Margin oracles [source
code](https://github.com/AlphaFinanceLab/homora-v2/tree/master/contracts/oracle)
- The margin oracles calculate the collateral credit and the borrow
credit.  They consist of two parts.  The base oracle has the eth per pieces.  The prices in eth is then put in through [ProxyOracle](https://github.com/AlphaFinanceLab/homora-v2/blob/master/contracts/oracle/ProxyOracle.sol)

# Connection with liquidity pool

The connection with the external liquidity pool is connected via
doBorrow and doRepay in HomoraBank and calls only borrow and
repayBorrow.  Also borrowBalanceCurrent is used to calculate fees.

# Margining

The total amount of leverage is determined by how much collateral
there is in the pool, how much liquidity there is in the pool, and how
much liquidity has already been used.  These amounts are put into an
oracle that calculates the leverage available.

The margin calculation first calculates the amount of ethereum (ethPX)
available per unit of collateral or borrow.  For items like uniswap
pairs, the ethPX value is determined from the reserve levels available
in
[uniswap-v2](https://github.com/AlphaFinanceLab/homora-v2/blob/master/contracts/oracle/UniswapV2Oracle.sol).
The collateral value and borrow value are then calculated from the
collateral in the pool and the liquidity in the pool.

# Liquidation

If a user exceeds the maximum debt value, then a liquidator can
declare the position liquidated and receive five percent of the
collateral.  This mechanism is an extremely clever way of avoiding
using a large amount of gas to execute a liquidation as it
incentivizes an external user into search for what positions are to be
liquidated and to use their gas to run the liquidation.

# Withdrawal limits

Although interest tokens are entitled to receive coins when the tokens
are withdrawal, there is no guarantee that this will occur.  If you
have a situation in which a large amount of the pool is locked in an
external liquidity pool, the stakers make not be able to withdraw
their coins immediately.

