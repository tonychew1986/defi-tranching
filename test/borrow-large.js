// SPDX-License-Identifier: MIT
// borrow.js - Basic borrow workflow

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake, report_pools,
        report_balances } = require('./utils');

const { start_baseline, end_baseline } = require('./test-report');

describe('borrow-large', ()=> {
  before (async() => {
    start_baseline('borrow-large');
  });
  after(async() => {
    end_baseline();
  });


/// A run through for a borrow/staking scenario
contract("Nutmeg Borrow - Test 1", addresses => {
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
      await report_balances(
        token, 'token',
        [p1, p2], ['p1', 'p2']
      );
      await report_pools(nutmeg, token);
    });


    it("staker stake large amount", async() => {
      await token_contract.mint(p3, toWei("100000000000"));
      await token_contract.approve(nutmeg.address, toWei(100000000000),
	                           {from: p3});
      await Promise.all([
        stake(nutmeg, token, 0, toWei(1000000000), p3)
      ]);
      await Promise.all([
        stake(nutmeg, token, 2, toWei(1), p1)
      ]);

      await report_balances(
        token, 'token',
        [p3], ['p3']
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
        [nutmeg.address], ['nutmeg']
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
          '1000000013000000000000000000',
	  '9900000000000000000'
	]
      );

      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(0.1), toWei(0.5),
        {from: b1});
      let pos = await nutmeg.POSITION_COUNTER();
      await report_balances(
        token, 'token',
        [nutmeg.address,
         compound_adapter.address,
         ctoken],
        ['nutmeg', 'compound_adapter', 'ctoken']
      );
      await report_balances(
        ctoken, 'ctoken',
        [nutmeg.address,
         compound_adapter.address,
         ctoken],
        ['nutmeg', 'compound_adapter', 'ctoken']
      );
      await report_pools(nutmeg, token);
      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b1});
      await report_balances(
        token, 'token',
        [nutmeg.address,
         compound_adapter.address,
         ctoken],
        ['nutmeg', 'compound_adapter', 'ctoken']
      );
      await report_balances(
        ctoken, 'ctoken',
        [nutmeg.address,
         compound_adapter.address,
         ctoken],
        ['nutmeg', 'compound_adapter', 'ctoken']
      );
      await report_pools(nutmeg, token);
    });
    it('Liquidate', async() => {
      let pos = await nutmeg.POSITION_COUNTER();
      await expectRevert(
        nutmeg.liquidatePosition(
          pos-1, compound_adapter.address,
          {from: b1}),
	'only open pos'
      );
      await report_pools(nutmeg, token);

      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(0.1), toWei(0.5),
        {from: b1});
      await report_balances(
        token, 'token',
        [b1],
        ['b1']
      );

      pos = await nutmeg.POSITION_COUNTER();
      await expectRevert(
        nutmeg.liquidatePosition(
          pos-1, compound_adapter.address,
          {from: b1}),
	'position is not ready for liquidation yet.'
      );
      await nutmeg.closePosition(
        pos-1, compound_adapter.address,
        {from: b1});
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
