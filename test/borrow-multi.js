// SPDX-License-Identifier: MIT
// test scenario for staking and unstaking

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance,  nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake, log, report, fromWei,
        add_new_token, mint_mock_tokens} = require('./utils');

/// A run through for a borrow/staking scenario
contract("Nutmeg Borrow - Multiple tokens", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, pos, pos2, token2, ctoken2;
  before(async () => {
    [nutmeg, token_contract, ctoken_contract, adapter] =
      await nutmeg_factory(owner, governor, p1, p2, p3, b1, b2);
    token = token_contract.address;
    ctoken = ctoken_contract.address;
    [token2_contract, ctoken2_contract] =
      await add_new_token(nutmeg, adapter, owner, governor,
                    'TOKEN2', 'TOKEN2', 6);
    token2 = token2_contract.address;
    ctoken2 = ctoken2_contract.address;
    await mint_mock_tokens(nutmeg, token2_contract, '100',
                           [p1, p2, p3, b1, b2]);

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
      }, "p1 stakes 100 ETH token");
      await log(async () => {
        await stake(nutmeg, token2, 0, toWei(100), p1)
      }, "p1 stakes 100 ETH token2");
      await log(async () => {
        await stake(nutmeg, token, 0, toWei(50), p2)
      }, "p2 stakes 50 ETH token");
      await log(async () => {
	await nutmeg.openPosition(
          compound_adapter.address,
          token, ctoken, toWei(10), toWei(100),
          {from: p3}
	)
      }, 'p3 borrows 100 ETH with 10 ETH collateral - token');
      pos = await nutmeg.POSITION_COUNTER();
      await log(async () => {
	await nutmeg.openPosition(
          compound_adapter.address,
          token2, ctoken2, toWei(2.5), toWei(25),
          {from: p3}
	)
      }, 'p3 borrows 25 ETH with 2.5 ETH collateral - token2');
      await log(async() => {
          expectRevert.unspecified(
              nutmeg.openPosition(
                  compound_adapter.address,
                  token2, ctoken, toWei(2.5), toWei(25),
                  {from: p3}
	      )
          )
      }, 'p3 borrows invalid adapter');

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
	      )
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      "tokens at p1:            ",
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      '
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
	      )
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      '
	  ],
	  [
	      '100',
	      '100',
	      '9.9999927701674278',
	      '100',
	      '150.0000072298325722',
	      '150',
	      '190',
	      '100'
	  ]
      );

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
	      )
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      '
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
	      )
	  ],
	  [
	      "principal:               ",
	      "loans:                   ",
	      "tokens at nutmeg:        ",
	      'tokens at compound:      ',
	      'tokens at p1:            ',
	      'tokens at p2:            ',
	      'tokens at p3:            ',
	      'ctokens at adapter:      '
	  ]
      );
  });
});
