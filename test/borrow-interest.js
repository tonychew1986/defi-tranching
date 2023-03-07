// SPDX-License-Identifier: MIT
// borrow-interest.js - Borrow interest calculation

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, BAD_TOKEN,
	mint_test_tokens,
	stake: stake } = require('./utils');

const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const MockCERC20 = artifacts.require("MockCERC20");
const Nut = artifacts.require('Nut');

/// A run through for a borrow/staking scenario
contract("Nutmeg Borrow - Interest check", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    await mint_test_tokens(nutmeg,
			   token_contract,
			   ctoken_contract,
			   p1, p2, p3, b1, b2);
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
			assert.deepEqual(
				(await Promise.all([
				  getBalance(token, p1),
				  getBalance(token, p2)

				])).map(r => r.toString()),
				[
				  '93000000000000000000',
				  '94000000000000000000'
				].map(r => r.toString())
			 );

      let pool = await nutmeg.getPool(token);
      assert.deepEqual(
	(await Promise.all([
	  getBalance(token, nutmeg.address),
	  pool.principals[0],
	  pool.principals[1],
	  pool.principals[2],
	  pool.loans[0],
	  pool.loans[1],
	  pool.loans[2]
	])).map(r => r.toString()),
	[
	  '13000000000000000000',
	  '5000000000000000000',
	  '4000000000000000000',
	  '4000000000000000000',
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
    });

    it('Remove some liquidity', async() => {
      nutmeg.unstake(token, 0, toWei(1), {from: p1});
      expectRevert(
        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
        'unstk no dpt'
      );
      assert.equal(
        (await getBalance(token, nutmeg.address)).toString(),
        '12000000000000000000'
      );

      let pool = await nutmeg.getPool(token);
      assert.deepEqual(
	(await Promise.all([
	  pool.principals[0].toString(),
	  pool.principals[1].toString(),
	  pool.principals[2].toString(),
	  pool.loans[0].toString(),
	  pool.loans[1].toString(),
	  pool.loans[2].toString()
	])).map(r => r.toString()),
	[
	  '4000000000000000000',
	  '4000000000000000000',
	  '4000000000000000000',
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
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
	  '500000000000000000',
	  '0',
	  '500000000000000000',
	  '0',
	  '0'
	].map(r => r.toString())
      );
      pool = await nutmeg.getPool(token);
      assert.deepEqual(
	(await Promise.all([
	  pool.principals[0].toString(),
	  pool.principals[1].toString(),
	  pool.principals[2].toString(),
	  pool.loans[0].toString(),
	  pool.loans[1].toString(),
	  pool.loans[2].toString()
	])).map(r => r.toString()),
	[
	  '4000000000000000000',
	  '4000000000000000000',
	  '4000000000000000000',
	  '166666666666666666',
	  '166666666666666666',
	  '166666666666666668'
	].map(r => r.toString())
      );
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
	  getBalance(token, ctoken),
	  getBalance(ctoken, nutmeg.address),
	  getBalance(ctoken, compound_adapter.address),
	  getBalance(ctoken, ctoken),
	  nutmeg.getPositionInterest(token, pos -1),
	])).map(r => r.toString()),
	[
	  "12000000009988584474",
	  '0',
	  "0",
	  "0",
	  "0",
	  "0",
	  "0",
	]
      );

      pool = await nutmeg.getPool(token);
      assert.deepEqual(
	(await Promise.all([
	  pool.principals[0].toString(),
	  pool.principals[1].toString(),
	  pool.principals[2].toString(),
	  pool.loans[0].toString(),
	  pool.loans[1].toString(),
	  pool.loans[2].toString()
	])).map(r => r.toString()),
	[
	  '4000000000000000000',
	  '4000000000000000000',
	  '4000000000000000000',
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
    });

    it('Remove some liquidity', async() => {
      nutmeg.unstake(token, 0, toWei(2), {from: p1});
      expectRevert(
        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
        'unstk no dpt'
      );
      assert.equal(
        (await getBalance(token, nutmeg.address)).toString(),
        '10000000007491438363'
      );

      let pool = await nutmeg.getPool(token);
      assert.deepEqual(
	(await Promise.all([
	  pool.principals[0].toString(),
	  pool.principals[1].toString(),
	  pool.principals[2].toString(),
	  pool.loans[0].toString(),
	  pool.loans[1].toString(),
	  pool.loans[2].toString()
	])).map(r => r.toString()),
	[
	  '2000000000000000000',
	  '4000000000000000000',
	  '4000000000000000000',
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
    });

    /// TODO: Need to test
    /// Partial redeems
    /// Adding to positions
  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
