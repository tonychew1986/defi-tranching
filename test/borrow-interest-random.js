// SPDX-License-Identifier: MIT
// borrow-interest.js - Borrow interest calculation

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, BAD_TOKEN,
	mint_test_tokens,
	stake: stake } = require('./utils');

const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const MockCERC20 = artifacts.require("MockCERC20");
const Nut = artifacts.require('Nut');
const Formula = artifacts.require("Formula");

const BigNumber = require('bignumber.js')
function random(min, max) {
  return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toPrecision(1);
}

const SAMPLE_SIZE = 5
for (var i = 0; i < SAMPLE_SIZE; i++){
	(function(i){
		console.log("Sample ", i+1 , " :")
		let initial_balance = 100000000000000000000

		let stake_p1_01 = parseInt(new BigNumber(random(4000000000000000000,10000000000000000000)))
		let stake_p1_02 = parseInt(new BigNumber(random(1,2000000000000000000)))
		let stake_p1_03 = parseInt(new BigNumber(random(1,2000000000000000000)))

		let stake_p2_01 = parseInt(new BigNumber(random(1,2000000000000000000)))
		let stake_p2_02 = parseInt(new BigNumber(random(2000000000000000000,10000000000000000000)))
		let stake_p2_03 = parseInt(new BigNumber(random(1,1900000000000000000)))

		let total_stake_p1 = stake_p1_01 + stake_p1_02 + stake_p1_03

		let total_stake_p2 = stake_p2_01 + stake_p2_02 + stake_p2_03

		let unstake_p1_01 = parseInt(new BigNumber(random(1,stake_p1_01 - 1)))
		let ctoken_mint = 1000000000000000000

		let unstake_p1_02 = parseInt(new BigNumber(random(1, total_stake_p1 - unstake_p1_01)))
		let unstake_blackhat_02 = parseInt(new BigNumber(random(1, 2000000000000000000)))
		console.log("stake_p1_01: ", stake_p1_01)
		console.log("stake_p1_02: ", stake_p1_02)
		console.log("stake_p1_03: ", stake_p1_03)
		console.log("stake_p2_01: ", stake_p2_01)
		console.log("stake_p2_02: ", stake_p2_02)
		console.log("stake_p2_03: ", stake_p2_03)
		console.log("unstake_p1_01: ", unstake_p1_01)
		console.log("unstake_p1_02: ", unstake_p1_02)
		console.log("unstake_blackhat_02: ", unstake_blackhat_02)
		let loans_01
		let loans_02
		let loans_03
		let baseAmt = parseInt(new BigNumber(random(1, 1000000000000000)))
		let borrowAmt = parseInt(new BigNumber(random(1, 5000000000000000)))
/// A run through for a borrow/staking scenario
		contract("Nutmeg Borrow - Interest check", addresses => {
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
		        stake(nutmeg, token, 0, stake_p1_01.toString(), p1),
		        stake(nutmeg, token, 1, stake_p1_02.toString(), p1),
		        stake(nutmeg, token, 0, stake_p2_01.toString(), p2),
		        stake(nutmeg, token, 1, stake_p2_02.toString(), p2)
		      ]);
		      await Promise.all([
		        stake(nutmeg, token, 2, stake_p1_03.toString(), p1),
		        stake(nutmeg, token, 2, stake_p2_03.toString(), p2)
		      ]);
					assert.deepEqual(
						(await Promise.all([
						  getBalance(token, p1),
						  getBalance(token, p2)

						])).map(r => r.toString()),
						[
						  initial_balance - stake_p1_01 - stake_p1_02 - stake_p1_03,
						  initial_balance - stake_p2_01 - stake_p2_02 - stake_p2_03,
						].map(r => r.toString())
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
			  total_stake_p1 + total_stake_p2,
			  stake_p1_01 +  stake_p2_01,
			  stake_p1_02 +  stake_p2_02,
			  stake_p1_03 +  stake_p2_03,
			  '0',
			  '0',
			  '0'
			].map(r => r.toString())
		      );
		    });

		    it('Remove some liquidity', async() => {
		      nutmeg.unstake(token, 0, unstake_p1_01.toString(), {from: p1});
		      expectRevert(
		        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
		        'unstk no dpt'
		      );
		      assert.equal(
		        (await getBalance(token, nutmeg.address)).toString(),
		        total_stake_p1 + total_stake_p2 - unstake_p1_01,
		      );

		      let pool = await nutmeg.getPool(token);
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
			  stake_p1_01 + stake_p2_01 - unstake_p1_01,
			  stake_p1_02 + stake_p2_02,
			  stake_p1_03 + stake_p2_03,
			  '0',
			  '0',
			  '0'
			].map(r => r.toString())
		      );
		    });

				const math = await Formula.new({from: owner});
				var contract_balance = total_stake_p1 + total_stake_p2 - unstake_p1_01;
				// Formulas from the nutmeg smart contract
				/////////////////////////////////////////////////////////////////

				var totalPrincipals = contract_balance;

				var urPct =  await math.div((await math.mul(baseAmt, 100)).toString(), totalPrincipals.toString());
				// console.log("urPct: ", urPct)
				urPct = urPct.toString()
				if (urPct > 100){
					urPct = 100;
				}
				urPct = urPct * 100
				if(urPct > 90){
					var crPct = (urPct - 90) * 9 + 10
				} else {
					crPct = Math.floor(urPct/10) + 1
				}
				var maxBorrowAmount =  await math.div((await math.mul(baseAmt, 100)).toString(), crPct.toString());
				maxBorrowAmount = await math.sub(maxBorrowAmount, baseAmt) // Math.floor((baseAmt * 100)/crPct) - baseAmt;
				console.log(" maxBorrowAmount.toString(): ",  maxBorrowAmount.toString())

				//////////////////////////////////////////////////////////////////

		    it('Borrow tests', async () => {
		      assert.deepEqual(
			(await Promise.all([
		          getBalance(token, nutmeg.address),
			  nutmeg.getMaxBorrowAmount(token,baseAmt.toString)
			])).map(r => r.toString()),
			[
		    (total_stake_p1 + total_stake_p2 - unstake_p1_01).toString(),
			  maxBorrowAmount.toString(),
			]
		      );

		      await nutmeg.openPosition(
		        compound_adapter.address,
		        token, ctoken, baseAmt.toString(), borrowAmt.toString(),
		        {from: b1});
					ctoken_mint = ctoken_mint + borrowAmt
		      let pos = await nutmeg.POSITION_COUNTER();
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
			  total_stake_p1 + total_stake_p2 - unstake_p1_01 + baseAmt - borrowAmt,
			  '0',
			  ctoken_mint.toString(),
			  '0',
			  borrowAmt.toString(),
			  '0',
			  '0'
			].map(r => r.toString())
		      );
	      pool = await nutmeg.getPool(token);

				loans_01 = await math.mul(borrowAmt.toString(), principal_01.toString())
				loans_01 = await math.div(loans_01, total_principal.toString())

				loans_02 = await math.mul(borrowAmt.toString(), principal_02.toString())
				loans_02 = await math.div(loans_02, total_principal.toString())

				loans_03 = await math.sub(borrowAmt.toString(), loans_01);
				loans_03 = await math.sub(loans_03, loans_02);
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
				stake_p1_01 + stake_p2_01 - unstake_p1_01,
				stake_p1_02 + stake_p2_02,
				stake_p1_03 + stake_p2_03,
				loans_01,
				loans_02,
				loans_03
			].map(r => r.toString())
		      );
		      assert.deepEqual(
			(await Promise.all([
			  nutmeg.getEarnedInterest(token, p1, 0),
			  nutmeg.getEarnedInterest(token, p1, 1),
			  nutmeg.getEarnedInterest(token, p1, 2)
			])).map(r => r.toString()),
			[
			  '0',
			  '0',
			  '0'
			].map(r => r.toString())
		      );
		      await nutmeg._forceAccrueInterest(token, {from: governor})

		      await nutmeg._forceAccrueInterest(token, {from: governor})

		      await nutmeg.closePosition(
		        pos-1, compound_adapter.address,
		        {from: b1});

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
				stake_p1_01 + stake_p2_01 - unstake_p1_01,
				stake_p1_02 + stake_p2_02,
				stake_p1_03 + stake_p2_03,
			  '0',
			  '0',
			  '0'
			].map(r => r.toString())
		      );
		    });

		    it('Remove some liquidity', async() => {
		      nutmeg.unstake(token, 0, unstake_p1_02.toString(), {from: p1});
		      expectRevert(
		        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
		        'unstk no dpt'
		      );

		      let pool = await nutmeg.getPool(token);
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
				stake_p1_01 + stake_p2_01 - unstake_p1_01 - unstake_p1_02,
				stake_p1_02 + stake_p2_02,
				stake_p1_03 + stake_p2_03,
			  '0',
			  '0',
			  '0'
			].map(r => r.toString())
		      );
		    });

		    /// TODO: Need to test
		    /// Partial redeems
		    /// Adding to positions
		  });
		});
	})(i)
}
/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
