Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > block number:        8491599
   > block timestamp:     1619608464
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.667652308
   > gas used:            138706 (0x21dd2)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000277412 ETH

   -------------------------------------
   > Total cost:         0.000277412 ETH


2_deploy_nutmeg.js
==================
sink fund:  0x968e88df55acaec002e3d7c2393f9742e40d94b9
deployer:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364
governor:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364

   Replacing 'MockERC20'
   ---------------------
   > block number:        8491601
   > block timestamp:     1619608483
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.666193002
   > gas used:            702398 (0xab7be)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001404796 ETH


   Replacing 'MockCERC20'
   ----------------------
   > block number:        8491602
   > block timestamp:     1619608502
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.66380075
   > gas used:            1196126 (0x12405e)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002392252 ETH


   Replacing 'Nut'
   ---------------
   > block number:        8491603
   > block timestamp:     1619608524
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.661903086
   > gas used:            948832 (0xe7a60)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001897664 ETH

NutDistributor deployed:  0xB75247C2468969B3c79D90A531f5F9D935120C0b
Upgrade:  0xB75247C2468969B3c79D90A531f5F9D935120C0b
Nutmeg deployed:  0x2A83cA67D212657639934f742370331Af46285E3
Upgraded:  0x2A83cA67D212657639934f742370331Af46285E3

   Replacing 'CompoundAdapter'
   ---------------------------
   > block number:        8491621
   > block timestamp:     1619608662
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.637907304
   > gas used:            2850707 (0x2b7f93)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.005701414 ETH

   -------------------------------------
   > Total cost:         0.011396126 ETH


3_transfer_ownership.js
=======================
Nutmeg:  0x2A83cA67D212657639934f742370331Af46285E3
NutDistributor:  0xB75247C2468969B3c79D90A531f5F9D935120C0b
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.011673538 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x2830c915bdb2af4d7c94d743ddfc620a5d6e27fc0081278866633fbba96936b2
   > block number:        8491612
   > block timestamp:     1619608678
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.6648296
   > gas used:            155006 (0x25d7e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00310012 ETH


   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00310012 ETH


2_deploy_nutmeg.js
==================
sink fund:  0x968e88df55acaec002e3d7c2393f9742e40d94b9
deployer:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364
governor:   0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364

   Replacing 'MockERC20'
   ---------------------
   > transaction hash:    0x1a250b98d7a782b63fee925b871c780271efc6126520cd44c43ede997e993cf8
   > contract address:    0xf373d2eADAb2522CFA0912aD7f61D9c8adf1Ab49
   > block number:        8491616
   > block timestamp:     1619608738
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.64891854
   > gas used:            749898 (0xb714a)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01499796 ETH


   Replacing 'MockCERC20'
   ----------------------
   > transaction hash:    0xd56102d8614525f3c594d14ae04997242a7f40f1c43477d2cee2d968d8ae76c6
   > contract address:    0xD6D670fe8E90fAd4180128BCF4383db4e4079b00
   > block number:        8491617
   > block timestamp:     1619608753
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.62347602
   > gas used:            1272126 (0x13693e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02544252 ETH


   Replacing 'Nut'
   ---------------
   > transaction hash:    0x4dfc84ed5691c96addbdbc51378be750ef77c9063d64d3491cd8d105fe58b448
   > contract address:    0x3a107af0231e53c0A0a53D788EE9D92A368e7adb
   > block number:        8491618
   > block timestamp:     1619608768
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.60299338
   > gas used:            1024132 (0xfa084)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02048264 ETH

NutDistributor deployed:  0x59Bd4D6901c977b2555610A3090D46c6F075d6BB
Upgrade:  0x59Bd4D6901c977b2555610A3090D46c6F075d6BB
Nutmeg deployed:  0xE72a94A569cE4748192b0ec2bDc5495779B42944
Upgraded:  0xE72a94A569cE4748192b0ec2bDc5495779B42944

   Replacing 'CompoundAdapter'
   ---------------------------
   > transaction hash:    0xe084e98119520c46d7fa6b959d45d0e7c654ac6f124f9e27d280089ad8424bfa
   > contract address:    0x3489D15f56FFbB5E1Cf0813a6A6a70CeB677C354
   > block number:        8491625
   > block timestamp:     1619608873
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             1.49394264
   > gas used:            2862207 (0x2bac7f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05724414 ETH


   > Saving artifacts
   -------------------------------------
   > Total cost:          0.11816726 ETH


3_transfer_ownership.js
=======================
Nutmeg:  0xE72a94A569cE4748192b0ec2bDc5495779B42944
NutDistributor:  0x59Bd4D6901c977b2555610A3090D46c6F075d6BB

   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.12126738 ETH
