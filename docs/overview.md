For protocols that reward users via liquidity mining, the biggest risk to capital providers is that the protocol suffers an event such that a portion or all of the staked capital cannot be returned. An event could be economic in nature, a theft by the protocol designers, or poorly executed code that leads to the funds being inaccessible. Whatever the case may be, many participants would rather focus on risk adjusted returns rather than incur substantial risks to principal repayment.

The Nutmeg Protocol aims to enable borrowing from a Tranched treasury pool at a variable rate for staking operations onto third party platforms to earn a yield. The yield comes in the form of interest on capital staked, and tokens received via their participation. The real innovation of Nutmeg is the creation of User directed risk and return exposures and it’s ubiquitous application across frontier projects. This Nutmeg Treasury Pool is split into three Tranches, and the interest rate received varies depending on how much risk the lenders are willing to take.

# Nutmeg Treasury Pool

Each treasury consists of single currency pools. At the start DAI, WBTC, and ETH pools will be supported. In the future, the Nutmeg community may decide to add additional currency pools. Within each single currency pool, e.g. for the DAI pool, DAI is lent for DAI interest, and DAI is borrowed paying DAI interest. This eliminates cross currency risk, and makes the smart contract containers more resilient to middleware and other economic attacks.

There are three Tranches for each currency pool AA, A, and BBB.

## AA Tranche

This is the most senior Tranche. If an event happens where a portion or all of the borrowed capital on a third party platform cannot be returned, this Tranche will suffer a loss last. In return, for taking the least risk, the interest rate offered to stakers is the lowest.

## A Tranche

This is the middle Tranche.  If an event happens where a portion or all of the borrowed capital on a third party platform cannot be returned, this Tranche will suffer a loss second. In return, for taking a medium amount of risk, the interest rate offered to stakers is not the highest but not the lowest.

## BBB Tranche

This is the most junior Tranche.  If an event happens where a portion or all of the borrowed capital on a third party platform cannot be returned, this Tranche will suffer a loss first. In return, for taking the most risk, the interest rate offered to stakers is the highest.

The interest rate offered is a variable rate that changes each day. The rate is obtained by estimating the cash and carry rate offered on major centralised crypto derivatives platforms. The daily rate is the average per annum basis achieved by looking at the difference between the 3 month quarterly Bitcoin / USD futures contract on these platforms Binance, FTX, BitMEX, Bybit, OKex, Huobi, and Deribit. This calculated rate is changed every day at 00:00 UTC. The community may decide in the future there is a better reference rate for the different currency pools.

The A Tranche’s rate will always equal this externally derived rate for every pool. The AA Tranche’s rate will be 50% of that of the A Tranche. The BBB Tranche’s rate will be 150% of that of the A Tranche.

E.g. 
Reference Rate = 20% P.A.

AA Tranche Rate = 10% P.A. = 50% * 20% P.A.

A Tranche Rate = 20% P.A. = Externally Derived Rate

BBB Tranche Rate = 30% P.A. = 150% * 20% P.A.

As illustrated, the AA Tranche’s discount subsidies the BBB Tranche’s premium. The rate charged to borrowers from the Treasury Pool will always equal the A Tranche’s rate.

# Staking into the Treasury Pool


The below describes tranche capacity respective to the other two pools:

AA Tranche:

This Tranche can accept as much capital as is willing to be staked.

A Tranche:

This Tranche can accept as much capital as is willing to be staked.

BBB Tranche:

This Tranche can only accept as much capital as is in the AA Tranche. 



# Event Waterfall Pool Allocation

When an event occurs on one or more of the third party pools, the Nutmeg protocol will systematically rebalance exposure.

Once BBB Tranche suffers up 100% loss, then A Tranche becomes affected. Once A Tranche suffers 100% loss, then AA Tranche is affected.

Assume the following distribution of assets in the DAI pool:

AA Tranche = 50 DAI

A Tranche = 100 DAI

BBB Tranche = 50 DAI

200 DAI has been borrowed and the borrower is farming on Compound. Compound suffers an event such that the borrower who borrowed 200 DAI from the pool, requested a withdrawal from Compound, and only 100 DAI were returned to them.

BBB Tranche has 50 DAI, the loss is 100 DAI, so BBB Tranche suffers a 100% loss, and now has 0 DAI. Stakers into the BBB Tranche are wiped out.

Next we move onto the A Tranche because 50 DAI of losses are still to be allocated. A Tranche has 100 DAI, the remaining loss is 50 DAI, so A Tranche suffers a 50% loss, and now has 50 DAI. Stakers into the A Tranche have their capital haircut proportional to their time spent in the pool and their percentage of the total pool’s assets. 

The AA Tranche is unaffected because the loss has been fully allocated to the BBB and A Tranches before the AA Tranche’s capital was completely wiped out. If the loss was in excess of 150 DAI, then the AA Tranche stakers would suffer a loss.

# Dynamic Risk Mitigation

Risk to Treasury Pool stakers is reduced in two ways.

The first way is that stakers can reduce their risk by staking into a Tranche that is higher up in the capital structure, therefore lower down on the loss allocation waterfall. 

The second way is that a single currency pool allows for borrowers to stake into a diversified portfolio of multiple third party pools. This means that 100% of risk is not concentrated on a single platform. Diversified portfolios allow Treasury Pool participants to receive an attractive interest rate secured by a wide variety of farms. At first Nutmeg will allow Compound and AAVE, as the protocol gains traction the community can vote to add more.

# Treasury Income

Interest income is split proportionally across each pool, and accrual based on each pool’s effective rate.

When a loan is taken out of the Treasury, the amounts are split amongst the relevant Tranches proportional to allocations at the time the loan is made effective.

AA Tranche = 50 DAI; A Tranche = 100 DAI; BBB Tranche = 50 DAI

A participant borrows 100 DAI at 20% P.A. AA Tranche loans 25 DAI; A Tranche loans 50 DAI; BBB Tranche loans 25 DAI.

Based on these amounts, the interest income is calculated.

AA Tranche Interest Income = Time * 10% P.A. * 25 DAI

A Tranche Interest Income = Time * 20% P.A. * 50 DAI

BBB Tranche Interest Income = Time * 30% P.A. * 25 DAI

Interest income will accrue and is deducted from the equity balance of the borrower. Interest income will be allocated in each pool proportionally to time in the pool and the percentage of assets a particular staker represents.

# Treasury Pool Redemption

Once funds are staked into one or more Tranches, the funds are locked up indefinitely. Only if there are unallocated funds in a particular are redemptions allowed.

If a borrower’s equity is exhausted after paying interest to the Treasury Pool, the borrower’s position on a third party pool will be redeemed and the funds returned to the Treasury Pool.

If a borrower decides to redeem from a third party pool and pay back the Treasury Pool loan, then those funds will be returned to the Treasury Pool.

(Dynamic liquidity management: both leverage and interest rates are fitted to a liquidity bonding curve. The greater the available liquidity within the treasury pool, the higher the allowable leverage and the lower the cost of borrowing. The lower the available liquidity, the lower the leverage and the higher the borrowing cost)


# Borrowing Using Nutmeg

Participants can borrow funds from a single currency Nutmeg Treasury Pool in order to stake on supported third party platforms. 

Users first create a personal vault associated with a particular currency Treasury Pool with an initial principle deposit. Nutmeg currently allows for an initial Collateralisation Ratio (CR) ratio of 10%, and a minimum CR coefficient of 50%, which equates to a minimum CR of 5%. E.g if a User deposits 10 DAI, they can borrow up to 90 DAI for total usable funds of 100 DAI to stake on a third party pool. At a future date, the community may decide to alter the initial and minimum CR ratios.

Interest will continually be charged against the equity deposited up until one of the following situations occurs:

The observed CR drops below the maintenance margin. In the above example, if the equity balance drops below 5 DAI. When this happens, the Nutmeg community may choose to interact with the protocol to unstake from the third party pool and return capital to the Treasury Pool. This will happen automatically without any actions required by the borrower. Any remaining equity is returned to the borrower.
The borrower decides to unstake from the third party pool and return the borrowed funds to the Treasury Pool.

In return for the interest paid to the Nutmeg Treasury Pool, the borrower is entitled to all interest income and tokens generated by the third party pool. Even if an event happens, the borrower may still keep all tokens generated by the third party pool.

Borrowers may elect to top up their equity balance in their vault to raise their CR ratio.

# Bonding Curve for CR and Interest Rates

The ideal state of the Nutmeg ecosystem is that 90% of funds in a particular currency’s Treasury Pool are being lent out. This is referred to as the Utilisation Rate. In order to incentivise stakers to provide capital to the Treasury Pool and farmers to borrow funds, when the Utilisation Rate deviates from 90%, the platform will dynamically adjust the CR and interest rate. Adjustments will be based on the Post Utilisation Rate after funds have been deposited or borrowed into or from the Treasury Pool.

The reason why 90% Utilisation Rate was chosen is that it allows for a small amount of funds to be available on hand to accommodate Treasury Pool stakers who wish to withdraw. The community may in the future decide to change this constant.

Post Utilisation Rate = [Old Loans Outstanding + New Loans] /  [Old Treasury Pool Balance + New Funds Staked]

The below functions describe how the CR and interest rate changes when the Utilisation Rate is not 90%.

CR = Collateralisation Ratio
IR_ADJ = Interest Rate Adjustment
UR = Utilisation Rate

For a post UR from 90% to 100%:

CR = 10% + 9 * (Post UR - 90%)
IR_ADJ = 0% + 50 * (Post UR - 90%)

If a farmer borrows funds that takes the Post UR to 100%:

CR  = 10% + 9 * 10% = 100%
IR_ADJ = 0% + 50 * 10% = 500%

At 100% UR, new loans will receive no leverage, which discourages farmers from borrowing. Existing loans’ CR will not change. Also the observed external interest rate will be increased by 500% at 00:00 UTC for ALL loans outstanding. These actions taken together will incentivise farmers to withdraw their capital from third party farms to reduce their interest expense. This will also entice stakers to provide more capital to the Treasury Pool in order to earn a higher rate. Both of these actions will in time reduce the UR such that Nutmeg returns to the ideal state.

For a Post UR from 0% to 90%:

CR = 10% - 0.1 * (90% - Post UR) = 1% + 0.1 * Post UR
IR_ADJ = Post UR - 90%

If a staker into the Treasury Pool brings the Post UR to 10%:

CR = 10% - 0.1 * (90% - 10%) = 2%
IR_ADJ = 10% - 90% = -80%

At 10% UR, new loans will only have to deposit 2% collateral, which amounts to 50x leverage. Existing loans’ CR will not change. This encourages farmers to borrow funds from the Treasury Pool. Also the observed external interest rate will be decreased by 80% at 00:00 UTC for ALL loans outstanding. These actions taken together will incentivise farmers to borrow, and Treasury Pool stakers to withdraw their capital because of the much lower interest rates. Both of these actions will in time increase the UR such that Nutmeg returns to the ideal state.


# Liquidation of Borrower Contract

The minimum CR coefficient is initially set at 50%. That means for a loan taken out at 10% CR, if the CR drops below 5% due to the payment of interest, that loan is eligible for liquidation. The community may decide to change this coefficient at a later date.

When a loan has gone into liquidation, any user who witnesses this may take over that contract and execute the liquidation process. That user will have to pay the requisite gas, but is entitled to the remaining equity attached to the loan as a fee for helping to clear the system of bad debt.

# Loan Liquidation Process:

A loan is placed into liquidation because the CR has dropped below the minimum.
On the Liquidations page, users can observe which loans are in liquidation and execute the smart contract that closes out that loan.
The user interacts with the loan smart contract, pays gas, and receives the remaining equity.
The loan principal is returned to its currency’s Treasury Pool.
If the principal is insufficient, then a credit event is declared.
The farmer / borrower receives interest income and tokens from the third party pool in which they were farming.



# Nutmeg Protocol Fees

At this time the protocol does not charge any fees for any actions taken using the protocol. The community at a future date may decide to implement fees and will decide how to allocate the fees to NUT governance token holders.





# Nutmeg Governance
Nutmeg is a community project. There will be no pre-mine, pre-farm, token sales, or team allocation of any sorts. Nut tokens will power features, utility, and incentive structures across all aspects of the platform. Operational expenses and development costs will be borne by the Sink Fund, to which 7% of all NUTs are to be allocated. NUT tokens can only be obtained via participation on the platform. Users of the Nutmeg protocol will always be the ultimate beneficiaries of the platform.

# The Sink Fund
Until such a time that the community decides to implement a platform fee to be shared amongst NUT token holders, the platform will not levy any fees. Smart contract deployment, security audits, and community management will however have costs associated with them thus a Sink Fund is established. The purpose of the Sink Fund is solely to ensure adequate capitalization of the Nutmeg protocol. If substantial excess funds were to accumulate within the Sink Fund, a governance vote can be elected to re-determine the use of proceeds. 
Launch

The Nutmeg protocol will go live on the Ethereum mainnet on March 10th 2021 at 0:00 PST. 

# NUT tokens

NUT’s are the native platform tokens of the Nutmeg protocol. Nut tokens can only be earned via interactions with the protocol and will govern all aspects of the platform including features, utility, and incentive allocation. 

# Features

ERC-20 capped at 1,000,000 NUT
Tokens are a subsidy for platform participants and are earned by using the platform
Token emission will follow a 2 week halving schedule beginning with 250,000 tokens at launch
Once token halving reaches 31,250 tokens per rewards period, halving will discontinue until remaining tokens have been distributed
NUT tokens are used to access additional risk management and yield enhancement features on the platform
If the community decides to implement a fee on the Nutmeg protocol at a later date, fees will be distributed to holders of the NUT tokens
There will be no team allocations for the Nutmeg protocol, as such the team will earn Nut tokens by staking on the platform alongside everyone else






