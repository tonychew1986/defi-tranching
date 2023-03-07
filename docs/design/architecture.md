# Overall design

The loan facility consists of a pool contract which manages positions
for both the stakers and the borrowers.  The stakers will lend tokens
into a tranche, and receive interest from the tranche.

A lower tranche will receive higher interest but will take a higher
loss if a credit event occurs.

Risks
-----

The risk to both the borrower and lender would include anything that
would cause the external platform to repay a loan that is 
provided to it.  If the external platform is unable to repay a loan,
then the borrower will lose money, but since the borrower is receiving
funds from the stakers they will lose money.

Initially, the system will be used on platforms that promise increasing
rates of return (i.e. Compound).  In this situation the only risk is
platform risk (i.e. the platform gets hacked, or there is a bug that causes
it to lose coins.  However, our system will be designed so that they can
be used on platforms with market risk (i.e. you borrow coins for a token
whose value drops).


Roles
-----

The roles in the pool are as follows:

* stakers - These provide liquidity into the pool in return for
  interest the value of which is dependent on trache the stakers
  capital is located.

* borrowers - Borrowers will use the facility to get capital to
  participate in other liquidity pools.

* governor - There will be a single governor who will be
  responsible for the following:

** maintaining the oracle which will provide interest rates on the
   blockchain
** declaring a credit event
** updating the router contract to dispatch to other contracts





# Pools

The two types of coins that will be stored by the contract are base coins
which consist of coins staked by stakers and collateral provided by borrowers
and credit coins which are provided by the external liquidity pool in exchange
for borrower positions.

The pools of coins are as follows

## Treasury pools

The treasury pools consist of coins provided by the stakers to
be used to provide loans to the external platform.  The treasury
pools contains coins which have been provided by the stakers but
not yet loaned out.

## Collateral pool

These consist of coins that have been provided by the borrowers

## Credit token pool

These consist of tokens that have been provided by the external
platform.

# Contracts

The following smart contracts will be part of the system

* [Nutmeg](../contracts/Nutmeg.md) - This is the main contract class and
  will manage positions by both the borrower and the stakers.

* [adapter](../contracts/adapter.md) - Adapters will connect the pool
  contract with external liquidity providers

# Positions

Instead of using transferable tokens, the smart contracts will manage
the amounts borrowed and owed using positions which are not
transferable outside of the margin facility.

The two sets of positions are:

* staker positions
* borrower positions

# Contracts

The following smart contracts will be part of the system

* [Nutmeg](../contracts/Nutmeg.md) - This is the main contract class and
  will manage positions by both the borrower and the stakers.

* [adapter](../contracts/adapter.md) - Adapters will connect the pool
  contract with external liquidity providers

# Liquidation

The interest to be paid to the stakers will come from the collateral 
provided by the borrowers.  Therefore there must be a mechanism to 
close a position before we reach a situation in which the borrower
owes money that he cannot provide through collateral.

To deal with this situation we have a liquidation mechanism.  If at
any time, the borrower has an interest owned that is more than half
of the collateral provided, anyone can force close the position and
receive a award.

The purpose of this mechanism is so that the positions of the borrowers
can be monitored off-chain and that an off-chain bot can force close
positions which are undercollateralize.
