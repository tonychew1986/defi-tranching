// SPDX-License-Identifier: MIT
// check-requires.js - Check if requires are being hit
//
// Most of these tests are invalid inputs to check if the
// requires are being properly checked

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake } = require('./utils');

const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const MockAdapter = artifacts.require("MockAdapter");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const MockCERC20 = artifacts.require("MockCERC20");

// Make sure that the requires statements get tripped

contract("Nutmeg check requires", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, mock_adapter;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract, compound_adapter] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    mock_adapter = await MockAdapter.new(nutmeg.address, token);
    await mint_test_tokens(nutmeg,
			   token_contract,
			   ctoken_contract,
			   p1, p2, p3, b1, b2);
    await nutmeg.addAdapter(mock_adapter.address, {from: governor});
  });
  describe("Nutmeg add remove token pair", async () => {
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
	  pool.principals[0].toString(),
	  pool.principals[1].toString(),
	  pool.principals[2].toString(),
	  pool.loans[0].toString(),
	  pool.loans[1].toString(),
	  pool.loans[2].toString()
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
      assert.equal(pool.principals[0].toString(), '4000000000000000000');
      assert.equal(pool.principals[1].toString(), '4000000000000000000');
      assert.equal(pool.principals[2].toString(), '4000000000000000000');
    });

    it("token/pair", async() => {
      await compound_adapter.removeTokenPair(token, {from: governor});
      await expectRevert(
        nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(0.1), toWei(0.5),
          {from: b1}),
	'invalid baseToken address'
      );
      await compound_adapter.addTokenPair(token, ctoken, {from: governor})
      await expectRevert(
        nutmeg.openPosition(
          compound_adapter.address,
          token, BAD_TOKEN, toWei(0.1), toWei(0.5),
          {from: b1}),
	'invalid cToken address'
      );
      await expectRevert(
        nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(0), toWei(0.5),
          {from: b1}),
	'invalid base amount'
      );
      await expectRevert(
        nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(1000000), toWei(0.5),
          {from: b1}),
	'insufficient balance'
      );
      const maxBorrow = await nutmeg.getMaxBorrowAmount(
	token, toWei(0.01)
      );
			assert.equal(maxBorrow.toString(), '990000000000000000');
      await expectRevert(
        nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(0.01), maxBorrow + 1,
          {from: b1}),
	'openPosition: borrowAmt exceeds maximum'
      );
      await Promise.all([
        nutmeg.unstake(token, 0, toWei(1), {from: p1}),
        nutmeg.unstake(token, 1, toWei(1), {from: p1})
      ]);
			assert.equal((await getBalance(token, p1)).toString(), '96000000000000000000');
    });
    it("open close/positions", async() => {
      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(0.1), toWei(0.5),
        {from: b1});
			assert.equal((await getBalance(token, b1)).toString(), '99900000000000000000');
      let pos = await nutmeg.POSITION_COUNTER();
      await expectRevert(
	nutmeg.openPosition(
	  compound_adapter.address,
          token, ctoken, toWei(0.1), toWei(0.5),
          {from: blackhat}),
	'only owner can initialize this call');
      await expectRevert(
	nutmeg.closePosition(
	  pos-1, compound_adapter.address,
          {from: blackhat}),
	'original caller is not the owner');
      await expectRevert(
	nutmeg.liquidatePosition(
	  pos-1, compound_adapter.address,
	  {from: b2}
	),
	'position is not ready for liquidation yet.'
      );
      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b1});
    });
    it("settle credit event", async() => {
      await nutmeg.settleCreditEvent(
	  compound_adapter.address, token, 0, 0,
	{from: governor}
      );
			assert.equal((await getBalance(token, governor)).toString(), '0');
    });
  });
});
