// SPDX-License-Identifier: MIT
// churn.js - Churn liquidity
//
// These tests will add and remove a large amount of liquidity
// using interest rate addition interface.

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, DUMMY_ADDRESS, stake: stake } = require('./utils');

const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const IERC20 = artifacts.require('@openzeppelin/contracts/token/ERC20/IERC20.sol');
const Nut = artifacts.require('Nut');
const TestNutDistributor = artifacts.require('TestNutDistributor');

require("chai")
  .use(require("chai-as-promised"))
  .should();

async function add_bank(nutmeg, token, governor, blackhat) {
  await expectRevert.unspecified(
    nutmeg.addPool(token, 1, {from: blackhat})
    );
  await nutmeg.addPool(token, 1000, {from: governor})
  await expectRevert(
      nutmeg.addPool(token, 1000, {from: governor}),
      'addPl pool exts');
}

async function test_churn_liquidity(
  nutmeg, token, blackhat, p1, p2, governor
) {
  let bank = await nutmeg.getPool(token);
  let ethBefore = await getBalance(token, nutmeg.address);
  // fail if BBB
  await expectRevert.unspecified(
    stake(nutmeg, token, 2, 1, p1)
  );
/*
  // test adding reasonable amounts of interest
  await stake(nutmeg, token, 1, toWei(2.51), p1);
  await stake(nutmeg, token, 1, toWei(1.5), p2);

  let ethAfter = await getBalance(token, nutmeg.address);
  assert.equal(ethAfter - ethBefore, parseInt(toWei(4.01)));
  await nutmeg.addInterestToPool(token, toWei(1), {from: governor});
  let deposits = await nutmeg.getStake(token, p1, {from: p1});
  let p1i = await nutmeg.getEarnedInterest(token, p1, 1, {from: p1});
  let p2i = await nutmeg.getEarnedInterest(token, p2, 1, {from: p2});

  console.log('p1 interest:', p1i.toString());
  console.log('p2 interest:', p2i.toString());
  console.log('diff', (web3.utils.toBN(toWei(1)) -
		       p1i - p2i).toString());

  // remove all interest and check if zero
  await nutmeg.unstake(token, 1, toWei(2.51), {from: p1});
  await nutmeg.unstake(token, 1, toWei(1.5), {from: p2});
*/
  bank = await nutmeg.getPool(token);

  assert.deepEqual(
    (await Promise.all([
    bank.principals[0].toString(),
    bank.principals[1].toString(),
    bank.principals[2].toString()
    ])).map(r => r.toString()),
    [
    '0',
    '0',
    '0'
    ].map(r => r.toString())
  );

  // split interest between highly different interest
  await stake(nutmeg, token, 1, toWei(1000000000), p1);
  await nutmeg.unstake(token, 1, toWei(1), {from: p1});
  await stake(nutmeg, token, 1, toWei(1), p2);
  p1i = await nutmeg.getEarnedInterest(token, p1, 1, {from: p1});
  p2i = await nutmeg.getEarnedInterest(token, p2, 1, {from: p2});

  assert.equal(p1i.toString(), "0")
  assert.equal(p2i.toString(), "0")

  bank = await nutmeg.getPool(token);

  assert.deepEqual(
    (await Promise.all([
    bank.principals[0].toString(),
    bank.principals[1].toString(),
    bank.principals[2].toString()
    ])).map(r => r.toString()),
    [
    '0',
    '1000000000000000000000000000',
    '0'
    ].map(r => r.toString())
  );

  /*
  // disable because of collateral limits
  await nutmeg.addInterestToPool(token, toWei(1), {from: governor});
  p1i = await nutmeg.getEarnedInterest(token, p1, 1, {from: p1});
  p2i = await nutmeg.getEarnedInterest(token, p2, 1, {from: p2});
  console.log("p1i: ", p1i.toString());
  console.log("p2i: ", p2i.toString());
  assert.equal(p1i.toString(), '999999999000000000');
  assert.equal(p2i.toString(), '1000000000');
  assert.equal((web3.utils.toBN(toWei(1)) - p1i - p2i).toString(), '0');
  */

  const deposit = await stake(nutmeg, token, 1, toWei(2.12), p1);
  deposits = await nutmeg.getStake(token, p1, {from: p1});
  ethBefore = await getBalance(token, p1);

  assert.equal(ethBefore.toString(), "999998999999998880000000000000000")

  //remove all liquidity
  await nutmeg.unstake(token, 1, toWei(1000000000-1), {from: p1})
  assert.equal(
    (await getBalance(token, p1)).toString(),
    '999999999999997880000000000000000'
  );
  p1i = await nutmeg.getEarnedInterest(token, p1, 1, {from: p1});
  assert.equal(p1i.toString(), "0")
  await nutmeg.unstake(token, 1, toWei(1), {from: p2})
  p1i = await nutmeg.getEarnedInterest(token, p2, 1, {from: p2});
  assert.equal(p1i.toString(), "0")

  await expectRevert.unspecified(
    nutmeg.unstake(token, 1, toWei("1.12"), {
      from: blackhat,
      value: toWei("1.12")
    })
  )
  ethAfter = await getBalance(token, p1);
  assert.equal(ethBefore.toString(), "999998999999998880000000000000000")

  // console.log('eth after: ', (ethAfter - ethBefore).toString())
  deposits = await nutmeg.getStake(token, p1, {from: p1});
  // console.log('bank: ', bank)
  // console.log('deposits: ', deposits)
/*  assert.deepEqual(
     (([
       deposits,
       bank
     ])).map(r => r.toString()),
     [
       '0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0,1,1,0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef,0x30753E4A8aad7F8597332E813735Def5dD395028,1,2120000000000000000,0,0,0,0,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,0,0',
       'true,0x30753E4A8aad7F8597332E813735Def5dD395028,500,1000,2000,0,1000000000000000000000000000,0,0,0,0,0,0,0,0,29,0,90,true,0,0,0'
     ].map(r => r.toString())
   ); */
}

contract("Nutmeg Churn Bank", addresses => {
  const [owner, governor, p1, p2, p3, blackhat, _] = addresses;
  let nutmeg, token;
  before(async () => {
    const nut = await Nut.new("Nut token", "NUT", owner, {from: owner});
    const nut_distributor_contract = await TestNutDistributor.new({from: owner});
    nut_distributor_contract.initialize(nut.address, owner, 100);
    nutmeg = await TestNutmeg.new({from: owner});
    await nutmeg.initialize(owner);
    await nut.setNutDistributor(
        nut_distributor_contract.address, {from: owner}
    );
    await nutmeg.setNutDistributor(
        nut_distributor_contract.address, {from: owner}
    );
    await nutmeg.setNut(
        nut.address, {from: owner}
    );
    await nut_distributor_contract.setNutmegAddress(nutmeg.address, {from: owner});
    let token_contract = await MockERC20.deployed();
    token = token_contract.address;
    await token_contract.mint(p1, toWei("1000000000000000"));
    await token_contract.mint(p2, toWei("1000000000000000"));
    await token_contract.mint(nutmeg.address, toWei("3"));
    await token_contract.approve(nutmeg.address, toWei(1000000000000000),
                                   {from: p1});
    await token_contract.approve(nutmeg.address, toWei(500), {from: p2});
  });
  describe("Nutmeg deployment", async () => {
    it("Initialize", async () => {
      await nutmeg.setPendingGovernor(governor, {from: owner});
      await nutmeg.acceptGovernor({from: governor});
    });
    it("Can add a new bank", async() => {
      await add_bank(nutmeg, token, governor, blackhat);
    });
    // add and remove liquidity from one tranche
    it("Churn", async () => {
      await test_churn_liquidity(nutmeg, token, blackhat, p1, p2, governor);
    });
    // add and remove liquidity from multiple tranches

  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
