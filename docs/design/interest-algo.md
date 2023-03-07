# Interest algo

# Why necessary

Most contracts involving interests act by giving each holder a token representing
a share of a pool.  However, this system requires that you have a single pool into
which all interest is paid and will fail when you have different holders with 
different ownership has different ownership rights and also fails when the amount
of interest that is paid is not a constant function of the size of the pool. 

An example of a situation in which the a constant share of the pool may pose a 
problem is one in which a pool pays an interest of 1 USD among 3 shares each
worth 1 USD.  Immediately after the interest is paid, a new staker puts in 
1000000 USD that and hence receives most of the interest benefit which he is not
entitled to.  Another problem with the pooled shares approach is that all 3 shares
must receive the same amount of interest, and there is no mechanism for providing
for preferred shares.

This algorithem is intended to avoid these issue.


# Algo description

The interest algorithm is designed to create a gas efficient way of
calculating the proper share of interest entitled to the owner.  The
interest algorithm performs the calculation by maintaining a running
sum of value per share.

<img src="https://latex.codecogs.com/svg.latex?S_n=\sum^{n}_{i=0}\frac{r_i}{P_i}"
/>

where r_i is an interest payment at time i and P_i are the share
outstanding at time i.

Let r_i be a stream of interest payments and s_i be a the share of the
pool owned by the owner.  The total payment entitled to the user for a
deposit between start and end is:

<img src="https://latex.codecogs.com/svg.latex?r_{start}s_{start}+r_{start+1}s_{start+1}+r_{start+2}s_{start+2}+...+r_{end}s_{end}" />

r_i is the total interest added to the pool at time i.

The share at time i is p_i/P_i where p_i is the number of principal
shares owned by the user and P_i is the total number of principal
shares at that time.  We then have

<img src="https://latex.codecogs.com/svg.latex?\frac{r_{start}p_{start}}{P_{start}}+\frac{r_{start+1}p_{start+1}}{P_{start+1}}+\frac{r_{start+2}p_{start+2}}{P_{start+2}}+...+\frac{r_{end}p_{end}}{P_{end}}" />

If we take p_i as constant we factor out the p and get

<img src="https://latex.codecogs.com/svg.latex?p\left\(\frac{r_{start}}{P_{start}}+\frac{r_{start+1}}{P_{start+1}}+\frac{r_{start+2}}{P_{start+2}}+...+\frac{r_{end}}{P_{end}}\right\)" />

Define sum value per share $S_i$ as

<img src="https://latex.codecogs.com/svg.latex?S_n=\sum^{n}_{i=0}\frac{r_i}{P_i}" />

The series \frac{r_{i}}{P_{i}} can be calculated as a running sum
starting at i=0.  When deposit is made, the share certificate records
S_{start-1}.  When a share is redeeemed at end, one simply calculates

<img src="https://latex.codecogs.com/svg.latex?p\(S_{end}-S_{start-1}\)" />

# Transfering shares

One can transfer shares to another user by creating a new share
certificate with the same start value per share but splitting the
shares between the old user and a new user.

# Partial redemption

A partial redemption of shares can be done by splitting the shares
redeemed and the shares remaining.  The amount of shares redeemed will
entitle the user to p_redeemed * (S_{end} - S_{start-1}) and
decrementing the total number of shares.

# Tranches

Tranches can be implemented by separate interest rate pools.  Accured
interest will be externally split between the the different tranches.
