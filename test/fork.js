// SPDX-License-Identifier: MIT
// fork.js - Basic tests for fork mainnet

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");

const Nut = artifacts.require('Nut');
const Nutmeg = artifacts.require("Nutmeg");
const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const IERC20 = artifacts.require("IERC20");
const ICERC20 = artifacts.require("ICERC20");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const TestNutDistributor = artifacts.require('TestNutDistributor');
const ICEtherMock = artifacts.require("ICEtherMock");

function toWei(value) {
  return web3.utils.toWei(value.toString(), "ether");
}

contract("Nutmeg fork", addresses => {
  const [owner, governor, p1, p2, blackhat, _] = addresses;
  let nutmeg;
  let bheight;
  let forked = false;
  before(async () => {
    const nut = await Nut.new("Nut token", "NUT", owner, {from: owner});
    const nut_distributor = await TestNutDistributor.new({from: owner});
    nut_distributor.initialize(nut.address, owner, 100);
    nutmeg = await TestNutmeg.new({from: owner});
    await nutmeg.initialize(owner);
    await nut.setNutDistributor(
      nut_distributor.address, {from: owner}
    );
    await nutmeg.setNutDistributor(
      nut_distributor.address, {from: owner}
    );
    await nutmeg.setNut(
      nut.address, {from: owner}
    );
    await nut_distributor.setNutmegAddress(nutmeg.address, {from: owner});
  });

  describe("Nutmeg fork suite", () => {
    it ("Checkblock number", async() => {
      bheight = await  web3.eth.getBlockNumber();
      console.log("---------");
      console.log(" blockhi:", bheight);
      console.log("---------");
    });
    it ("Connect to compound", async () => {
      // Main Net Contract for cETH (the supply process is different for cERC20 tokens)
      const contractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
      let contract;
      try {
	contract = await ICEtherMock.at(contractAddress);
      } catch(err) {
	forked = false;
	return;
      };
      forked = true;
      await contract.mint({
	from: p1,
	gasLimit: web3.utils.toHex(1500000), 
	gasPrice: web3.utils.toHex(20000000000), 
	value: web3.utils.toHex(toWei(5))
      });
      b = await contract.balanceOf(p1);
      console.log("---------");
      console.log("   minted:", b.toString());
      await contract.redeemUnderlying(toWei(1), {
	from: p1,
	gasLimit: web3.utils.toHex(1500000), 
	gasPrice: web3.utils.toHex(20000000000)
      });
      b = await contract.balanceOf(p1);
      console.log("   after:", b.toString());
      console.log("---------");
    });
  });
});
