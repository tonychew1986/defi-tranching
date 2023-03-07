// SPDX-License-Identifier: MIT
// borrow-dry.js - Stake and then a massive borrow
// This tests when there are insufficient coins for
// a withdrawal.  We just get had an error when the
// coins are withdrawn.

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens, BAD_TOKEN, stake: stake } = require('./utils');

/// A run through for a borrow/staking scenario
contract("Nutmeg Borrow - Test 1", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, pos;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    await mint_test_tokens(nutmeg,
			   token_contract,
			   ctoken_contract,
			   p1, p2, p3, b1, b2);
  });
  describe("Nutmeg low stake high borrow", async () => {
    it("Stake some coins", async() => {
      await Promise.all([
        stake(nutmeg, token, 0, toWei(3), p1),
        stake(nutmeg, token, 1, toWei(2), p1)
      ]);
      await Promise.all([
        stake(nutmeg, token, 2, toWei(1), p1)
      ]);
      assert.equal(
        (await getBalance(token, p1)).toString(),
        '94000000000000000000'
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
	  '6000000000000000000',
	  '3000000000000000000',
	  '2000000000000000000',
	  '1000000000000000000',
	  '0',
	  '0',
	  '0'
	].map(r => r.toString())
      );
    });

    it('Borrow and try to unstake', async () => {
      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(1), toWei(2.5),
        {from: b1});
      assert.equal(
        (await getBalance(token, b1)).toString(),
        '99000000000000000000'
      );
      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(1), toWei(2.5),
        {from: b2});
      assert.equal(
        (await getBalance(token, b2)).toString(),
        '99000000000000000000'
      );
      pos = await nutmeg.POSITION_COUNTER();
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
	  '3000000000000000000',
	  '0',
	  '5000000000000000000',
	  '0',
	  '5000000000000000000',
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
	  '3000000000000000000',
	  '2000000000000000000',
	  '1000000000000000000',
	  '2500000000000000000',
	  '1666666666666666666',
	  '833333333333333334'
	].map(r => r.toString())
      );

      assert.deepEqual(
      (await Promise.all([
        getBalance(token, nutmeg.address),
        getBalance(token, p1)
      ])).map(r => r.toString()),
      [
        '3000000000000000000',
        '94000000000000000000'
      ].map(r => r.toString())
          );
      nutmeg.unstake(token, 0, toWei(3), {from: p1}),
      assert.equal(
        (await getBalance(token, p1)).toString(),
        '95000000140910388125'
      );

      nutmeg.unstake(token, 1, toWei(2), {from: p1});
      assert.equal(
        (await getBalance(token, p1)).toString(),
        '95000000710497526631'
      );

      nutmeg.unstake(token, 2, toWei(1), {from: p1}),
      assert.equal(
        (await getBalance(token, p1)).toString(),
        '95000001233114535762'
      );

    });
    it('Close and and unstake', async () => {
      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b2});
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
	  "3500001017884322685",
	  "0",
	  "2500000000000000000",
	  "0",
	  "2500000000000000000",
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
	  "2000000000000000000",
	  "2000000000000000000",
	  "1000000000000000000",
	  "1250000000000000000",
	  "833333333333333333",
	  "416666666666666667"
	].map(r => r.toString())
      );
/*      await nutmeg.unstake(token, 0, toWei(3), {from: p1});
      await nutmeg.unstake(token, 0, toWei(2), {from: p1});
      await nutmeg.unstake(token, 0, toWei(1), {from: p1}); */
    });
  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
