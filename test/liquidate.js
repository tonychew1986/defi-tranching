// SPDX-License-Identifier: MIT
// liquidate.js - Basic liquidate scenario
//
// This scenario adds artifically removes collateral to trigger
// liquidation event

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens,
	report_pools, report_balances, log,
        advanceBlock,
	BAD_TOKEN, stake: stake } = require('./utils');
const { start_baseline, end_baseline } = require('./test-report');
const BN = require('bn.js');

/// A run through for a borrow/staking scenario
describe('liquidate', ()=> {
  before (async() => {
    start_baseline('liquidate');
  });
  after(async() => {
    end_baseline();
  });
contract("Liquidate", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, token_contract, ctoken_contract;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    await Promise.all([
      token_contract.mint(p1, toWei(1000)),
      token_contract.mint(p2, toWei(1000)),
      token_contract.mint(p3, toWei(1000)),
      token_contract.mint(b1, toWei(1000)),
      token_contract.mint(b2, toWei(1000)),
      token_contract.approve(nutmeg.address, toWei(10), {from: p1}),
      token_contract.approve(nutmeg.address, toWei(10), {from: p2}),
      token_contract.approve(nutmeg.address, toWei(10), {from: p3}),
      token_contract.approve(nutmeg.address, toWei(10), {from: b1}),
      token_contract.approve(nutmeg.address, toWei(10), {from: b2})
    ]);
  });
  describe("Nutmeg scenario 1", async () => {
    it("staker stake", async() => {
      await Promise.all([
        stake(nutmeg, token, 0, toWei(3), p1),
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
				 '994000000000000000000',
				 '994000000000000000000'
			 ].map(r => r.toString())
			);
    });
    it('Liquidate', async() => {
      await report_pools(
	nutmeg, token,
	[
	  '4', '4', '4', '0', '0', '0'
	]
      );
      await report_balances(
	token, 'token',
	[nutmeg.address], ['nutmeg'],
	['12']
      );
      await log(
	() => nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(0.1), toWei(0.5),
          {from: b1}),
	'open position 0.1 ETH collateral, 0.5 borrow'
      );
			assert.equal(
        (await getBalance(token, b1)).toString(),
        '999900000000000000000'
      );
      report_pools(
	nutmeg, token
      );
      await report_balances(
	token, 'token',
	[nutmeg.address], ['nutmeg'],
	['11.6']
      );
      pos = await nutmeg.POSITION_COUNTER();
      await log (
	async () => {
	  await advanceBlock();
	  await advanceBlock();
	  await advanceBlock();
	},
	'accrue three periods of interest'
      );
      await log (
	async () => {
	  await expectRevert(
	    nutmeg.liquidatePosition(
              pos-1, compound_adapter.address,
              {from: b1}),
	    'liquidate: position is not ready for liquidation yet');
	}, 'try liquidate good position'
      );

      // Force reduce collateral
      await log (
	async () => {
	  interest = await nutmeg.getPositionInterest(token, pos-1);
	  await nutmeg._testSetBaseAmt(pos-1,
				       interest.mul(new BN(2)), {from: governor});
	},
	'force reduce collateral'
      );
      report_pools(
	nutmeg, token
      );

      await report_balances(
	token, 'base_token',
	[nutmeg.address, ctoken, p1, p2, p3, b1],
	['nutmeg', 'ctoken', 'p1', 'p2', 'p3', 'b1']
      );
      await report_balances(
	ctoken, 'ctoken',
	[compound_adapter.address],
	['compound_adapter']
      );

      await log (
	() => {
	  nutmeg.liquidatePosition(
            pos-1, compound_adapter.address,
            {from: p3})
	}, 'liquidate'
      );

      assert.equal(
        (await getBalance(token, p3)).toString(),
        '1000024999999001141552'
      );

      await report_balances(
	token, 'base_token',
	[nutmeg.address, ctoken, p1, p2, p3, b1],
	['nutmeg', 'ctoken', 'p1', 'p2', 'p3', 'b1']
      );
      await report_balances(
	ctoken, 'ctoken',
	[compound_adapter.address],
	['compound_adapter']
      );

      await expectRevert(
	nutmeg.closePosition(
          pos-1, compound_adapter.address,
          {from: b1}),
	'only open pos');
    });
    /// TODO: Need to test
    /// Partial redeems
    /// Adding to positions
  });
});
});
// Make sure that the requires statements get tripped

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
