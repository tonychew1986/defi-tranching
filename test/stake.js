// SPDX-License-Identifier: MIT
// staking.js - Basic staking workflow
//
// Add and remove liquidity without a borrow

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, stake: stake } = require('./utils');

const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const Nut = artifacts.require('Nut');
const TestNutDistributor = artifacts.require('TestNutDistributor');

require("chai")
  .use(require("chai-as-promised"))
  .should();

async function add_bank(nutmeg, token, governor, blackhat) {
  await expectRevert.unspecified(
    nutmeg.addPool(token, 1000, {from: blackhat})
    );
  await expectRevert(
      nutmeg.addPool(token, 0, {from: governor}),
      'addPl bad ir');
  await expectRevert(
      nutmeg.addPool(token, 1000000, {from: governor}),
      'addPl bad ir');
  await nutmeg.addPool(token, 1000, {from: governor})
  await expectRevert(
      nutmeg.addPool(token, 1000, {from: governor}),
      'addPl pool exts');
}

async function test_add_liquidity(nutmeg, token, p1, p2) {
  let bank = await nutmeg.getPool(token);
  const ethBefore = await getBalance(token, nutmeg.address);
  // fail if BBB
  await expectRevert.unspecified(
    stake(nutmeg, token, 2, 1, p1)
  );
  await stake(nutmeg, token, 1, toWei("2.12"), p1);
  await stake(nutmeg, token, 1, toWei("1.12"), p2);
  bank = await nutmeg.getPool(token);
  const ethAfter = await getBalance(token, nutmeg.address);
  assert.equal(ethAfter - ethBefore, parseInt(toWei("3.24")));
  const deposits = await nutmeg.getStake(token, p1, {from: p1});
}


async function test_remove_liquidity(nutmeg, token, blackhat, p1, p2) {
  let bank = await nutmeg.getPool(token);
/*
  assert.deepEqual(
  	(await Promise.all([
  	  nutmeg.getPool(token)
  	])).map(r => r.toString()),
  	[
  	  'true,0x30753E4A8aad7F8597332E813735Def5dD395028,500,1000,2000,0,3240000000000000000,0,0,0,0,0,0,0,0,29,0,90,true,0,0,0'
  	].map(r => r.toString())
   );
*/

  let deposits = await nutmeg.getStake(token, p1, {from: p1});
/*
  assert.deepEqual(
  	(await Promise.all([
	  nutmeg.getStake(token, p1, {from: p1})
  	])).map(r => r.toString()),
  	[
  	  '0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0,1,1,0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef,0x30753E4A8aad7F8597332E813735Def5dD395028,1,2120000000000000000,0,0,0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0'
  	].map(r => r.toString())
   ); */
  const ethBefore = await getBalance(token, p1);

  await nutmeg.unstake(token, 1, toWei("1.22"), {from: p1})
  await expectRevert.unspecified(
    nutmeg.unstake(token, 1, toWei("1.12"), {
      from: blackhat,
      value: toWei("1.12")
    })
  )
  const ethAfter = await getBalance(token, p1);

  assert.equal(ethBefore.toString(), "997880000000000000000")
  deposits = await nutmeg.getStake(token, p1, {from: p1});
  bank = await nutmeg.getPool(token);
/*
   assert.deepEqual(
     	(([
        deposits,
     	  bank
     	])).map(r => r.toString()),
     	[
        '0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0,1,1,0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef,0x30753E4A8aad7F8597332E813735Def5dD395028,1,900000000000000000,0,0,0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0',
     	  'true,0x30753E4A8aad7F8597332E813735Def5dD395028,500,1000,2000,0,2020000000000000000,0,0,0,0,0,0,0,0,30,0,90,true,0,0,0'
     	].map(r => r.toString())
    );
*/
}

contract("Nutmeg Token Bank", addresses => {
 const [owner, governor, p1, p2, p3, sink, blackhat, _] = addresses;
  let nutmeg, token;
  before(async () => {
    const nut_contract = await Nut.new("Nut token", "NUT", sink, {from: owner});
    const nutDistributor = await TestNutDistributor.new({from: owner});
    await nutDistributor.initialize(nut_contract.address, owner, 100);
    nutmeg = await TestNutmeg.new({from: owner});
    await nutmeg.initialize(owner);
    await nutmeg.setNut(
        nut_contract.address, {from: owner}
    );
    await nut_contract.setNutDistributor(nutDistributor.address, {from: owner});
    await nutmeg.setNutDistributor(nutDistributor.address, {from: owner});
    await nutDistributor.setNutmegAddress(nutmeg.address, {from: owner});
    await nutDistributor.setPendingGovernor(governor, {from: owner});
    await nutDistributor.acceptGovernor({from: governor});

    let token_contract = await MockERC20.new(
      "Mock Erc20", "MOCKERC20", 18, {from: owner}
    );
    token = token_contract.address;
    await token_contract.mint(p1, toWei("1000"));
    await token_contract.mint(p2, toWei("1000"));
    await token_contract.approve(nutmeg.address, toWei("10"), {from: p1});
    await token_contract.approve(nutmeg.address, toWei("2"), {from: p2});
  });
  describe("Nutmeg deployment", async () => {
    it("Initialize", async () => {
      await nutmeg.setPendingGovernor(governor, {from: owner});
      await nutmeg.acceptGovernor({from: governor});
    });
    it("Can add a new bank", async() => {
      await add_bank(nutmeg, token, governor, blackhat);
    });
    it("Can add liquidity to a bank", async() => {
      await test_add_liquidity(nutmeg, token, p1, p2);
    });
    it("Can remove liquidity from a bank", async () => {
      await test_remove_liquidity(nutmeg, token, blackhat, p1, p2);
    });

  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
