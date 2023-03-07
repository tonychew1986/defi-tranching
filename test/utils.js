// SPDX-License-Identifier: MIT
// utils.js - shared functions
const IERC20 = artifacts.require('@openzeppelin/contracts/token/ERC20/IERC20.sol');
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000001';
const BAD_TOKEN = '0x4200000000000000000000000000000000000042';
const BN = require('bn.js');
const { promisify } = require("util");
const { report } = require('./test-report');

async function getBalance(token, address, unit) {
  t = token == DUMMY_ADDRESS ?
    web3.eth.getBalance(address) :
    (await IERC20.at(token)).balanceOf(address);
  return unit != undefined ? t.then(r => fromWei(r, unit)) : t;
}

function toWei(value) {
  return web3.utils.toWei(value.toString(), "ether");
}

function fromWei(value) {
  return web3.utils.fromWei(value.toString(), "ether");
}

async function stake(nutmeg, token, i, value, p) {
  if (token == DUMMY_ADDRESS) {
    return nutmeg.stake(token, i, 0, {
      from: p, value: value
    });
  } else {
    return nutmeg.stake(token, i, value, {
      from: p
    });
  }
}

async function log(f, message) {
    await f();
    console.log(message);
}

async function report_pools(
    nutmeg, token, compare
) {
    let pool = await nutmeg.getPool(token);
    report (()=> [
	fromWei(pool.principals[0]),
	fromWei(pool.principals[1]),
	fromWei(pool.principals[2]),
	fromWei(pool.loans[0]),
	fromWei(pool.loans[1]),
	fromWei(pool.loans[2]),
	fromWei(pool.interests[0]),
	fromWei(pool.interests[1]),
	fromWei(pool.interests[2]),
        pool.interestRates[0],
        pool.interestRates[1],
        pool.interestRates[2],
        pool.totalCollateral,
        pool.irAdjustPct,
        pool.isIrAdjustPctNegative
    ],
	    [
		'principal - AAA :',
		'principal - A   :',
		'principal - BBB :',
		'loans - AAA     :',
		'loans - A       :',
		'loans - BBB     :',
		'interests - AAA     :',
		'interests - A       :',
		'interests - BBB    :',
		'interest rates - AAA     :',
		'interest rates - A       :',
		'interest rates - BBB     :',
                'total collateral         :',
                'irAdjustPct              :',
                'isIrAdjustPctNegative    :'
	    ],
	    compare
	   );
}

async function report_multipliers(
    nutmeg, token, compare
) {
    let pool = await nutmeg.getPool(token);
    report (()=> [
	fromWei(pool.lossMultiplier[0]),
	fromWei(pool.lossMultiplier[1]),
	fromWei(pool.lossMultiplier[2])
    ],
	    [
		'loss multiplier[0] :',
		'loss multiplier[1] :',
		'loss multiplier[2] :'
	    ],
	    compare
	   );
}

async function report_balances(
    token, token_name, address_list, address_names, compare
) {
    await report(
	() => address_list.map(r => getBalance(token, r, "ether")),
	address_names.map (r => token_name + "@" + r),
	compare
    );
};

async function report_vtb(
    nd, token, owner
) {
    const nepochs = (await nd.NUM_EPOCH()).toNumber();
    await report(
        () => {
            return Array(nepochs).fill().map((e, i)=> nd.vtbMap(token, owner, i));
        },
        Array(nepochs).fill().map((e, i)=> "vtb[" + i.toString() + "]")
    );
}
//       Array(nepochs).fill().map((e, i) => "vtb[" + i.toString() + "]: ")
const TestNutmeg = artifacts.require("TestNutmeg");
const MockERC20 = artifacts.require("MockERC20");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const MockCERC20 = artifacts.require("MockCERC20");
const Nut = artifacts.require('Nut');
const PriceOracle = artifacts.require('PriceOracle');
const TestNutDistributor = artifacts.require('TestNutDistributor');

async function nutmeg_factory(owner, governor, p1, p2, p3, b1, b2) {
    const nut_contract = await Nut.new("Nut token", "NUT", owner, {from: owner});
    const nut_distributor_contract = await TestNutDistributor.new({from: owner});
    await nut_distributor_contract.initialize(
        nut_contract.address, owner, 100
    );
    const nutmeg = await TestNutmeg.new({from: owner});
    const oracle_contract = await PriceOracle.new({from: owner});
    await nutmeg.initialize(owner);
    await nut_contract.setNutDistributor(
        nut_distributor_contract.address, {from: owner}
    );
    await nutmeg.setNutDistributor(
        nut_distributor_contract.address, {from: owner}
    );
    await nutmeg.setNut(
        nut_contract.address, {from: owner}
    );
    await nut_distributor_contract.setNutmegAddress(nutmeg.address, {from: owner});
    await nut_distributor_contract.setPriceOracle(
        oracle_contract.address, {from: owner}
    );
    await nutmeg.setPendingGovernor(governor, {from: owner});
    await nutmeg.acceptGovernor({from: governor});
    await nut_distributor_contract.setPendingGovernor(governor, {from: owner});
    await nut_distributor_contract.acceptGovernor({from: governor});

    const token_contract = await MockERC20.new(
      "Mock Erc20", "MOCKERC20", 18, {from: owner}
    );
    token = token_contract.address;
    const ctoken_contract = await MockCERC20.new(token, {from: owner});
    ctoken = ctoken_contract.address;
    compound_adapter = await CompoundAdapter.new(nutmeg.address);
    await compound_adapter.setPendingGovernor(governor, {from: owner});
    await compound_adapter.acceptGovernor({from: governor});
    await nutmeg.addPool(token, 1000, {from: governor});
    await nutmeg.addAdapter(compound_adapter.address, {from: governor});
    await compound_adapter.addTokenPair(token, ctoken, {from: governor});
    return [nutmeg, token_contract, ctoken_contract,
            compound_adapter, nut_distributor_contract,
            nut_contract, oracle_contract];
};

async function add_new_token(nutmeg, adapter, deployer,
                             governor,
                             name, symbol, decimals)
{
    const token_contract = await MockERC20.new(
        "Mock Erc20", "MOCKERC20", 18, {from: deployer}
    );
    const ctoken_contract = await MockCERC20.new(
        token_contract.address, {from: deployer}
    );
    await nutmeg.addPool(
        token_contract.address, 1000, {from: governor}
    );
    await adapter.addTokenPair(
        token_contract.address,
        ctoken_contract.address, {from: governor}
    );
    return [token_contract, ctoken_contract];
}

// function deprecated - use mint mock tokens
async function mint_test_tokens(
    nutmeg, token, ctoken, p1, p2, p3, b1, b2
) {
    console.log('mint_test_tokens deprecated - use mint_mock_tokens');
    await mint_mock_tokens(
        nutmeg, token, '100', [p1, p2, p3, b1, b2]
    );
}

async function mint_mock_tokens(
    nutmeg, token, amount, account_list
) {
    await Promise.all(account_list.map(
        r => {token.mint(r, toWei(amount))}
    ));
    await Promise.all(account_list.map(
        r => {token.approve(
            nutmeg.address,
            toWei(amount),
            {from: r}
        )}
    ));
}


async function latestBlock() {
  const block = await web3.eth.getBlock("latest");
  return new web3.utils.BN(block.number);
}

function advanceBlock() {
  return promisify(web3.currentProvider.send.bind(web3.currentProvider))({
    jsonrpc: "2.0",
    method: "evm_mine",
    id: new Date().getTime()
  });
}

async function advanceBlockTo(target) {
  if (!web3.utils.BN.isBN(target)) {
    target = new BN(target);
  }

  const currentBlock = await latestBlock();
  const start = Date.now();
  let notified;
  if (target.lt(currentBlock))
    throw Error(
      `Target block #(${target}) is lower than current block #(${currentBlock})`
    );
  while ((await latestBlock()).lt(target)) {
    if (!notified && Date.now() - start >= 5000) {
      notified = true;
      console.log(
        `\
 WARN: advanceBlockTo: Advancing too ` +
        "many blocks is causing this test to be slow."
      );
    }
    await advanceBlock();
  }
}

const advanceBlockBy = async n => {
    const sendAsync = promisify(web3.currentProvider.send);
    const currentBlock = await latestBlock();
    await Promise.all(
	[...Array(n).keys()].map(i =>
	    sendAsync({
		jsonrpc: '2.0',
		method: 'evm_mine',
		id: i + currentBlock
	    })
	)
    );
};

exports.toWei = toWei;
exports.fromWei = fromWei;
exports.getBalance = getBalance;
exports.DUMMY_ADDRESS = DUMMY_ADDRESS;
exports.stake = stake;
exports.BAD_TOKEN = BAD_TOKEN;
exports.log = log;
exports.report = report;
exports.nutmeg_factory = nutmeg_factory;
exports.mint_test_tokens = mint_test_tokens;
exports.report_pools = report_pools;
exports.report_balances = report_balances;
exports.report_multipliers = report_multipliers;
exports.report_vtb = report_vtb;
exports.latestBlock = latestBlock;
exports.advanceBlockTo = advanceBlockTo;
exports.advanceBlockBy = advanceBlockBy;
exports.advanceBlock = advanceBlock;
exports.add_new_token = add_new_token;
exports.mint_mock_tokens = mint_mock_tokens;

