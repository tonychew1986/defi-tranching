// Fork compound
// This test uses the forked testnet to do a deployment that
// connects to the actual compound contract
//
// Run this under ./scripts/test-fork.sh

// SPDX-License-Identifier: MIT

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");

const Nut = artifacts.require('Nut');
const TestNutmeg = artifacts.require("TestNutmeg");
const IERC20 = artifacts.require("IERC20");
const ICERC20 = artifacts.require("ICERC20");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const TestNutDistributor = artifacts.require('TestNutDistributor');
function toWei(value) {
  return web3.utils.toWei(value.toString(), "ether");
}

contract("Nutmeg compound", addresses => {
  const [owner, governor, p1, p2, blackhat, _] = addresses;
  let nutmeg, nut;
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
  console.log("---------");
  console.log("   owner:", owner);
  console.log("governor:", governor);
  console.log("  play 1:", p1);
  console.log("  play 2:", p2);
  console.log("---------");

  describe("Nutmeg fork suite", () => {
    it ("Checkblock number", async() => {
      bheight = await  web3.eth.getBlockNumber();
      console.log("---------");
      console.log(" blockhi:", bheight);
      console.log("---------");
    });
    it ("Deploy USDC", async() => {
	const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
	const cUSDC = '0x39aa39c021dfbae8fac545936693ac917d5e7563';
	let usdc_contract, cusdc_contract, token, ctoken;
	try {
	    usdc_contract = await IERC20.at(USDC);
	    cusdc_contract = await ICERC20.at(cUSDC);
	    token = usdc_contract.address;
	    ctoken = cusdc_contract.address;
	} catch(err) {
	    forked = false;
	    return;
	};
	await nutmeg.setPendingGovernor(governor, {from: owner});
	await nutmeg.acceptGovernor({from: governor});
	await nutmeg.addPool(usdc_contract.address, 1000, {from: governor});
	compound_adapter = await CompoundAdapter.new(nutmeg.address);
	await compound_adapter.setPendingGovernor(governor, {from: owner});
	await compound_adapter.acceptGovernor({from: governor});
	await nutmeg.addAdapter(compound_adapter.address, {from: governor}),
	await compound_adapter.addTokenPair(token, ctoken, {from: governor});
    });
  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
