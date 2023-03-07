// SPDX-License-Identifier: MIT
// test scenario for staking and unstaking

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { promisify } = require("util");
const { toWei, getBalance,  nutmeg_factory, mint_test_tokens,
	stake: stake, log, report, fromWei } = require('./utils');

/// A run through for a borrow/staking scenario
contract("Borrow requires NUT", addresses => {
  const [owner, governor, p1, p2, p3, b1, b2, blackhat, _] = addresses;
  let nutmeg, token, pos;
  before(async () => {
      [nutmeg, token_contract, ctoken_contract, compound_adapter] =
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
          await nutmeg.setNut(
              token, {from: governor}
          );
          await nutmeg.setMinNut4Borrowers(
              token,
              compound_adapter.address,
              toWei(500),
              {from: governor}
          );
      }, "set limit to 500 mock tokens");

      await log(async () => {
          expectRevert.unspecified(
	      nutmeg.openPosition(
                  compound_adapter.address,
                  token, ctoken, toWei(10), toWei(100),
                  {from: p3}
	      )
          );
      }, 'p3 borrows 100 ETH with 10 ETH collateral - fail');
      await log(async () => {
          await nutmeg.setMinNut4Borrowers(
              token,
              compound_adapter.address,
              toWei(5),
              {from: governor}
          );
      }, "set nut to 5 mock tokens");
      await log(async () => {
	  await nutmeg.openPosition(
              compound_adapter.address,
              token, ctoken, toWei(10), toWei(100),
              {from: p3}
          );
      }, 'p3 borrows 100 ETH with 10 ETH collateral - success');

  });
});

/* Local Variables:   */
/* mode: javascript   */
/* js-indent-level: 2 */
/* End:               */
