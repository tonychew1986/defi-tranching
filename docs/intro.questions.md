This is a file for questions about how nutmeg works.


#### Questions

1. What resides within the Treasury Pool and what is it used for? 
[design/architecture.md](design/architecture.md)

2. What are the risk involved with borrowers? see [design/architecture.md](design/architecture.md)

3. How does the liquidation mechanism works for borrowers? see [design/architecture.md](design/architecture.md)

4. Will there only be 3 tranches? The initial design will have three tranches.  A future version of
the system may have additional tranches, but there are no particular plans to add additional tranches
at this time.


5. How many assets are there to earn from as lenders? The system has provision for allowing a lender
to lend money to multiple pools by adding multiple adapters.


6. How is APY calculated for each tranche of lenders? Real time?  The base APY would be calculated by an
external oracle and set in the contract.  From that, the contract will calculate an actual interest rate
for each trache based on the amount of colateral avaliable.  updateInterestRate will be called once a day.
However, updateInterestRateAdjustment will cause the actual interest to change interactively.

7. What are the parameters to consider when borrowing? debt, slippage, trading fee, etc.?

The main thing that a borrower would interested in is the return on the external platform.

From our platform, the main thing that the borrower would care about is his current positions.

I was asking about how difficult it would be to receive the positions of the owner.  Right now
the mechanism would be to take all of the positions and pull out the owner positions.  

If this is too inefficient, we can set up a map from owner to the last position opened and then
use a linked list method to go down the position.

8. How much leverage will be allowed? 100x
