// SPDX-License-Identifier: MIT
// max-pools.js - Basic staking workflow with max pools
//
// Add and remove liquidity without a borrow

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, stake: stake } = require('./utils');

const Nutmeg = artifacts.require("Nutmeg");
const MockERC20 = artifacts.require("MockERC20");
const Nut = artifacts.require('Nut');
const TestNutDistributor = artifacts.require('TestNutDistributor');

require("chai")
  .use(require("chai-as-promised"))
  .should();

async function add_bank(nutmeg, token, governor, blackhat) {
  await nutmeg.addPool(token, 1000, {from: governor})
  console.log('adding accounts');
  for (i=0; i < 255; i++) {
    const account = web3.eth.accounts.create();
    await nutmeg.addPool(account.address, 1000, {from: governor})
  }
  const account = web3.eth.accounts.create();
  console.log('adding overflow');
  await expectRevert.unspecified(
    nutmeg.addPool(account.address, 1000, {from: governor})
  );
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
  let deposits = await nutmeg.getStake(token, p1, {from: p1});
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
}

contract("Max Pools", addresses => {
 const [owner, governor, p1, p2, p3, sink, blackhat, _] = addresses;
  let nutmeg, token;
  before(async () => {
    const nut_contract = await Nut.new("Nut token", "NUT", sink, {from: owner});
    const nutDistributor = await TestNutDistributor.new({from: owner});
    await nutDistributor.initialize(nut_contract.address, owner, 100);
    nutmeg = await deployProxy(Nutmeg, [owner], {from: owner});
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
      add_bank(nutmeg, token, governor, blackhat);
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
