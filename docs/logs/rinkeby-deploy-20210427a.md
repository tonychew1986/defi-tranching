Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 10000752 (0x989970)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        8485179
   > block timestamp:     1619512078
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.999722588
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

   Deploying 'MockERC20'
   ---------------------
   > block number:        8485181
   > block timestamp:     1619512094
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.998263282
   > gas used:            702398 (0xab7be)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001404796 ETH


   Deploying 'MockCERC20'
   ----------------------
   > block number:        8485182
   > block timestamp:     1619512112
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.99587103
   > gas used:            1196126 (0x12405e)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002392252 ETH


   Deploying 'Nut'
   ---------------
   > block number:        8485183
   > block timestamp:     1619512133
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.993973366
   > gas used:            948832 (0xe7a60)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001897664 ETH

NutDistributor deployed:  0x314c9336A9dba27442d0b4424904d40F230BFBE5
Upgrade:  0x314c9336A9dba27442d0b4424904d40F230BFBE5
Nutmeg deployed:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3
Upgraded:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3

   Deploying 'CompoundAdapter'
   ---------------------------
   > block number:        8485201
   > block timestamp:     1619512268
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.969977584
   > gas used:            2850707 (0x2b7f93)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.005701414 ETH

   -------------------------------------
   > Total cost:         0.011396126 ETH


3_transfer_ownership.js
=======================
Nutmeg:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3
NutDistributor:  0x314c9336A9dba27442d0b4424904d40F230BFBE5
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

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xb2b6ddedd0ee5c50e0e84d8e972d2443903a1f5d29ed55314b0d0d219ef6de75
   > contract address:    0x300B164cE19Ad2B52ECfE919C7FC9244B39B7417
   > block number:        8485192
   > block timestamp:     1619512286
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.99689988
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

   Deploying 'MockERC20'
   ---------------------
   > transaction hash:    0xf953c047673b66399bc2f204f52d7e13c9b0df7a3c93e75c5122a4a920d743ce
   > contract address:    0x1c4Ac4dADe813B8E68cC62Ac43Ca389b968c2106
   > block number:        8485194
   > block timestamp:     1619512316
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.98098882
   > gas used:            749898 (0xb714a)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01499796 ETH


   Deploying 'MockCERC20'
   ----------------------
   > transaction hash:    0xfe6aeacc2a6d8df525f5ce54f1c336baf0e4373429a68eb2d5c008415732a27d
   > contract address:    0x0e531932aAC5b5CF2fD2F8b71da83145040605AD
   > block number:        8485195
   > block timestamp:     1619512331
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.9555463
   > gas used:            1272126 (0x13693e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02544252 ETH


   Deploying 'Nut'
   ---------------
   > transaction hash:    0xeec744df2dfc2fb33ca34a24286797213d2ce741951becb8647ca8682fd27959
   > contract address:    0xbBB20A01850a45b6b6AA45b4bB56074927C5f587
   > block number:        8485196
   > block timestamp:     1619512346
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.93506366
   > gas used:            1024132 (0xfa084)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02048264 ETH

NutDistributor deployed:  0x314c9336A9dba27442d0b4424904d40F230BFBE5
Upgrade:  0x314c9336A9dba27442d0b4424904d40F230BFBE5
Nutmeg deployed:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3
Upgraded:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3

   Deploying 'CompoundAdapter'
   ---------------------------
   > transaction hash:    0xa833d22eee3ad9d775d354d19d4f98ff3794d5ea8067737906294347c50e30d1
   > contract address:    0xA6ab57d0eb4bc2Af17472F739fbE8F5619521bE9
   > block number:        8485204
   > block timestamp:     1619512466
   > account:             0x35b9F43f9Ec7aEf35bfF4f3330Ef74Df95eE9364
   > balance:             2.67166684
   > gas used:            2862207 (0x2bac7f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05724414 ETH


   > Saving artifacts
   -------------------------------------
   > Total cost:          0.11816726 ETH


3_transfer_ownership.js
=======================
Nutmeg:  0xFCD82eeF0B351D4FCCA6208B6B1cB638B1B872d3
NutDistributor:  0x314c9336A9dba27442d0b4424904d40F230BFBE5

   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.12126738 ETH
