// SPDX-License-Identifier: MIT
// utils-erc20.js - shared functions

const { DUMMY_ADDRESS } = require('./utils');
const IERC20 = artifacts.require('@openzeppelin/contracts/token/ERC20/IERC20.sol');

const BN = require('bn.js');

const IWETH = artifacts.require("IWETH");
const IUNISWAP = artifacts.require("IUNISWAP");

async function toWETH(address, amount) {
  const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  weth_contract = await IWETH.at(WETH);
  await weth_contract.deposit({from: address, value: amount});
};

async function toDAI(address, amount) {
  const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const UNISWAP = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  dai_contract = await IERC20.at(DAI);
  uniswap_contract = await IUNISWAP.at(UNISWAP);
  await weth_contract.approve(uniswap, amount, {from: address});
  path = []
  path.push(WETH);
  path.push(DAI);
  await uniswap_contract.swapExactETHForTokens(0, path, address, 999999999999999, {from: address, value: amount});
};

async function toERC20(address, amount, erc20) {
  const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const UNISWAP = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  erc20_contract = await IERC20.at(erc20);
  uniswap_contract = await IUNISWAP.at(UNISWAP);
  await weth_contract.approve(uniswap, amount, {from: address});
  path = []
  path.push(WETH);
  path.push(erc20);
  await uniswap_contract.swapExactETHForTokens(0, path, address, 999999999999999, {from: address, value: amount});
};

exports.toWETH = toWETH;
exports.toDAI = toDAI;
