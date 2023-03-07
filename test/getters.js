// SPDX-License-Identifier: MIT
// borrower position map

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance,  nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake, log, report, fromWei } = require('./utils');

/// A run through for a borrow/staking scenario
contract("Nutmeg - Test borrow position map", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, pos;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    ctoken = ctoken_contract.address;
    await Promise.all([
      token_contract.mint(p1, toWei(200)),
      token_contract.mint(p2, toWei(200)),
      token_contract.mint(p3, toWei(200)),
      token_contract.approve(nutmeg.address, toWei(100), {from: p1}),
      token_contract.approve(nutmeg.address, toWei(100), {from: p2}),
      token_contract.approve(nutmeg.address, toWei(100), {from: p3})
    ]);
  });
  it("Test getters", async() => {
      assert.equal((await nutmeg.getStakeIds(p1)).length, 0);
      await log(async () => {
        await stake(nutmeg, token, 0, toWei(100), p1)
      }, "p1 stakes 100 ETH");
      await log(async () => {
        await stake(nutmeg, token, 0, toWei(50), p2)
      }, "p2 stakes 50 ETH");
      assert.equal((await nutmeg.getPositionIds(p3)).length, 0);
      await log(async () => {
	await nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(10), toWei(100),
          {from: p3}
	)
      }, 'p3 borrows 100 ETH with 10 ETH collateral');
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(100), {from: p1})
      }, "p1 unstake attempt 100 ETH");
      pos = await nutmeg.getPositionIds(p3);
      assert.equal(pos.length, 1);
      stakes = await nutmeg.getStakeIds(p1);
      assert.equal(stakes.length, 1);
      pool = await nutmeg.getPoolInfo(token);
      assert.deepEqual(
          [pool[0].toString(), pool[1].toString(), pool[2].toString()],
          ['100000000000000000000',
           '100000000000000000000',
           '10000000000000000000']
      );
      await log(async() => {
	  nutmeg.closePosition(
              pos[0], compound_adapter.address,
              {from: p3})
      }, 'p3 redeem borrow');
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(50), {from: p1})
      }, "p1 unstake attempt 50 ETH");
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(50), {from: p2})
      }, "p2 unstake attempt 50 ETH");
  });
});
