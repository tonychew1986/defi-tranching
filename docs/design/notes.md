# Notes on nutmeg
(k)
Guys, below is my understanding of staking & interests distribution logic:

1. Users can stake into any tranche, as a return, LP tokens will be minted (very tranche has its own LP token), the rate of each tranche is:
 Super senior = R*0.5
 Mezzanine = R
 Junior = R*1.5

R is updated in a daily basis.

2. Borrowers borrow from the pool (instead of a particular tranche) with R - the interest rate of Mezzanine. 

3. Everyday, the interests is generated from the principals of borrowers (if 70% of principals are used, the lending contract with 3rd party will be terminated) with R.

4. Those interests generated at 3 will be distributed to all lenders of the pool based on the normalised dsec percentage, which is calculated as below:

I_i = [dsec_i * R_i / (sum of dsec_j * R_j) ] * total_interests, 

where I_i is the interest of user i, desc_i is the dollar per second of user i, R_i is the interest rate of the tranche that user i staked. 

P.S. The above logic is based on assumption we calculate and distribute interests everyday.
