Loss Implementation Specification
Last Updated 2021 April 20


The original version of the document is on google docs.  The version on github is a copy of the version on google docs.  Modifications should be made to the google doc and then copied over into github.




1. Architecture
2. Basic loss distribution algorithm
3. Algorithm with interest
4. Adding to positions
5. Loss detection


# Architecture


There are two basic functions in the loss implementation strategy.  Loss detection and loss distribution.  The adapter is responsible for 
1. detecting that a loss has or may occur 
2. to calculate the amount of this loss.
3. Distributing the loss to either collateral or the treasury pool


The adapter will subtract losses first from the collateral associated with the adapter and if this is insufficient will then execute the pool loss algorithm in the nutmeg contract.


The nutmeg contract is responsible for distributing these losses to users.  If the amount is allocated to collateral then nutmeg will subtract the loss from the total collateral of the contract.  If is is insufficient it will execute the following algorithm to perform tranching.


# Basic loss distribution algorithm


To illustrate the basic algorithm first we assume a situation where no interest is paid


The way we can implement this is via credit multipliers


So at the start we have


Borrower
-------------
| Pool     | Shares  |
---------
| Comp | 100 |
| Aave | 100 |
------------




Lender


----------------
|Tranche | Total active shares | Multiplier | 
----------------------------------------
| A      |  50 | 1.0 |
| B      | 100 | 1.0 | 
| C      |  50 | 1.0 | 
-------------------------------


Comp suffers 100 percent loss so now on the borrow side we have:




Borrower
-------------
| Pool     | Shares    |
---------
| Comp | 0 |
| Aave | 100 |
------------


Lender


--------------------------------------------
|Tranche |  Shares active | Multiplier
-------------------------------------------
| A      | 50 | 1.0 |
| B      | 50 | 0.5 |
| C      |  0 | 0  |
------------------------------------


At this point, any further interest gets split between trache A gets
half the benefit and tranche B gets half the benefit and C gets
nothing.


If Aave suffers a 25 percent loss


Borrower
-------------
| Pool     | Shares    |
---------
| Comp | 0 |
| Aave | 75 |
------------


Our lender table now looks like


Lender


--------------------------------------------
|Tranche |  Total shares active | Multiplier |
-------------------------------------------
| A      | 50        | 1.0  |
| B      | 25       |  0.25 |
| C      |  0       | 0   |
---------------------------------------------


So that any benefit gets split with 2/3 going to A and 1/3 going to B.


The tricky part is what happens if people put in and take out shares
at different times and this can be accounted for by bookkeeping
involving the multipliers.


# Running totals


The way of keeping track of deposits is by keeping a running sum in each tranche of


1. The multiplier at the time of purchase
2. The time at which the pool last went to zero


The basic equations are 


If (time bought <= last_reset_time) 
   (active shares) = 0
Else
   (my active shares) = (my shares bought) * (multiplier current) / (multiplier when bought)


And for each tranche


If (active_shares ==  0) 
   Time reset = current_time
   Multiplier = 1.0


The result of this is that if the number of active shares every goes down to zero then all of the counters are reset and everything that happens before the reset is forgotten.   We may also want to have a rule that says that if a tranche busts if it almost busts.




So we start with


Time = 1


-------------
| Pool     | Shares  |
---------
| Comp | 100 |
| Aave | 100 |
------------


--------------------
| Tranche | Total active shares | multipler | Time reset | |
---------------------------------------------------------
| A | 50 |  1.0  | 0 | 
| B | 100 |  1.0 | 0 |
| C | 50|  1.0 | 0 | 
-----------------












Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50   | 1.0 | 0 | 50 | 
| B1      | 100  |  1.0 | 0 | 100 |
| C1      | 50   | 1.0 | 0 | 50 |
-------------------------------




Assume we have a 25 token loss on compound.  This loss is allocated to 0 to A, 0 to B, and results in a 25 token loss in tranche C which is a 50% haircut






Time = 2


-------------
| Pool     | Shares  |
---------
| Comp | 75 |
| Aave | 100 |
------------


--------------------
| Tranche |  Total active shares | Multiplier | Time reset
---------------------------------------------------------
| A | 50 | 1.0  | 0 |
| B | 100 | 1.0 | 0 | 
| C | 25 | 0.5 | 0 |
-----------------


Lender


----------------
|Tranche/Deposit | Shares bought |  Multiplier at purchase  | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| B1      | 100   | 1.0 | 0 | 100 |
| C1      | 50    | 1.0 | 0 | 25 = 50 * 0.5 / 1.0 |
-------------------------------


Then at time 3, C2 buys 25 shares in the C tranche, since this happens after the loss, C2 doesn’t suffer any loss


Time = 3


-------------
| Pool     | Shares  |
---------
| Comp | 100 |
| Aave | 100 |
------------


--------------------
| Tranche | current multiplier | Time reset | total active shares |
---------------------------------------------------------
| A | 1.0  | 0 | 50 |
| B | 1.0 | 0 | 100 |
| C | 0.5 | 0 | 50 |
----------------------


Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| B1      | 100   | 1.0 | 0 | 100 |
| C1      | 50    | 1.0 | 0 | 25 = 50 * 0.5 / 1.0 |
| C2      | 25    | 0.5 | 3 | 25 = 25 * 0.5 / 0.5 |
-------------------------------


Now at t=4, we have an event where compound gets wiped out.  At that point tranche C is reset, and since both C1 and C2 bought their shares before the event they get nothing


Time = 4


-------------
| Pool     | Shares  |
---------
| Comp | 0 |
| Aave | 100 |
------------


--------------------
| Tranche | current multiplier | Time reset | total active shares |
---------------------------------------------------------
| A | 1.0  | 0 | 50 |
| B | 0.5 | 0 |  50 |
| C | 1.0 | 4  |  0 | (counter for C hits zero so is reset)
-----------------


Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| B1      | 100   | 1.0 | 0 | 50 = 0.5 / 1.0 * 100 |
| C1      | 50    | 1.0 | 0 | 0  (since bought before reset) |
| C2      | 25    | 0.5 | 3 | 0 ( since bought before reset) |
-------------------------------


So at t=5 AAVE suffers a 25 share loss which is 50% of the B tranche.  Nothing changes in C tranche since C tranche is empty at this point.


Time = 5


-------------
| Pool     | Shares  |
---------
| Comp | 0 |
| Aave | 75 |
------------


--------------------
| Tranche | current multiplier | Time reset | Total active shares |
---------------------------------------------------------
| A | 1.0                                 | 0                 |  50 |
| B | 0.25 = 0.5 * 0.5             | 0                  |  25 | 50% haircut
| C | 1.0                                 | 4                 | 0    | no haircut because no shares
-----------------










Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| B1      | 100   | 1.0 | 0 | 25 = 0.25 / 1.0 * 100 |
| C1      | 50    | 1.0 | 0 | 0  (since bought before reset) |
| C2      | 25    | 0.5 | 3 | 0 ( since bought before reset) |
-------------------------------


At time=6, you have someone buy 50 shares in each of the tranches, and lets say 25 goes to AAVE




Time = 6


-------------
| Pool     | Shares  |
---------
| Comp | 0 |
| Aave | 100 |
| Treasury | 125 |
------------


--------------------
| Tranche | current multiplier | Time reset |  Total active shares |
---------------------------------------------------------
| A | 1.0  | 0 | 100 |
| B | 0.25 | 0 | 75 |
| C | 1.0 | 4  |  50 |
-----------------


Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| A2      | 50    | 1.0 | 6 | 50 | 
| B1      | 100  | 1.0 | 0 | 25 = 0.25 / 1.0 * 100 |
| B2      | 50    | 0.25 | 6 | 50 = 0.25 / 0.25 * 50 |
| C1      | 50    | 1.0 | 0 | 0 ( bought before reset ) |
| C2      | 25    | 0.5 | 3 | 0 ( bought before reset ) |
| C3      | 50    | 1.0 | 6 | 50 = 1.0 / 1.0 * 50 |
-------------------------------




So lets suppose AAVE goes completely bust.


Time = 7


-------------
| Pool     | Shares  |
---------
| Comp | 0 |
| Aave | 0 |
| Treasury | 125 |
------------


--------------------
| Tranche | current multiplier | Time reset |  Total active shares |
---------------------------------------------------------
| A | 1.0  | 0 | 100 |
| B | 0.25 / 3 = 0.086666667 | 0 | 25 | ( two thirds of pool gets wiped)
| C | 1.0 | 7  |  0 | (C goes bust, gets reset)
-----------------


Lender


----------------
|Tranche/Deposit | Shares bought | Multiplier when bought | Time bought | Shares active |
----------------------------------------
| A1      | 50    | 1.0 | 0 | 50 | 
| A2      | 50    | 1.0 | 6 | 50 | 
| B1      | 100  | 1.0 | 0 | 8.3333333 = 0.0866667 / 1.0 * 100 |
| B2      | 50    | 0.25 | 6 | 16.6666667  = 0.0866667 / 0.25 * 50 |
| C1      | 50    | 1.0 | 0 | 0 ( bought before reset ) |
| C2      | 25    | 0.5 | 3 | 0 ( bought before reset ) |
| C3      | 50    | 1.0 | 6 | 0 ( bought before reset ) |
-------------------------------


# Algorithm with interest


To include interest in the calculation, we calculate the multiplier by dividing the total loss by the (principal + interest).  This multiplier is then applied to the running interest rates sums.


Principal: 50
Interest: 50
Loss: 50


Credit multiplier 0.5


The total interest and principal per tranche is scaled by the multiplier when a credit loss event occurs.  The interest per principal running sum is not scaled at the time of the credit loss event but the multiplier is incorporated at the time the interest is calculated.


# Partial stakes


In case there is an additional staking, the amount of existing active principal and active interest are rescaled with the current loss multipliers. They are then treated as new deposits.


# Loss detection and provisioning


(I’m trying to use standard banking terminology as much as possible).


A default occurs when the system attempts to repay a user and the amount received from the external pool is insufficient to cover the loss.  A default should only occur when the system is redeems ctokens in the remote pool and the amount is less than the amounts owned to the lenders.  The system should *not* trigger a default when there is an error in the adapter.   To calculate how to allocate losses, the adapter will keep a running total of the collateral and the loans associated with each adapter, as well is a running total of the losses that have already been incurred, when a position is redeemed or liquidated.


Based on the accumulated losses, and expected future loss, the system will calculate the losses to be subtracted from user collateral and the amount to be subtracted from the treasury pool. settleCreditEvent will take the amount of collateral losses and pool losses, subtract the losses from collateral and run the waterfall for pool losses. 


Loss provisioning and settleCreditEvent is one way.  There is no mechanism for reversing loss provisions these actions.