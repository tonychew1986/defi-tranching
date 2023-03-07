'use strict';

const { admin } = require('@openzeppelin/truffle-upgrades');
const { get_accounts } = require('./accounts');
const Nutmeg = artifacts.require("Nutmeg");
const NutDistributor = artifacts.require('NutDistributor');
const TestNutDistributor = artifacts.require('TestNutDistributor');

module.exports = async function (deployer, network, accounts) {
    const [ sinkAddr, deployAddr, govAddr, proxyAdminAddr ] = get_accounts(
        deployer, network, accounts
    );
  // Don't change ProxyAdmin ownership for our test network
    if (proxyAdminAddr !== undefined) {
        const nutmeg = await Nutmeg.deployed();
        console.log('Nutmeg: ', nutmeg.address);
        const nut_distributor =
              (network == 'ropsten' || network == 'ropsten-fork') ?
              await TestNutDistributor.deployed() :
              await NutDistributor.deployed();
        console.log('NutDistributor: ', nut_distributor.address);
        await admin.changeProxyAdmin(nutmeg.address, proxyAdminAddr);
        await admin.changeProxyAdmin(
                nut_distributor.address, proxyAdminAddr
        );
  }
};
