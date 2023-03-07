// SPDX-License-Identifier: MIT
// borrow-dry.js - Stake and then a massive borrow
// This tests when there are insufficient coins for
// a withdrawal.  We just get had an error when the
// coins are withdrawn.

const Formula = artifacts.require("Formula");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens, BAD_TOKEN, stake: stake } = require('./utils');
const BigNumber = require('bignumber.js')
function random(min, max) {
  return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toPrecision(1);
}
const SAMPLE_SIZE = 3
for (var i = 0; i < SAMPLE_SIZE; i++){
	(function(i){
  		console.log("Sample ", i+1 , " :")
  		let initial_balance = 100000000000000000000

  		let stake_p1_01 = parseInt(new BigNumber(random(8000000000000000000,10000000000000000000)))
  		let stake_p1_02 = parseInt(new BigNumber(random(6000000000000000000,8000000000000000000)))
  		let stake_p1_03 = parseInt(new BigNumber(random(5000000000000000000,6000000000000000000)))

  		let total_stake_p1 = stake_p1_01 + stake_p1_02 + stake_p1_03
  		let unstake_p1_01 = parseInt(new BigNumber(random(1,stake_p1_01/5)))
  		let ctoken_mint = 1000000000000000000

  		console.log("stake_p1_01: ", stake_p1_01)
  		console.log("stake_p1_02: ", stake_p1_02)
  		console.log("stake_p1_03: ", stake_p1_03)

  		console.log("unstake_p1_01: ", unstake_p1_01)
  		let loans_01
  		let loans_02
  		let loans_03

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
              stake(nutmeg, token, 0, stake_p1_01.toString(), p1),
              stake(nutmeg, token, 1, stake_p1_02.toString(), p1)
            ]);
            await Promise.all([
              stake(nutmeg, token, 2, stake_p1_03.toString(), p1)
            ]);
            assert.equal(
              (await getBalance(token, p1)).toString(),
              initial_balance - stake_p1_01 - stake_p1_02 - stake_p1_03
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
      	  total_stake_p1,
      	  stake_p1_01,
      	  stake_p1_02,
      	  stake_p1_03,
      	  '0',
      	  '0',
      	  '0'
      	].map(r => r.toString())
            );
          });

          it('Borrow and try to unstake', async () => {
            let borrowAmt_b1 = 2500000000000000000
            let borrowAmt_b2 = 2500000000000000000

            let baseAmt_b1 =  1000000000000000000
            let baseAmt_b2 = 1000000000000000000
            await nutmeg.openPosition(
              compound_adapter.address,
              token, ctoken, baseAmt_b1.toString(), borrowAmt_b1.toString(),
              {from: b1});
            assert.equal(
              (await getBalance(token, b1)).toString(),
              initial_balance - baseAmt_b1
            );

            await nutmeg.openPosition(
              compound_adapter.address,
              token, ctoken, baseAmt_b2.toString(), borrowAmt_b2.toString(),
              {from: b2});
            assert.equal(
              (await getBalance(token, b2)).toString(),
              initial_balance - baseAmt_b2
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
      	  total_stake_p1 + baseAmt_b1 + baseAmt_b2 - borrowAmt_b1 - borrowAmt_b2,// '3000000000000000000',
      	  '0',
      	  borrowAmt_b1 + borrowAmt_b2,
      	  '0',
      	  borrowAmt_b1 + borrowAmt_b2,
      	  '0',
      	  '0'
      	].map(r => r.toString())
            );
            pool = await nutmeg.getPool(token);
            const math = await Formula.new({from: owner});
            let principal_01 = stake_p1_01
    			  let principal_02 = stake_p1_02
    			  let principal_03 = stake_p1_03
    				let total_principal = principal_01 + principal_02 + principal_03

    	      pool = await nutmeg.getPool(token);

            let borrowAmt = borrowAmt_b1 + borrowAmt_b2
    				loans_01 = await math.mul(borrowAmt.toString(), principal_01.toString())
    				loans_01 = await math.div(loans_01, total_principal.toString())

    				loans_02 = await math.mul(borrowAmt.toString(), principal_02.toString())
    				loans_02 = await math.div(loans_02, total_principal.toString())

            loans_03 = await math.mul(borrowAmt.toString(), principal_03.toString())
    				loans_03 = await math.div(loans_03, total_principal.toString())

            assert.deepEqual(
      	(await Promise.all([
      	  pool.principals[0].toString(),
      	  pool.principals[1].toString(),
      	  pool.principals[2].toString(),
      	  pool.loans[0].toString().slice(0, -1),
      	  pool.loans[1].toString().slice(0, -1),
      	  pool.loans[2].toString().slice(0, -1)
      	])).map(r => r.toString()),
      	[
          stake_p1_01,
          stake_p1_02,
          stake_p1_03,
          loans_01.toString().slice(0, -1),
          loans_02.toString().slice(0, -1),
          loans_03.toString().slice(0, -1)
      	].map(r => r.toString())
            );

            assert.deepEqual(
            (await Promise.all([
              getBalance(token, nutmeg.address),
              getBalance(token, p1)
            ])).map(r => r.toString()),
            [
              total_stake_p1 + baseAmt_b1 + baseAmt_b2 - borrowAmt_b1 - borrowAmt_b2,
              initial_balance - total_stake_p1
            ].map(r => r.toString())
                );
            nutmeg.unstake(token, 0, toWei(3), {from: p1})

          });
          it('Close and and unstake', async () => {
            await nutmeg.closePosition(
              pos-1, compound_adapter.address,
              {from: b2});

            pool = await nutmeg.getPool(token);

          });
        });
      });
  })(i)
}
/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
