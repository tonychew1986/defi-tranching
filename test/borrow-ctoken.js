// SPDX-License-Identifier: MIT
// borrow-ctoken.js - Borrow workflow with ctoken exchange changes
"use strict";
const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, BAD_TOKEN, stake: stake,
	nutmeg_factory, mint_test_tokens,
        report_pools, report_balances
      } = require('./utils');
const { start_baseline, end_baseline } = require('./test-report');

describe('borrow-ctoken', ()=> {
  before (async() => {
    start_baseline('borrow-ctoken');
  });
  after(async() => {
    end_baseline();
  });

/// A run through for a borrow/staking scenario
contract("Change value of token exchange", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, ctoken, ctoken_contract, token_contract, compound_adapter;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract, compound_adapter] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    ctoken = ctoken_contract.address;
    await mint_test_tokens(nutmeg,
			   token_contract,
			   ctoken_contract,
			   p1, p2, p3, b1, b2);
    await token_contract.mint(ctoken_contract.address, toWei(1));
  });
  describe("Nutmeg scenario 1", async () => {
    it("staker stake", async() => {
      await Promise.all([
        stake(nutmeg, token, 0, toWei(4), p1),
        stake(nutmeg, token, 1, toWei(2), p1),
        stake(nutmeg, token, 0, toWei(1), p2),
        stake(nutmeg, token, 1, toWei(2), p2)
      ]);
      await Promise.all([
        stake(nutmeg, token, 2, toWei(1), p1),
        stake(nutmeg, token, 2, toWei(3), p2)
      ]);
      await report_balances(
        token, 'token',
        [p1, p2], ['p1', 'p2']
      );
      await report_pools(nutmeg, token);
    });
    it('Remove some liquidity', async() => {
      nutmeg.unstake(token, 0, toWei(1), {from: p1});
      expectRevert(
        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
        'unstk no dpt'
      );
      await report_balances(
        token, 'token',
        [p1, p2], ['p1', 'p2']
      );
      await report_pools(nutmeg, token);
    });

    it('Borrow tests', async () => {
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  nutmeg.getMaxBorrowAmount(token, toWei(0.1))
	])).map(r => r.toString()),
	[
          '12000000000000000000',
	  '9900000000000000000'
	]
      );

      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(0.1), toWei(0.5),
        {from: b1});
      let pos = await nutmeg.POSITION_COUNTER();
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  getBalance(token, compound_adapter.address),
	  getBalance(token, ctoken),
	  getBalance(ctoken, nutmeg.address),
	  getBalance(ctoken, compound_adapter.address),
	  getBalance(ctoken, ctoken),
	  nutmeg.getPositionInterest(token, pos -1),
	])).map(r => r.toString()),
	[
	  '11600000000000000000',
	  '0',
	  '1500000000000000000',
	  '0',
	  '500000000000000000',
	  '0',
	  '0'
	].map(r => r.toString())
      );
      await report_pools(nutmeg, token);
      assert.deepEqual(
	(await Promise.all([
	  nutmeg.getEarnedInterest(token, p1, 0),
	  nutmeg.getEarnedInterest(token, p1, 1),
	  nutmeg.getEarnedInterest(token, p1, 2)
	])).map(r => r.toString()),
	[
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
      await nutmeg._forceAccrueInterest(token, {from: governor})
      assert.deepEqual(
	(await Promise.all([
	  nutmeg.getEarnedInterest(token, p1, 0),
	  nutmeg.getEarnedInterest(token, p1, 1),
	  nutmeg.getEarnedInterest(token, p1, 2)
	])).map(r => r.toString()),
	[
	  '832382037',
	  '554921358',
	  '277460679'
	].map(r => r.toString())
      );
      await nutmeg._forceAccrueInterest(token, {from: governor})
      assert.deepEqual(
	(await Promise.all([
	  nutmeg.getEarnedInterest(token, p1, 0),
	  nutmeg.getEarnedInterest(token, p1, 1),
	  nutmeg.getEarnedInterest(token, p1, 2)
	])).map(r => r.toString()),
	[
	  '1664764074',
	  '1109842716',
	  '554921358'
	].map(r => r.toString())
      );

      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b1});
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  getBalance(token, compound_adapter.address),
	  getBalance(token, b1),
	  getBalance(token, ctoken),
	  getBalance(ctoken, nutmeg.address),
	  getBalance(ctoken, compound_adapter.address),
	  getBalance(ctoken, ctoken),
	  nutmeg.getPositionInterest(token, pos -1),
	])).map(r => r.toString()),
	[
	  "12000000009988584474",
	  "0",
	  "99999999990011415526",
	  "1000000000000000000",
	  "0",
	  "0",
	  "0",
	  "0",
	]
      );
      await report_pools(nutmeg, token);
    });
    it('Borrow tests with value change', async () => {
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  nutmeg.getMaxBorrowAmount(token, toWei(0.1))
	])).map(r => r.toString()),
	[
          '12000000009988584474',
	  '9900000000000000000'
	]
      );

      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(0.1), toWei(0.5),
        {from: b1});
      let pos = await nutmeg.POSITION_COUNTER();
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  getBalance(token, compound_adapter.address),
	  getBalance(token, b1),
	  getBalance(token, ctoken),
	  getBalance(ctoken, nutmeg.address),
	  getBalance(ctoken, compound_adapter.address),
	  getBalance(ctoken, ctoken),
	  nutmeg.getPositionInterest(token, pos -1),
	])).map(r => r.toString()),
	[
	  '11600000009988584474',
	  '0',
	  '99899999990011415526',
	  '1500000000000000000',
	  '0',
	  '500000000000000000',
	  '0',
	  '0'
	].map(r => r.toString())
      );
      await report_pools(nutmeg, token);
      await nutmeg._forceAccrueInterest(token, {from: governor})
      await nutmeg._forceAccrueInterest(token, {from: governor})
      await ctoken_contract.setExchangeRate(toWei(2.0));

      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b1});
      assert.deepEqual(
	(await Promise.all([
          getBalance(token, nutmeg.address),
	  getBalance(token, compound_adapter.address),
	  getBalance(token, b1),
	  getBalance(token, ctoken),
	  getBalance(ctoken, nutmeg.address),
	  getBalance(ctoken, compound_adapter.address),
	  getBalance(ctoken, ctoken),
	  nutmeg.getPositionInterest(token, pos -1),
	])).map(r => r.toString()),
	[
	  '12000000023306697107',
	  '0',
	  "100499999976693302893",
	  "500000000000000000",
	  "0",
	  "0",
	  "0",
	  "0",
	]
      );
      await report_pools(nutmeg, token);
    });

    it('Remove some liquidity', async() => {
      nutmeg.unstake(token, 0, toWei(2), {from: p1});
      expectRevert(
        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
        'unstk no dpt'
      );

			assert.deepEqual(
	(await Promise.all([
	  getBalance(token, p1),
	  getBalance(token, blackhat)
	])).map(r => r.toString()),
	[
	  "96000000005826674262",
	  "0"
	].map(r => r.toString())
      );
      await report_pools(nutmeg, token);
    });

    /// TODO: Need to test
    /// Partial redeems
    /// Adding to positions
  });
});
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
