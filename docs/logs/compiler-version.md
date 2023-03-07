Our compiler is running 0.7.6.  This was the latest version for which
openzepplin was available in February.

We did do one run under compiler 0.8.3 and openzeppelin 4.0 a branch
is available in dev/optimize-distribution-0.8.  We did find that the
new compiler was more particular with syntax errors.  However, a quick
run showed no signficant changes in image size or gas usage.

---- 0.7

Using network 'ganachegui'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

sink fund:  0xfE6BDc5806E0D7184A521c236A344A50D3Ad343B
deployer:   0x0ECF2e79b76E0ed928AAF12b2F52eB6957C54D21
governor:   0xfb3fB09438eD0601EB68EeEf1f0314be0091d59a

  Contract: Nutmeg integration
    Initialization
      ✓ Initial values should be correct
    Treasury pool
      ✓ can't add a treasury pool by non-governor (43846 gas)
      ✓ can't add a new treasury pool with an invalid interest rate (89563 gas)
      ✓ can add a new treasury pool by governor (151813 gas)
      ✓ can't add a pool twice (45670 gas)
      ✓ can update interest rates by governor (37762 gas)
    Staking
      ✓ can't stake an invalid tranche (68286 gas)
      ✓ can't stake an invalid pool (44132 gas)
      ✓ can't stake an invalid principal (68237 gas)
      ✓ can stake in tranche A any amount (601230 gas)
      ✓ can stake in tranche AA any amount (356181 gas)
      ✓ can stake in tranche A or tranche AA by anyone with any amount (1295813 gas)
      ✓ can't stake in tranche BBB an amount larger than tranche AA (150884 gas)
    Unstaking
      ✓ can't withdraw empty deposit (110369 gas)
      ✓ can't withdraw with invalid amount (257239 gas)
      ✓ can withdraw partially with an amount (374198 gas)
      ✓ can withdraw all principals (618912 gas)
      ✓ should be empty pool now
      ✓ check the nut distribution map

·---------------------------------------|---------------------------|-------------|----------------------------·
|  Solc version: 0.7.6+commit.7338295f  ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
········································|···························|·············|·····························
|  Methods                                                                                                     │
···············|························|·············|·············|·············|··············|··············
|  Contract    ·  Method                ·  Min        ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
···············|························|·············|·············|·············|··············|··············
|  MockERC20   ·  approve               ·          -  ·          -  ·      44095  ·           7  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  MockERC20   ·  mint                  ·      50773  ·      65773  ·      52916  ·           7  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nut         ·  acceptGovernor        ·          -  ·          -  ·      18798  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  addPool               ·          -  ·          -  ·     151813  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  stake                 ·     166559  ·     491362  ·     298580  ·           9  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  unstake               ·     115143  ·     202081  ·     164969  ·          11  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  updateInterestRates   ·          -  ·          -  ·      37762  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Deployments                          ·                                         ·  % of limit  ·             │
········································|·············|·············|·············|··············|··············
|  CompoundAdapter                      ·          -  ·          -  ·    2871317  ·      42.7 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Migrations                           ·          -  ·          -  ·     153706  ·       2.3 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  MockCERC20                           ·          -  ·          -  ·    1266926  ·      18.9 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  MockERC20                            ·          -  ·          -  ·     747386  ·      11.1 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Nut                                  ·          -  ·          -  ·    1060716  ·      15.8 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  NutDistributor                       ·          -  ·          -  ·    2592690  ·      38.6 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Nutmeg                               ·          -  ·          -  ·    5065936  ·      75.4 %  ·          -  │
·---------------------------------------|-------------|-------------|-------------|--------------|-------------·

  19 passing (53s)




---- 0.8

Using network 'test'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

sink fund:  0x627306090abaB3A6e1400e9345bC60c78a8BEf57
deployer:   0xf17f52151EbEF6C7334FAD080c5704D77216b732
governor:   0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef

  Contract: Nutmeg integration
    Initialization
      ✓ Initial values should be correct
    Treasury pool
      ✓ can't add a treasury pool by non-governor (43846 gas)
      ✓ can't add a new treasury pool with an invalid interest rate (89521 gas)
      ✓ can add a new treasury pool by governor (151778 gas)
      ✓ can't add a pool twice (45649 gas)
      ✓ can update interest rates by governor (37787 gas)
    Staking
      ✓ can't stake an invalid tranche (68580 gas)
      ✓ can't stake an invalid pool (44111 gas)
      ✓ can't stake an invalid principal (68531 gas)
      ✓ can stake in tranche A any amount (603167 gas)
      ✓ can stake in tranche AA any amount (357860 gas)
      ✓ can stake in tranche A or tranche AA by anyone with any amount (1302742 gas)
      ✓ can't stake in tranche BBB an amount larger than tranche AA (151292 gas)
    Unstaking
      ✓ can't withdraw empty deposit (110969 gas)
      ✓ can't withdraw with invalid amount (260060 gas)
      ✓ can withdraw partially with an amount (379252 gas)
      ✓ can withdraw all principals (628908 gas)
      ✓ should be empty pool now
      ✓ check the nut distribution map

·---------------------------------------|---------------------------|-------------|----------------------------·
|  Solc version: 0.8.3+commit.8d00100c  ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
········································|···························|·············|·····························
|  Methods                                                                                                     │
···············|························|·············|·············|·············|··············|··············
|  Contract    ·  Method                ·  Min        ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
···············|························|·············|·············|·············|··············|··············
|  MockERC20   ·  approve               ·          -  ·          -  ·      44175  ·           7  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  MockERC20   ·  mint                  ·      50772  ·      65772  ·      52915  ·           7  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nut         ·  acceptGovernor        ·          -  ·          -  ·      18798  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  addPool               ·          -  ·          -  ·     151778  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  stake                 ·     168201  ·     493220  ·     300261  ·           9  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  unstake               ·     117558  ·     204608  ·     167466  ·          11  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Nutmeg      ·  updateInterestRates   ·          -  ·          -  ·      37787  ·           2  ·          -  │
···············|························|·············|·············|·············|··············|··············
|  Deployments                          ·                                         ·  % of limit  ·             │
········································|·············|·············|·············|··············|··············
|  CompoundAdapter                      ·          -  ·          -  ·    2800913  ·      41.7 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Migrations                           ·          -  ·          -  ·     153706  ·       2.3 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  MockCERC20                           ·          -  ·          -  ·    1109752  ·      16.5 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  MockERC20                            ·          -  ·          -  ·     682089  ·      10.2 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Nut                                  ·          -  ·          -  ·     980210  ·      14.6 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  NutDistributor                       ·          -  ·          -  ·    2622406  ·        39 %  ·          -  │
········································|·············|·············|·············|··············|··············
|  Nutmeg                               ·          -  ·          -  ·    5133044  ·      76.4 %  ·          -  │
·---------------------------------------|-------------|-------------|-------------|--------------|-------------·

  19 passing (55s)