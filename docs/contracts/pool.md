# Pool contract

This is the main contract class and will be called by stakers to
  provide capital and the borrowers to use capital.


The pool contract will manage the staker and borrower positions, and
will hold tokens provided by both the stakers and the borrowers.  The
pool contract will also initiate credit events.

# Interest rate conventions

Interest rates will be simple interest rates pro-rated over the time
that the pool has been staked.  The starting point of the interest
will be the timestamp of the block in which the add liquidity has been
added, and the ending point will be the timestamp of the block
preceding the one in which the interest is transfered.

# Tranches

## AA Tranche:

1. This is the most senior tranche and suffers principal loss last..
2. This tranche’s interest rate is 50% lower than the A Tranche rate.

## A Tranche:

1. This is the mezzanine tranche and suffers principal loss second.
2. This trache’s interest rate is defined by the 3m Per Annum basis on the average
BTC/USD futures across the major exchanges (BitMEX, Binance, OKex, Huobi, Bybit,
and FTX).
a. This rate must be provided by an on-chain oracle.
b. A liquidity multiplier will be applied to maintain redemption float

## BBB Tranche

1. This is the most junior tranche and suffers principal loss first.
2. This tranche is capped 1:1 to the ratio of available collateral in AA
3. This tranche’s interest rate is 50% higher than the A Tranche rate.

# Borrow
1. The leverage rate is set at 10x.
a. Users deposit 10% equity in the form of DAI, and borrow the remaining 90% from
the pool.
2. The user is given an NFT that represents the equity they deposited. (alternative. See
alpha homora for vault strategy in lue of NFT)
a. This NFT will get slipped continuously by the weighted average pool interest rate.
b. The amount of equity the user is able to withdraw is defined by f(x) = NFT * (1 -
interest % accrued) * Initial Deposit.
i.
It follows that the NFT will equal zero when the interest costs outweigh
the initial deposit of the user. At that point the contract will unwind, and
the user will receive the liquidity tokens they mined, and the treasury pool
will receive back their principal and interest.
3. The user will select which farm they wish to use the borrowed funds to liquidity mine.
4. They will accrue the farmed token in the contract, and can withdraw at any time.a. The user will receive back their equity after paying interest costs in DAI, and
100% of the tokens they were farming.

# Treasury Pool Staking
## Staking
1. Users can stake into whichever tranche has available space for additional capital.
2. The ratios of the different pools above must be met at all times at the minimum
3. Initially the platform will only allow staking into the A tranche to build up TVL.
a. Then the amount allowed in the AA and BBB tranches will be determined by the
total amount staked in the A tranche.
b. E.g. If the initial A tranche TVL is 1,000 DAI, then only 500 DAI can be deposited
in each of the AA or BBB tranche.
4. The platform frontend will clearly show how much available capacity each tranche has.

## Redemption
1. Stakers in the treasury pool can submit a withdrawal of their principle at any time.
2. They are entitled to their portion of the paid / accrued interest of the entire pool, and their
principal at any time.
a. However, if there are not unused funds in the pool and their specific tranche, they
must enter the redemption queue.
b. Interest rates will be adjusted proportionally higher by the ratio of unmet
redemptions to the total treasury pool.
i.
E.g. If 100 DAI wishes to be redeemed and the total pool size is 1,000
DAI, the A Tranche rate will be increased by 10%. If the A Tranche rate is
10% the new rate will be 10% * (1 + 10%) = 11%. This will affect the
weighted average cost of capital.
Interest:
1. Interest rates on the A Tranche will be changed every day at 00:00 UTC.
2. The rate will update based on the latest per annum BTC/USD basis. It will also be
adjusted by the redemption queue offset described above.
3. Interest will be charged continuously.

# Credit Events

1. A credit event is when a staking platform does or cannot pay back 100% of the principle
staked.
2. Any and all collateral in that pool that can be recovered will be recovered. In addition, all
platform tokens that were awarded and have not been distributed or sold will be locked
in the protocol and then on sold for DAI.3. The total DAI lost will then be deducted from the different tranches according to the
position in the waterfall.
a. E.g. AA - 100 DAI, A - 200 DAI, BBB - 100 DAI
b. The credit event loss is 150 DAI
c. BBB is wiped out
d. A losses 50 DAI
e. AA suffers no loss

# Governance Token
1. Borrowers and treasury pool capital providers will all receive NUT tokens for their
participation.
a. The rates at which tokens will be distributed will be defined at a later stage
2. No platform fees will be charged at first. After a platform is live for a few months,
governance token holders will vote on whether to implement fees and at what quantum.
