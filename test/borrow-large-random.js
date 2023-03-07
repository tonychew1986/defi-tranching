// SPDX-License-Identifier: MIT
// borrow.js - Basic borrow workflow
const Formula = artifacts.require("Formula");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance, nutmeg_factory, mint_test_tokens,
	BAD_TOKEN, stake: stake } = require('./utils');
const BigNumber = require('bignumber.js')
function random(min, max) {
  return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toPrecision(1);
}

const SAMPLE_SIZE = 5
for (var i = 0; i < SAMPLE_SIZE; i++){
	 (function(i){
			console.log("Sample ", i+1 , " :")
			let initial_balance = 100000000000000000000

			let stake_p1_01 = parseInt(new BigNumber(random(4000000000000000000,10000000000000000000)))//4000000000000000000
			let stake_p1_02 = parseInt(new BigNumber(random(1,2000000000000000000))) //2000000000000000000
			let stake_p1_03 = parseInt(new BigNumber(random(1,2000000000000000000)))// 1000000000000000000
			let stake_p1_03_2 = 4000000000000000000

			let stake_p2_01 = parseInt(new BigNumber(random(1,2000000000000000000)))//1000000000000000000
			let stake_p2_02 = parseInt(new BigNumber(random(2000000000000000000,10000000000000000000)))//2000000000000000000
			let stake_p2_03 = parseInt(new BigNumber(random(1,1900000000000000000)))//3000000000000000000

			let mint_p3 =     "100000000000000000000000000000"
			let stake_p3_01 = "1000000000000000000000000000"

			let total_stake_p1 = stake_p1_01 + stake_p1_02 + stake_p1_03
			let total_stake_p2 = stake_p2_01 + stake_p2_02 + stake_p2_03
			let unstake_p1_01 = 1000000000000000000//parseInt(new BigNumber(random(1,stake_p1_01 - 1)))//1000000000000000000 // (between 1 and stake_p1_01 + stake_p1_02 + stake_p1_03)
			let ctoken_mint = 1000000000000000000

			let unstake_p1_02 = parseInt(new BigNumber(random(1, stake_p1_02)))//2000000000000000000
			let unstake_blackhat_02 = parseInt(new BigNumber(random(1, 2000000000000000000))) //1000000000000000000
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

			let principal_02
			let principal_03

			let sum2
			let sum1
/// A run through for a borrow/staking scenario
			contract("Borrow large random", addresses => {
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
			  describe("Borrow large random", async () => {
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
							  initial_balance - total_stake_p1,
							  initial_balance -  total_stake_p2
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
							  stake_p1_01 + stake_p2_01,
							  stake_p1_02 + stake_p2_02,
							  stake_p1_03 + stake_p2_03,
							  '0',
							  '0',
							  '0'
							].map(r => r.toString())
					   );
			    });


					it("staker stake large amount", async() => {
						await token_contract.mint(p3, mint_p3);
						await token_contract.approve(nutmeg.address, mint_p3,
				                                   {from: p3});
			      await Promise.all([
			        stake(nutmeg, token, 0, stake_p3_01.toString(), p3)
			      ]);
			      await Promise.all([
			        stake(nutmeg, token, 2, stake_p1_03_2.toString(), p1)
			      ]);
						const math = await Formula.new({from: owner});
						console.log("parseInt(mint_p3) + initial_balance - parseInt(stake_p3_01): ", (await math.sub(await math.add(mint_p3, initial_balance.toString()), stake_p3_01)).toString())
						 assert.equal(
			         (await getBalance(token, p3)).toString(),
			         (await math.sub(await math.add(mint_p3, initial_balance.toString()), stake_p3_01)).toString()// '99000000100000000000000000000'
			       );
						var sum0 = await math.add(total_stake_p1.toString(), total_stake_p2.toString())

						var sum3 = await math.add(sum0, stake_p3_01)

						var sum4 = await math.add(sum3, stake_p1_03_2.toString())

						sum2 = await math.add(stake_p1_01.toString(), stake_p2_01.toString())
						sum1 = await math.add(sum2, stake_p3_01.toString())

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
							  sum4,
							  sum1,
								stake_p1_02 + stake_p2_02,
							  stake_p1_03 + stake_p2_03 + stake_p1_03_2,
							  '0',
							  '0',
							  '0'
							].map(r => r.toString())
					   );
			    });

			    it('Remove some liquidity', async() => {
						const math = await Formula.new({from: owner});
			      nutmeg.unstake(token, 0, unstake_p1_01.toString(), {from: p1});
			      expectRevert(
			        nutmeg.unstake(token, 0, toWei(1), {from: blackhat}),
			        'unstk no dpt'
			      );
						var sum0 = await math.add(total_stake_p1.toString(), total_stake_p2.toString())

						var sum3 = await math.add(sum0, stake_p3_01)
						var sum4 = await math.add(sum3, stake_p1_03_2.toString())
			      assert.equal(
			        (await getBalance(token, nutmeg.address)).toString(),
			         (await math.sub(sum4, unstake_p1_01.toString())).toString()//'1000000013000000000000000000'
			      );

						sum2 = await math.add(stake_p1_01.toString(), stake_p2_01.toString())
						sum1 = await math.add(sum2, stake_p3_01.toString())
						sum1 = await math.sub(sum1, unstake_p1_01.toString())

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
						  sum1,
							stake_p1_02 + stake_p2_02,
							stake_p1_03 + stake_p2_03 + stake_p1_03_2,
						  '0',
						  '0',
						  '0'
						].map(r => r.toString())
			      );
			    });

			    it('Borrow tests', async () => {
						const math = await Formula.new({from: owner});
						var sum0 = await math.add(total_stake_p1.toString(), total_stake_p2.toString())

						var sum3 = await math.add(sum0, stake_p3_01)

						var sum4 = await math.add(sum3, stake_p1_03_2.toString())

						sum4 = await math.sub(sum4, unstake_p1_01.toString())

						/////////////////////////////////////////////////////////////////
						let baseAmt = toWei(0.1);
						var totalPrincipals = sum4;

						var urPct =  await math.div((await math.mul(baseAmt, 100)).toString(), totalPrincipals.toString());

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

			      assert.deepEqual(
				(await Promise.all([
			    getBalance(token, nutmeg.address),
				  nutmeg.getMaxBorrowAmount(token, toWei(0.1))
				])).map(r => r.toString()),
				[
			    sum4.toString(),
				  maxBorrowAmount.toString()
				]
			      );

					baseAmt =   100000000000000000
					borrowAmt = 500000000000000000
					sum4 = await math.sub(sum4, borrowAmt.toString())
					sum4 = await math.add(sum4, baseAmt.toString())

		      await nutmeg.openPosition(
		        compound_adapter.address,
		        token, ctoken, baseAmt.toString(), borrowAmt.toString(),
		        {from: b1});
		      let pos = await nutmeg.POSITION_COUNTER();

					ctoken_mint = ctoken_mint + borrowAmt

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
						  sum4,
						  '0',
						  borrowAmt.toString(),
						  '0',
						  borrowAmt.toString(),
						  '0',
						  '0'
						].map(r => r.toString())
			     );
			      pool = await nutmeg.getPool(token);

				sum2 = await math.add(stake_p1_01.toString(), stake_p2_01.toString())
				sum1 = await math.add(sum2, stake_p3_01.toString())
				sum1 = await math.sub(sum1, unstake_p1_01.toString())
//
				// let principal_01 = stake_p1_01 + stake_p2_01 - unstake_p1_01
			  principal_02 = stake_p1_02 + stake_p2_02
			  principal_03 = stake_p1_03 + stake_p2_03 + stake_p1_03_2

				total_principal = await math.add(sum1, principal_02.toString())
				total_principal = await math.add(total_principal, principal_03.toString())
	      pool = await nutmeg.getPool(token);

				loans_01 = await math.mul(borrowAmt.toString(), sum1.toString())
				loans_01 = await math.div(loans_01, total_principal.toString())

				loans_02 = await math.mul(borrowAmt.toString(), principal_02.toString())
				loans_02 = await math.div(loans_02, total_principal.toString())

				loans_03 = await math.mul(borrowAmt.toString(), principal_03.toString());
				loans_03 = await math.div(loans_03, total_principal.toString());

	      assert.deepEqual(
				(await Promise.all([
				  pool.principals[0].toString(),
				  pool.principals[1].toString(),
				  pool.principals[2].toString(),
				  pool.loans[0].toString(),
				  pool.loans[1].toString(),
				  parseInt(pool.loans[2]/100)
				])).map(r => r.toString()),
				[
				  sum1,
				  principal_02,
				  principal_03,
				  loans_01,
				  loans_02,
				  parseInt(loans_03/100),
				].map(r => r.toString())
			      );

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
				  sum1,
					principal_02,
				  principal_03,
				  '0',
				  '0',
				  '0'
				].map(r => r.toString())
			      );
			    });
			    it('Liquidate', async() => {
			      let pos = await nutmeg.POSITION_COUNTER();
			      await expectRevert(
			        nutmeg.liquidatePosition(
			          pos-1, compound_adapter.address,
			          {from: b1}),
				'only open pos'
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
					sum1,
				  principal_02,
				  principal_03,
				  '0',
				  '0',
				  '0'
				].map(r => r.toString())
			      );

			      await nutmeg.openPosition(
			        compound_adapter.address,
			        token, ctoken, toWei(0.1), toWei(0.5),
			        {from: b1});

			      pos = await nutmeg.POSITION_COUNTER();
			      await expectRevert(
			        nutmeg.liquidatePosition(
			          pos-1, compound_adapter.address,
			          {from: b1}),
				'liquidate: position is not ready for liquidation yet.'
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
		})(i)
	}
/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
