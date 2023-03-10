# Liquidity pool

Liqudity pool token(s) are tokens given to providers of liquidity to
allow them to receive interest

# API


# Design Notes

--------------------
Guys, some thoughts on LP tokens and the corresponding interests:

Users can stake into any tranche whichever is available in every pool, as a result, LP tokens will be entitled to users. The LP tokens can be freely transferred, exchanged, and they can be redeemed any time with accrued interests.

Approaches for LP token design:
1. The LP token is ERC20 token, which is fungible. Therefore, the accrued interests can only be calculated as total_interests * ( redeemed_tokens / total_tokens ). 
-- Pros: easy to calculate the accrued interests, simply by shares of the liquidity.
-- Cons: the whales may game the system by adding a massive amount of liquidity and redeem all the LP tokens immediately, taking away most of the interests generated by others. We may introduce higher fees for large withdrawal, but fairness is still an issue here.

2. The LP token is a ERC1155 token, which is semi-fungible. Therefore, some meta information can be used for calculating interests.  The accrued interests can only be calculated as total_interests * ( dsec_of_redeemed_tokens / dsec_of_total_tokens ). More specifically, dsec = principals * staking_period_in_seconds.
-- Pros: resilient to flash stakers who just want to game the system for interests
-- Cons: not that fair to late stakers, as the early stakers have first-mover advantage. Probably we can adjust the interest rate to trade it off.

Please let me know your thoughts/comments
----------------------

(joe) - I think that LP tokens should be ERC1155 because if you use
them as ERC20 tokens, then someone can create a liquidity pool from
ERC20 tokens or put them onto an exchange and then can game the system
by generating some sort of strange loop.  (i.e. create a LP with the
LP ERC20 point the our LP to their LP or convert LP to ETH and then
add the ETH to LP and create new LP).

Also if they are ERC20 tokens, then they will have some market value
which may be very different from the interest value.

I think that we can avoid these problems my making them ERC1155.  As
far as keeping people from gaming the system, I think we can do that
by carefully setting up the interest algorithm.

The way I think we can do the interest is to keep a running balance of
the interest generated and the interest removed.  If we record the
interest pool size at the time the token was issued, we can calculate
the fraction of the pool that the token is entitled to.
