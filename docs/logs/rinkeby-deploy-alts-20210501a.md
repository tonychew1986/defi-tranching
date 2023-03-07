(base) [joe@big-apple nutmeg.0501 (dev/upgrade-tests)]$ !truff
truffle migrate -f 4 --network rinkeby

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


4_deploy_alt_contracts.js
=========================
sink fund:  0x968e88df55acaec002e3d7c2393f9742e40d94b9
deployer:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364
governor:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364

   Deploying 'NutmegAltA'
   ----------------------
   > block number:        8513733
   > block timestamp:     1619940661
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.899808372
   > gas used:            5340764 (0x517e5c)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.010681528 ETH


   Deploying 'NutmegAltB'
   ----------------------
   > block number:        8513734
   > block timestamp:     1619940665
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.889126844
   > gas used:            5340764 (0x517e5c)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.010681528 ETH


   Deploying 'NutDistributorAltA'
   ------------------------------
   > block number:        8513735
   > block timestamp:     1619940668
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.885394812
   > gas used:            1866016 (0x1c7920)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003732032 ETH


   Deploying 'NutDistributorAltB'
   ------------------------------
   > block number:        8513736
   > block timestamp:     1619940671
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.88166278
   > gas used:            1866016 (0x1c7920)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003732032 ETH


   Deploying 'MockERC20AltA'
   -------------------------
   > block number:        8513737
   > block timestamp:     1619940683
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.880272708
   > gas used:            695036 (0xa9afc)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001390072 ETH


   Deploying 'MockERC20AltB'
   -------------------------
   > block number:        8513738
   > block timestamp:     1619940697
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.878882636
   > gas used:            695036 (0xa9afc)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001390072 ETH


   Deploying 'MockERC20AltC'
   -------------------------
   > block number:        8513739
   > block timestamp:     1619940711
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.877492564
   > gas used:            695036 (0xa9afc)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001390072 ETH


   Deploying 'MockCERC20AltA'
   --------------------------
   > block number:        8513740
   > block timestamp:     1619940730
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.875085818
   > gas used:            1203373 (0x125cad)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002406746 ETH


   Deploying 'MockCERC20AltB'
   --------------------------
   > block number:        8513741
   > block timestamp:     1619940750
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.872679072
   > gas used:            1203373 (0x125cad)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002406746 ETH


   Deploying 'MockCERC20AltC'
   --------------------------
   > block number:        8513742
   > block timestamp:     1619940770
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.87027235
   > gas used:            1203361 (0x125ca1)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002406722 ETH

   -------------------------------------
   > Total cost:          0.04021755 ETH


Summary
=======
> Total deployments:   10
> Final cost:          0.04021755 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


4_deploy_alt_contracts.js
=========================
sink fund:  0x968e88df55acaec002e3d7c2393f9742e40d94b9
deployer:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364
governor:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364

   Deploying 'NutmegAltA'
   ----------------------
   > transaction hash:    0x27d8078dff2cf6619024e131ebe9d0ea7c30ab5567d4b1ade6e856860769f19d
   > contract address:    0x4F6B008FE399bd7E42A0844457bEe40836A27249
   > block number:        8513745
   > block timestamp:     1619940852
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.80367462
   > gas used:            5340764 (0x517e5c)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.10681528 ETH


   Deploying 'NutmegAltB'
   ----------------------
   > transaction hash:    0x4591298ecd5ecfeb7142d69104e94a45963d6bda2dc48de6896b98040846f832
   > contract address:    0x1a04245ca08A9Ba464a840189F0C055F2C7D3Cbf
   > block number:        8513746
   > block timestamp:     1619940867
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.69685934
   > gas used:            5340764 (0x517e5c)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.10681528 ETH


   Deploying 'NutDistributorAltA'
   ------------------------------
   > transaction hash:    0x8b8499611d84cfe0400e794271b7e3ced977d97268980cb277619922a68deeb7
   > contract address:    0xfd33905F4B4a9a6Bc4726f648917645af056A056
   > block number:        8513747
   > block timestamp:     1619940882
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.65953902
   > gas used:            1866016 (0x1c7920)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03732032 ETH


   Deploying 'NutDistributorAltB'
   ------------------------------
   > transaction hash:    0x9210ad79a228bb9ac391e1cc94fda93283469a38f40d96d9f65e6efda985e7fc
   > contract address:    0xA55Daeb2c2163a7920260071dE0f4F80930c588f
   > block number:        8513748
   > block timestamp:     1619940897
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.6222187
   > gas used:            1866016 (0x1c7920)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03732032 ETH


   Deploying 'MockERC20AltA'
   -------------------------
   > transaction hash:    0x18a34ee929ca447fa24f14935d0f31a436841a7b6712a26038b7548208380f2e
   > contract address:    0xEe8502c48dB57115221bA5EdAe181C0425cf8043
   > block number:        8513749
   > block timestamp:     1619940912
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.60736798
   > gas used:            742536 (0xb5488)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01485072 ETH


   Deploying 'MockERC20AltB'
   -------------------------
   > transaction hash:    0x2199ce7cc24bc7440b919d94cb075f3aa7a80e35edc1910442b919a19ddfef57
   > contract address:    0x97582E44F00E0815AD31503c9Be55352534d29e5
   > block number:        8513750
   > block timestamp:     1619940927
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.59251726
   > gas used:            742536 (0xb5488)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01485072 ETH


   Deploying 'MockERC20AltC'
   -------------------------
   > transaction hash:    0x54851519722d3a55edd7d0411846b59bf9616f007e55ef90bf4e2aad6d3f4cc0
   > contract address:    0x26760bf540a878Dc1Ab030469Ef1bCf3001b8eCa
   > block number:        8513751
   > block timestamp:     1619940942
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.57766654
   > gas used:            742536 (0xb5488)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01485072 ETH


   Deploying 'MockCERC20AltA'
   --------------------------
   > transaction hash:    0x43ab4999b048e52625cbed6bf8d5a3f0265ee4106240a39631d37447fba20f34
   > contract address:    0x542f8a5E1cD31CB4CE0fE08474861e33B490E39b
   > block number:        8513752
   > block timestamp:     1619940957
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.55207908
   > gas used:            1279373 (0x13858d)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02558746 ETH


   Deploying 'MockCERC20AltB'
   --------------------------
   > transaction hash:    0x1ebed195ad9051f5fd346efa885089957816b2caa1868b13b750d14b832b8ee5
   > contract address:    0xdf0A8E306a382F6d0f79D5403d6cB80E0b55253D
   > block number:        8513753
   > block timestamp:     1619940972
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.52649162
   > gas used:            1279373 (0x13858d)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02558746 ETH


   Deploying 'MockCERC20AltC'
   --------------------------
   > transaction hash:    0xbbee4b77718ccf5f9f2a48cae607b4bb5d426be8d69b76c10df8420f210b379f
   > contract address:    0x7fddfe6Cd472CdeC0c874a7fE4BF5d8Fac2a8702
   > block number:        8513754
   > block timestamp:     1619940987
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             0.5009044
   > gas used:            1279361 (0x138581)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02558722 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:           0.4095855 ETH


Summary
=======
> Total deployments:   10
> Final cost:          0.4095855 ETH



(base) [joe@big-apple nutmeg.0501 (dev/upgrade-tests)]$ 