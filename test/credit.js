// SPDX-License-Identifier: MIT
// settle.js - Basic credit event workflow
//
// This triggers a credit event by changing the exchange rate of the
// mock compound token
"use strict";

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory,
	mint_test_tokens, BAD_TOKEN, log, report_pools,
	report_balances,
        report_multipliers,
	stake: stake } = require('./utils');
const { start_baseline, end_baseline } = require('./test-report');


function credit_tests(rate, collateral, borrow, collateral_loss, close_position) {
  return addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, ctoken_contract, token_contract, compound_adapter;
  let ctoken;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract, compound_adapter] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    ctoken = ctoken_contract.address;
    await mint_test_tokens(nutmeg,
			   token_contract,
			   ctoken_contract,
			   p1, p2, p3, b1, b2);
  });
  it("staker stake", async() => {
    await log (async() => {
      await Promise.all([
        stake(nutmeg, token, 0, toWei(4), p1),
        stake(nutmeg, token, 1, toWei(4), p1),
        stake(nutmeg, token, 0, toWei(4), p2),
        stake(nutmeg, token, 1, toWei(4), p2)
      ]);
    }, 'stake 4 ETH in tranches 0,1 for p1 and p2');
    await log (async() => {
      await Promise.all([
        stake(nutmeg, token, 2, toWei(4), p1),
        stake(nutmeg, token, 2, toWei(4), p2)
      ]);
    }, 'stake 4 ETH in tranches 2 for p1 and p2');
		assert.deepEqual(
			(await Promise.all([
			  getBalance(token, p1),
			  getBalance(token, p2)

			])).map(r => r.toString()),
			[
			  '88000000000000000000',
			  '88000000000000000000'
			].map(r => r.toString())
		 );
  });

  it('Credit Event', async () => {
    await log (async() => {
      await nutmeg.openPosition(
        compound_adapter.address,
        token, ctoken, toWei(collateral), toWei(borrow),
        {from: b1});
    }, 'b1 borrows ' + borrow.toString() +' ETH with ' + collateral.toString() + ' ETH collateral');

    let pos = await nutmeg.POSITION_COUNTER();
    await log (async() => {
      await ctoken_contract.setExchangeRate(toWei(rate));
    }, 'setExchangeRate to ' + rate.toString());

    if (close_position) {
      await log (async() => {
        await nutmeg.closePosition(
          pos-1, compound_adapter.address,
          {from: b1});
      }, 'b1 closes position');
    }
    await log (async() => {
      const poolLoss = await compound_adapter.totalLoss(token);
      await nutmeg.settleCreditEvent(
	compound_adapter.address, token, collateral_loss, poolLoss,
	{from: governor}
      );
    }, 'credit event settles with ' + collateral_loss.toString() + ' ETH');
    await report_pools(
      nutmeg,
      token
    );
    await report_multipliers(
      nutmeg,
      token
    );
    await report_balances(
      token, 'base_token',
      [nutmeg.address, ctoken, p1, p2, b1],
      ['nutmeg', 'ctoken', 'p1', 'p2', 'b1']
    );
    await report_balances(
      ctoken, 'ctoken',
      [compound_adapter.address],
      ['compound_adapter']
    );
  });
  }
}

describe('credit', function() {
  before (async() => {
    start_baseline('credit');
  });
  after(async() => {
    end_baseline();
  });

  contract("Nutmeg Borrow - bust", credit_tests(0.0, 4, 24, 0, true));
  contract("Nutmeg Borrow - no credit event", credit_tests(1.0, 2, 12, 0, true));
  contract("Nutmeg Borrow - 25% loss", credit_tests(0.75, 2, 12, 0, true));
  contract("Nutmeg Borrow - 50% loss", credit_tests(0.5, 2, 12, 0, true));
  contract("Nutmeg Borrow - 100% loss", credit_tests(0.0, 2, 12, 0, true));
  contract("Nutmeg Borrow - 100% loss", credit_tests(0.0, 4, 21, 0, true));
});

exports.credit_tests = credit_tests;

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
