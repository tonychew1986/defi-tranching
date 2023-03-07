// SPDX-License-Identifier: MIT
// test scenario for staking and unstaking

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance,  nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake, log, report, fromWei } = require('./utils');

/// A run through for a borrow/staking scenario
contract("Nutmeg Borrow - Scenario 0001", addresses => {
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
  it("Stake coins test", async() => {
      await log(async () => {
        await stake(nutmeg, token, 0, toWei(100), p1)
      }, "p1 stakes 100 ETH");
      await log(async () => {
        await stake(nutmeg, token, 0, toWei(50), p2)
      }, "p2 stakes 50 ETH");
      await log(async () => {
	await nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(10), toWei(100),
          {from: p3}
	)
      }, 'p3 borrows 100 ETH with 10 ETH collateral');
      let pool = await nutmeg.getPool(token);
      await report(
	  () => [
	      fromWei(pool.principals[0]),
	      fromWei(pool.loans[0]),
	      getBalance(token, nutmeg.address, "ether"),
	      getBalance(token, ctoken, "ether"),
	      getBalance(token, p1, "ether"),
	      getBalance(token, p2, "ether"),
	      getBalance(token, p3, "ether"),
	      getBalance(
		  ctoken, compound_adapter.address, "ether"
	      ),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p1, 0
	      ).then(r => fromWei(r)),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p2, 0
	      ).then(r => fromWei(r))
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      "tokens at p1:            ",
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      ',
	      "max withdraw principal p1",
	      "max withdraw principal p2"
	  ],
	  [
	      '150',
	      '100',
	      '60',
	      '100',
	      '100',
	      '150',
	      '190',
	      '100',
	      '50',
	      '50'
	  ]
      );
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(100), {from: p1})
      }, "p1 unstake attempt 100 ETH");
      pool = await nutmeg.getPool(token);
      await report(
	  () => [
	      fromWei(pool.principals[0]),
	      fromWei(pool.loans[0]),
	      getBalance(token, nutmeg.address, "ether"),
	      getBalance(token, ctoken, "ether"),
	      getBalance(token, p1, "ether"),
	      getBalance(token, p2, "ether"),
	      getBalance(token, p3, "ether"),
	      getBalance(
		  ctoken, compound_adapter.address, "ether"
	      ),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p1, 0
	      ).then(r => fromWei(r)),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p2, 0
	      ).then(r => fromWei(r))
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      ',
	      "max withdraw principal p1",
	      "max withdraw principal p2"
	  ],
	  [
	      '100',
	      '100',
	      '9.9999975900558093',
	      '100',
	      '150.0000024099441907',
	      '150',
	      '190',
	      '100',
	      '0',
	      '0'
	  ]
      );
      pos = await nutmeg.POSITION_COUNTER();
      await log(async() => {
	  nutmeg.closePosition(
              pos-1, compound_adapter.address,
              {from: p3})
      }, 'p3 redeem borrow');
      pool = await nutmeg.getPool(token);
      await report(
	  () => [
	      fromWei(pool.principals[0]),
	      fromWei(pool.loans[0]),
	      getBalance(token, nutmeg.address, "ether"),
	      getBalance(token, ctoken, "ether"),
	      getBalance(token, p1, "ether"),
	      getBalance(token, p2, "ether"),
	      getBalance(token, p3, "ether"),
	      getBalance(
		  ctoken, compound_adapter.address, "ether"
	      ),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p1, 0
	      ).then(r => fromWei(r)),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p2, 0
	      ).then(r => fromWei(r))
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      ',
	      "max withdraw principal p1",
	      "max withdraw principal p2"
	  ]
      );
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(50), {from: p1})
      }, "p1 unstake attempt 50 ETH");
      await log(async () => {
         nutmeg.unstake(token, 0, toWei(50), {from: p2})
      }, "p2 unstake attempt 50 ETH");
      pool = await nutmeg.getPool(token);
      await report(
	  () => [
	      fromWei(pool.principals[0]),
	      fromWei(pool.loans[0]),
	      getBalance(token, nutmeg.address, "ether"),
	      getBalance(token, ctoken, "ether"),
	      getBalance(token, p1, "ether"),
	      getBalance(token, p2, "ether"),
	      getBalance(token, p3, "ether"),
	      getBalance(
		  ctoken, compound_adapter.address, "ether"
	      ),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p1, 0
	      ).then(r => fromWei(r)),
	      nutmeg.getMaxUnstakePrincipal(
		  token, p2, 0
	      ).then(r => fromWei(r))
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      ',
	      "max withdraw principal p1",
	      "max withdraw principal p2"
	  ]
      );
  });
});
