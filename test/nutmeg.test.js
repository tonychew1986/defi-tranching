

const { expectRevert } = require('@openzeppelin/test-helpers');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { assert, expect } = require("chai");
const { toWei, getBalance, log, fromWei, latestBlock } = require('./utils');

const Nut = artifacts.require('Nut');
const NutDistributor = artifacts.require('NutDistributor');
const Nutmeg = artifacts.require("Nutmeg");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const MockERC20 = artifacts.require("MockERC20");
const MockCERC20 = artifacts.require("MockCERC20");

var BN = web3.utils.BN;

contract("Nutmeg integration", addresses => {
  const [deployer, governor, sink, p1, p2, p3 ] = addresses;
  let nut, nutDistributor, nutmeg, cAdapter, mEth, cmEth;
  before(async () => {
    [nut, nutDistributor, nutmeg, cAdapter, mEth, cmEth] = await Deployment(deployer, governor, sink);
  });

  describe("Initialization", async () => {
    it("Initial values should be correct", async () => {
      const maxNumPool = await nutmeg.MAX_NUM_POOL();
      const maxIrPerBlock = await nutmeg.MAX_INTEREST_RATE_PER_BLOCK();
      const minIrPerBlock = await nutmeg.MIN_INTEREST_RATE_PER_BLOCK();
      const nutDistributorAddress = await nutmeg.nutDistributor();
      assert.equal(maxNumPool, 256, 'maximum number of pools not equal');
      assert.equal(maxIrPerBlock, 100000, 'maximum interest rate per block is not 100000');
      assert.equal(minIrPerBlock, 500, 'minimum interest rate per block is not 500');
      assert.equal(nutDistributorAddress, nutDistributor.address, 'nut address is incorrect');
    });
  });

  describe("Treasury pool", async () => {
    it("can't add a treasury pool by non-governor", async () => {
      try {
        await nutmeg.addPool(mEth.address, 500, {from: deployer})
      } catch (err) {
        assert.equal(err.reason, 'bad gov');
      }
    });
    it("can't add a new treasury pool with an invalid interest rate", async () => {
      try {
        await nutmeg.addPool(mEth.address, 499, {from: governor})
      } catch (err) {
        assert.equal(err.reason, 'addPl bad ir');
      }
      try {
        await nutmeg.addPool(mEth.address, 100001, {from: governor})
      } catch (err) {
        assert.equal(err.reason, 'addPl bad ir');
      }
    });
    it("can add a new treasury pool by governor", async () => {
      let pools = await nutmeg.getPools()
      assert.equal(pools.length, 0, 'pools are not empty');
      await nutmeg.addPool(mEth.address, 500, {from: governor})
      pools = await nutmeg.getPools()
      assert.equal(pools.length, 1), 'pool size is not correct';
      const pool = await nutmeg.getPool(pools[0]);
      assert.deepEqual(pool.principals, ['0','0','0']), 'principals are not correct';
      assert.deepEqual(pool.interestRates, ['250','500','1000']), 'interests rates are not correct';
    });
    it("can't add a pool twice", async () => {
      try {
        await nutmeg.addPool(mEth.address, 800, {from: governor})
      } catch (err) {
        assert.equal(err.reason, 'addPl pool exts');
      }
    });
    it("can update interest rates by governor", async () => {
      await nutmeg.updateInterestRates(mEth.address, 501, {from: governor});
      const pool = await nutmeg.getPool(mEth.address);
      assert.deepEqual(pool.interestRates, ['250','501','1002']), 'interests rates are not correct';
    });
  });

  describe("Staking", async () => {
    it("can't stake an invalid tranche", async () => {
      try {
        await nutmeg.stake(mEth.address, 3, toWei(10), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'stk bad trnch');
      }
    });
    it("can't stake an invalid pool", async () => {
      try {
        await nutmeg.stake(p1, 2, toWei(10), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'accrIr no pool');
      }
    });
    it("can't stake an invalid principal", async () => {
      try {
        await nutmeg.stake(mEth.address, 1, toWei(0), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'stk bad prpl');
      }
    });
    it("can stake in tranche A any amount", async () => {
      const prevPool = await nutmeg.getPool(mEth.address);
      const amount = random(100,200);
      await mEth.mint(p1, toWei(amount));
      await mEth.approve(nutmeg.address, toWei(amount), {from: p1});

      const beforeBal = await mEth.balanceOf(p1);

      await nutmeg.stake(mEth.address, 1, toWei(amount), {from: p1});

      const afterBal = await mEth.balanceOf(p1);

      assert.equal(beforeBal-afterBal, toWei(amount).toString());

      const currPool = await nutmeg.getPool(mEth.address);
      const currBlockNumber = await latestBlock();
      assert.equal(currPool.irAdjustPct, 90 );
      assert.equal(currPool.isIrAdjustPctNegative, true );
      assert.equal(currPool.latestAccruedBlock, currBlockNumber.toString() );
      assert.deepEqual(currPool.principals, [prevPool.principals[0], toWei(fromWei(prevPool.principals[1]) + amount), prevPool.principals[2]])

      const deposits = await nutmeg.getStake(mEth.address, p1);
      assert.equal(deposits[1].owner, p1);
      assert.equal(deposits[1].pool, mEth.address);
      assert.equal(deposits[1].tranche, 1);
      assert.equal(deposits[1].principal, toWei(amount));
    });
    it("can stake in tranche AA any amount", async () => {
      const pool0 = await nutmeg.getPool(mEth.address);
      const amount = random(100,200);
      await mEth.mint(p1, toWei(amount));
      await mEth.approve(nutmeg.address, toWei(amount), {from: p1});
      await nutmeg.stake(mEth.address, 0, toWei(amount), {from: p1});

      const pool1 = await nutmeg.getPool(mEth.address);
      const currBlockNumber = await latestBlock();
      assert.equal(pool1.irAdjustPct, 90 );
      assert.equal(pool1.isIrAdjustPctNegative, true );
      assert.equal(pool1.latestAccruedBlock, currBlockNumber.toString() );
      assert.deepEqual(pool1.principals, [toWei(fromWei(pool0.principals[0]) + amount), pool0.principals[1], pool0.principals[2]])

      const deposits = await nutmeg.getStake(mEth.address, p1);
      assert.equal(deposits[0].owner, p1);
      assert.equal(deposits[0].pool, mEth.address);
      assert.equal(deposits[0].tranche, 0);
      assert.equal(deposits[0].principal, toWei(amount));
    });
    it("can stake in tranche A or tranche AA by anyone with any amount", async () => {
      for ( const p of [p1, p2]) {
        for (const t of [0, 1]) {
          const prevPool = await nutmeg.getPool(mEth.address);
          const prevDeposits = await nutmeg.getStake(mEth.address, p);
          const amount = random(100,155);
          await mEth.mint(p, toWei(amount));
          await mEth.approve(nutmeg.address, toWei(amount), {from: p});

          let epochId;
          let prevTotalVtbArray = new Array(15);
          let prevVtbArray = new Array(15);
          for (epochId = 0; epochId < 15; epochId++ ) {
            prevTotalVtbArray[epochId] = await nutDistributor.getTotalVtb(mEth.address,epochId);
            prevVtbArray[epochId] = await nutDistributor.getVtb(mEth.address, p, epochId);
          }

          const beforeBal = await mEth.balanceOf(p);

          await nutmeg.stake(mEth.address, t, toWei(amount), {from: p});

          const afterBal = await mEth.balanceOf(p);
          // console.log('beforeBal:', beforeBal.toString());
          // console.log('amount:   ', toWei(amount).toString());
          // console.log('afterBal: ', afterBal.toString(), '\n');
          assert.equal(beforeBal-afterBal, toWei(amount).toString());

          const currPool = await nutmeg.getPool(mEth.address);
          const currBlockNumber = await latestBlock();
          const newTranchePrincipal = toBN(prevPool.principals[t]).add(toBN(toWei(amount)));
          assert.equal(currPool.principals[t], newTranchePrincipal.toString());
          assert.equal(currPool.latestAccruedBlock, currBlockNumber.toString() );

          // verify deposit changes
          const currDeposits = await nutmeg.getStake(mEth.address, p);
          const newDepositPrincipal = toBN(prevDeposits[t].principal).add(toBN(toWei(amount)));
          assert.equal(currDeposits[t].principal, newDepositPrincipal);

          // verify vtb changes
          for (epochId = 0; epochId < 15; epochId++ ) {
            const currTotalVtb = await nutDistributor.getTotalVtb(mEth.address,epochId);
            const currVtb = await nutDistributor.getVtb(mEth.address, p, epochId);
            const echo = await nutDistributor.echoMap(epochId);
            const currBlock = await latestBlock();
            let blocks = await nutDistributor.BLOCKS_PER_EPOCH();
            if (epochId == 0) {
              blocks = echo.endBlock.sub(currBlock);
            }
            const expectedVtb = blocks.mul(toBN(toWei(amount))).add(prevVtbArray[epochId]);
            const expectedTotalVtb = blocks.mul(toBN(toWei(amount))).add(prevTotalVtbArray[epochId]);
            assert.equal(currVtb.toString(), expectedVtb.toString());
            assert.equal(currTotalVtb.toString(), expectedTotalVtb.toString());
          }

        }
      }
    });

    it("can't stake in tranche BBB an amount larger than tranche AA", async () => {
      const pools = await nutmeg.getPool(mEth.address);
      const AAprincipal = fromWei(pools.principals[0]);
      const amount = AAprincipal + 10;
      await mEth.mint(p2, toWei(amount));
      await mEth.approve(nutmeg.address, toWei(amount), {from: p2});
      try {
        await nutmeg.stake(mEth.address, 2, toWei(amount), {from: p2});
      } catch (err) {
        assert.equal(err.reason, 'stk BBB full');
      }
    });

  });

  describe("Unstaking", async () => {
    it("can't withdraw empty deposit", async () => {
      const currDeposits = await nutmeg.getStake(mEth.address, p1);
      const principal = fromWei(toBN(currDeposits[0]));
      const amount = random(principal/2, principal);
      try {
        await nutmeg.unstake(mEth.address, 2, toWei(amount), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'unstk no dpt');
      }
      try {
        await nutmeg.unstake(mEth.address, 0, toWei(0), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'unstk bad amt');
      }
    });
    it("can't withdraw with invalid amount", async () => {
      const currDeposits = await nutmeg.getStake(mEth.address, p1);
      const principal = fromWei(toBN(currDeposits[0]));
      const amount = parseFloat(principal) + 0.1;
      try {
        await nutmeg.unstake(mEth.address, 0, 0, {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'unstk bad amt');
      }
      try {
        await nutmeg.unstake(mEth.address, 0, toWei(amount), {from: p1});
      } catch (err) {
        assert.equal(err.reason, 'unstk bad amt');
      }
    });
    it("can withdraw partially with an amount", async () => {

      for ( const tranche of [0, 1, 2]) {

        const prevDeposits = await nutmeg.getStake(mEth.address, p1);
        let epochId;
        let prevTotalVtbArray = new Array(15);
        let prevVtbArray = new Array(15);
        for (epochId = 0; epochId < 15; epochId++ ) {
          prevTotalVtbArray[epochId] = await nutDistributor.getTotalVtb(mEth.address,epochId);
          prevVtbArray[epochId] = await nutDistributor.getVtb(mEth.address, p1, epochId);
        }

        const principal = prevDeposits[tranche].principal;
        if (principal.toString() === "0" ) continue;
        const amount = randomBN(0, principal);
        const prevPool = await nutmeg.getPool(mEth.address);
        const beforeBal = toBN(await mEth.balanceOf(p1));

        await nutmeg.unstake(mEth.address, tranche, amount, {from: p1});

        const afterBal = toBN(await mEth.balanceOf(p1));
        assert.equal(afterBal.sub(beforeBal).toString(), amount.toString());

        // verify deposit
        const currDeposits = await nutmeg.getStake(mEth.address, p1);
        const newDepositPrincipal = toBN(prevDeposits[tranche].principal).sub(amount);
        assert.equal(currDeposits[tranche].principal, newDepositPrincipal);

        // verify pool
        const currPool = await nutmeg.getPool(mEth.address);
        let expectedPrincipals = new Array(3);
        prevPool.principals.map(
          (p, idx) => {
            if (idx == tranche) {
              const val = toBN(prevPool.principals[tranche]).sub(amount);
              expectedPrincipals[idx] = val.toString();
            } else {
              expectedPrincipals[idx] = p;
            }
          }
        );
        const currBlockNumber = await latestBlock();
        assert.equal(currPool.irAdjustPct, 90 );
        assert.equal(currPool.isIrAdjustPctNegative, true );
        assert.equal(currPool.latestAccruedBlock, currBlockNumber.toString() );
        assert.deepEqual(currPool.principals, expectedPrincipals);


        // verify vtb changes
        for (epochId = 0; epochId < 15; epochId++ ) {
          const currTotalVtb = await nutDistributor.getTotalVtb(mEth.address,epochId);
          const currVtb = await nutDistributor.getVtb(mEth.address, p1, epochId);
          const echo = await nutDistributor.echoMap(epochId);
          const currBlock = await latestBlock();
          let blocks = await nutDistributor.BLOCKS_PER_EPOCH();
          if (epochId == 0) {
            blocks = echo.endBlock.sub(currBlock);
          }
          // console.log('epochId:', epochId, 'tranche:', tranche)
          // console.log('prevVtb:', prevVtbArray[epochId].toString());
          // console.log('amount: ', amount);
          // console.log('blocks:', blocks.toString());
          const expectedVtb = prevVtbArray[epochId].sub(blocks.mul(amount));
          const expectedTotalVtb = prevTotalVtbArray[epochId].sub(blocks.mul(amount));
          const xxx = (prevVtbArray[epochId].sub(currVtb)).div(amount);
          // console.log('currVtb:', currVtb.toString());
          // console.log('exptVtb:', expectedVtb.toString() );
          // console.log('xxxx:', xxx.toString(), '\n');
          assert.equal(currVtb.toString(), expectedVtb.toString(), 'failed at epoch '+epochId);
          assert.equal(currTotalVtb.toString(), expectedTotalVtb.toString(), 'failed at epoch ' + epochId);
        }
      }
    });
    it("can withdraw all principals", async () => {

      for ( const p of [p1, p2]) {

        for ( const tranche of [0, 1, 2]) {

          const prevDeposits = await nutmeg.getStake(mEth.address, p);
          let epochId;
          let prevTotalVtbArray = new Array(15);
          let prevVtbArray = new Array(15);
          for (epochId = 0; epochId < 15; epochId++ ) {
            prevTotalVtbArray[epochId] = await nutDistributor.getTotalVtb(mEth.address,epochId);
            prevVtbArray[epochId] = await nutDistributor.getVtb(mEth.address, p, epochId);
          }

          // const principal = fromWei(toBN(prevDeposits[tranche]));
          const principal = fromWei(prevDeposits[tranche].principal);
          if (principal.toString() === "0" ) continue;
          const amount = principal;
          const prevPool = await nutmeg.getPool(mEth.address);

          const beforeBal = await mEth.balanceOf(p);

          await nutmeg.unstake(mEth.address, tranche, toWei(amount), {from: p});

          // verify balance
          const afterBal = await mEth.balanceOf(p);
          // console.log('beforeBal:', beforeBal.toString());
          // console.log('amount:   ', toWei(amount).toString());
          // console.log('afterBal: ', afterBal.toString(), '\n');
          assert.equal((afterBal.sub(beforeBal)).toString(), toWei(amount).toString());

          // verify deposit
          const currDeposits = await nutmeg.getStake(mEth.address, p);
          const newDepositPrincipal = toBN(prevDeposits[tranche].principal).sub(toBN(toWei(amount)));
          assert.equal(currDeposits[tranche].principal, newDepositPrincipal);
          assert.equal(currDeposits[tranche].status, 2);

          // verify pool
          const currPool = await nutmeg.getPool(mEth.address);
          let expectedPrincipals = new Array(3);
          prevPool.principals.map(
            (p, idx) => {
              if (idx == tranche) {
                const val = toBN(prevPool.principals[tranche]).sub(toBN(toWei(amount)));
                expectedPrincipals[idx] = val.toString();
              } else {
                expectedPrincipals[idx] = p;
              }
            }
          );
          const currBlockNumber = await latestBlock();
          assert.equal(currPool.irAdjustPct, 90 );
          assert.equal(currPool.isIrAdjustPctNegative, true );
          assert.equal(currPool.latestAccruedBlock, currBlockNumber.toString() );
          assert.deepEqual(currPool.principals, expectedPrincipals);


          // verify vtb changes
          for (epochId = 0; epochId < 15; epochId++ ) {
            const currTotalVtb = await nutDistributor.getTotalVtb(mEth.address,epochId);
            const currVtb = await nutDistributor.getVtb(mEth.address, p, epochId);
            const echo = await nutDistributor.echoMap(epochId);
            const currBlock = await latestBlock();
            let blocks = await nutDistributor.BLOCKS_PER_EPOCH();
            if (epochId == 0) {
              blocks = echo.endBlock.sub(currBlock);
            }
            const expectedVtb = prevVtbArray[epochId].sub(blocks.mul(toBN(toWei(amount))));
            const expectedTotalVtb = prevTotalVtbArray[epochId].sub(blocks.mul(toBN(toWei(amount))));
            assert.equal(currVtb.toString(), expectedVtb.toString(), 'failed at epoch '+epochId);
            assert.equal(currTotalVtb.toString(), expectedTotalVtb.toString(), 'failed at epoch ' + epochId);
          }
        }
      }


    });
    it("should be empty pool now", async () => {
      const pool = await nutmeg.getPool(mEth.address);
      assert.deepEqual(pool.principals, ['0', '0', '0']);
    });
    it("check the nut distribution map", async () => {
      let epochId;
      for (epochId = 0; epochId < 15; epochId++ ) {

        const totalVtb = await nutDistributor.getTotalVtb(mEth.address, epochId);
        const vtb1 = await nutDistributor.getVtb(mEth.address, p1, epochId);
        const vtb2 = await nutDistributor.getVtb(mEth.address, p2, epochId);
        assert.equal(totalVtb.toString(), (vtb1.add(vtb2)).toString() )
        if (epochId > 0) {
          assert.equal(totalVtb.toString(), '0')
          assert.equal(vtb1.toString(), '0')
          assert.equal(vtb2.toString(), '0')
        }
      }
    });
  });



});

async function Deployment(deployer, governor, sink) {
  // deploy mock base token and its collateral token
  const mEth = await MockERC20.new( "Mock ETH", "METH", 18, {from: deployer});
  const cmEth = await MockCERC20.new(mEth.address, {from: deployer});

  const nut = await Nut.new("Nutmeg token", "NUT", sink, {from: deployer});
  await nut.setPendingGovernor(governor, {from: deployer});
  await nut.acceptGovernor({from: governor});

  const nutDistributor = await NutDistributor.new(nut.address, {from: deployer});
  await nutDistributor.initialize(nut.address, deployer);
  await nutDistributor.setPendingGovernor(governor, {from: deployer});
  await nutDistributor.acceptGovernor({from: governor});

  const nutmeg = await Nutmeg.new({from: deployer});
    await nutmeg.initialize(deployer, {from: deployer});
  await nutmeg.setPendingGovernor(governor, {from: deployer});
  await nutmeg.acceptGovernor({from: governor});
  await nutmeg.setNut(nut.address, {from: governor});
  await nutmeg.setNutDistributor(nutDistributor.address, {from: governor});
  await nut.setNutDistributor(nutDistributor.address, {from: governor});
  await nutDistributor.setNutmegAddress(nutmeg.address, {from: governor});

  const cAdapter = await CompoundAdapter.new(nutmeg.address);
  await cAdapter.setPendingGovernor(governor, {from: deployer});
  await cAdapter.acceptGovernor({from: governor});

  return [nut, nutDistributor, nutmeg, cAdapter, mEth, cmEth];
};

function random(min, max) {
  // return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toPrecision(8);
  return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toPrecision(10);
}

function randomWei(min, max) {
  const amount =  Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min);
  return toWei(amount);
}

function randomBN(min, max) {
    return toBN(toBN(min) + (toBN(max) - toBN(min)) * Math.random());
}

// async function latestBlock() {
//   const block = await web3.eth.getBlock("latest");
//   return new web3.utils.BN(block.number);
// }

function toBN(value) {
  return new BN(value);
}
