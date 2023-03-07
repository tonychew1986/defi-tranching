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


function credit_tests(events) {
  return addresses => {
    const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
    let addr = {};
    addr['p1'] = p1;
    addr['p2'] = p2;
    addr['p3'] = p3;
    addr['b1'] = b1;
    addr['b2'] = b2;
    addr['blackhat'] = blackhat;
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
      for (const r of events) {
        if (r[0] == 'stake') {
          await log(() => {
            nutmeg.stake(
              token, r[1], toWei(r[2]), { from: addr[r[3]] }
            );
          },
                    'stake ' + r[2].toString() + ' ETH from ' + r[3] + ' into ' + r[1].toString());
        }
        else if (r[0] == 'unstake') {
          await log(() => {
            nutmeg.unstake(
              token, r[1], toWei(r[2]), { from: addr[r[3]] }
            )
          },
                    'unstake ' + r[1].toString() + ' ETH from ' + r[3] + ' into ' + r[1].toString());
        }  else if (r[0] == 'open') {
          await log (async() => {
            await nutmeg.openPosition(
              compound_adapter.address,
              token, ctoken, toWei(r[1]), toWei(r[2]),
              {from: b1});
          }, 'b1 borrows ' + r[2].toString() +' ETH with ' + r[1].toString() + ' ETH collateral');
        }
        else if (r[0] == 'setRate') {
          await log (async() => {
            await ctoken_contract.setExchangeRate(toWei(r[1]));
          }, 'setExchangeRate to ' + r[1].toString());
        }
        else if (r[0] == 'close') {
          await log (async() => {
            const pos = await nutmeg.POSITION_COUNTER();
            await nutmeg.closePosition(
              pos-1, compound_adapter.address,
              {from: b1});
          }, 'b1 closes position');
        }

        else if (r[0] == 'settle') {
          await log (async() => {
            const poolLoss = await compound_adapter.totalLoss(token);
            await nutmeg.settleCreditEvent(
	      compound_adapter.address, token,  r[1], poolLoss,
	      {from: governor}
            );
          }, 'credit event settles with ' + r[1].toString() + ' ETH');
        }
        else {
          console.log('unknown command ' + r[0]);
        };
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
      }
    });
  }
}

describe('credit-multiple', () => {
  before (async() => {
    start_baseline('credit-multiple');
  });
  after(async() => {
    end_baseline();
  });

  contract("Nutmeg Borrow - bust",
           credit_tests(
             [
               ['open', 2, 24],
               ['setRate', 0,0],
               ['close'],
               ['settle', 0]
             ])
          );
  contract("Nutmeg Borrow - sequence",
           credit_tests(
             [
               ['open', 2, 24],
               ['setRate', 0,0],
               ['close'],
               ['settle', 0],
               ['stake', 0, 2, 'p1'],
               ['stake', 1, 2, 'p1'],
               ['stake', 2, 2, 'p1'],
               ['setRate', 1.0],
               ['open', 0.1, 3],
               ['setRate', 0.25],
               ['close'],
               ['settle', 0],
               ['setRate', 1.0],
               ['stake', 0, 2, 'p1'],
               ['stake', 1, 2, 'p1'],
               ['stake', 2, 2, 'p1'],
               ['open', 0.1, 3],
               ['setRate', 0.25],
               ['close'],
               ['settle', 0]
             ])
          );

});

exports.credit_tests = credit_tests;

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
