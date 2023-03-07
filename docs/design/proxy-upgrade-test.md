The rinkeby contract upgrades are

* Nutmeg:  0xE72a94A569cE4748192b0ec2bDc5495779B42944
* NutDistributor:  0x59Bd4D6901c977b2555610A3090D46c6F075d6BB

The implementations which all allow for upgrades are in

* NutDistributorAltA: 0xfd33905F4B4a9a6Bc4726f648917645af056A056
* NutDistributorAltB: 0xA55Daeb2c2163a7920260071dE0f4F80930c588f
* NutmegAltA:  0x4F6B008FE399bd7E42A0844457bEe40836A27249
* NutmegAltB:  0x1a04245ca08A9Ba464a840189F0C055F2C7D3Cbf

* Gnosis address 0xB8e9bd1ff33e44CE253F5311Fbed363269685828
* Run from https://rinkeby.gnosis-safe.io/app/#/safes/0xB8e9bd1ff33e44CE253F5311Fbed363269685828

To test.

```
truffle console --network rinkeby

let x = await NutmegAltA.at('0xE72a94A569cE4748192b0ec2bDc5495779B42944');
await x.getVersionString();
'nutmegalta'
```
