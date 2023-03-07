// SPDX-License-Identifier: MIT
// test scenario for staking and unstaking

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance,  nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake, log, report, fromWei, report_vtb,
	latestBlock, advanceBlockBy, report_balances } = require('./utils');
const { start_baseline, end_baseline } = require('./test-report');

describe('nut-distrib-small', ()=> {
before (async() => {
  start_baseline('nut-distrib-small')
});
after(async() => {
  end_baseline()
});

/// A run through for a borrow/staking scenario
contract("Nut distribution test", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, pos, ctoken, nut, nut_distributor_contract;
  before(async() => {
    [nutmeg, token_contract, ctoken_contract, compound_adapter,
     nut_distributor_contract, nut_contract,
     oracle_contract] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    ctoken = ctoken_contract.address;
    nut = nut_contract.address;
    oracle_contract.setPrices([
      token
    ], [
      toWei(1800.0)
    ]);
    await Promise.all([
      token_contract.mint(p1, toWei(200)),
      token_contract.mint(p2, toWei(200)),
      token_contract.mint(p3, toWei(200)),
      token_contract.approve(nutmeg.address, 100, {from: p1}),
      token_contract.approve(nutmeg.address, toWei(100), {from: p2}),
      token_contract.approve(nutmeg.address, toWei(100), {from: p3})
    ]);
  });
  it("Nut distribution test", async() => {
    await log(async () => {
      await stake(nutmeg, token, 0, 100, p1)
    }, "p1 stakes 100 wei");
    await log(async () => {
      await stake(nutmeg, token, 0, toWei(50), p2)
    }, "p2 stakes 50 ETH");
    await report_balances(
      token, 'base_token',
      [nutmeg.address, ctoken, p1, p2],
      ['nutmeg', 'ctoken', 'p1', 'p2']
    );

    await report_balances(
      nut, 'nut_token',
      [nut, p1, p2],
      ['nut', 'p1', 'p2']
    );
  });
  it("Advance blocks", async() => {
    await advanceBlockBy(500);
    console.log('advance blocks by 500');
    console.log((await latestBlock()).toString());
    await nut_distributor_contract.distribute({from: governor});
  }).timeout(600000);
  it("unstake advance and unstake", async() => {
    await report_vtb(nut_distributor_contract, token, p1);
    await log(async() => {
      await nutmeg.unstake(token, 0, 99, {from: p1})
    }, "p1 unstake attempt 50 wei");
    await report_vtb(nut_distributor_contract, token, p1);

    await log(async () => {
      await nutmeg.unstake(token, 0, 1, {from: p1})
    }, "p1 unstake attempt 50 wei");

    await log(async () => {
      await nutmeg.unstake(token, 0, toWei(50), {from: p2})
    }, "p2 unstake attempt 50 ETH");
  });

  it("Distribute nutmeg and collect", async() => {
    await advanceBlockBy(100);
    console.log('advance blocks by 100');
    console.log((await latestBlock()).toString());
    await nut_distributor_contract.distribute({from: governor});
    await report_vtb(nut_distributor_contract, token, p1);
    await report(
      () => [
        nut_distributor_contract.getCollectionAmount({from: p1}),
        nut_distributor_contract.getCollectionAmount({from: p2})
      ],
      ['collection p1:',
       'collection p2:'
      ]
    );

    await nut_distributor_contract.collect({from: p1});
    await nut_distributor_contract.collect({from: p2});
    await report_balances(
      token, 'base_token',
      [nutmeg.address, ctoken, p1, p2],
      ['nutmeg', 'ctoken', 'p1', 'p2']
    );
    await report_balances(
      nut, 'nut_token',
      [nut, p1, p2],
      ['nut', 'p1', 'p2']
    );
  });
});
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
