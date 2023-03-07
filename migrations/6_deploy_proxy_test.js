'use strict';
const { admin } = require('@openzeppelin/truffle-upgrades');
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { get_accounts } = require('./accounts');
const TestProxy = artifacts.require('TestProxy');

module.exports = async function(deployer, network, accounts) {
    let [sinkAddr, deployAddr, govAddr, proxyAdminAddr ] = get_accounts(
        deployer,
        network,
        accounts
    );

    if (network != 'mainnet' && network != 'mainnet') {
        const tp = await deployProxy(TestProxy, [govAddr], {from: deployAddr});
        console.log('Test proxy: ', tp.address);
        if (proxyAdminAddr !== undefined) {
            console.log('Changing proxy admin to: ', proxyAdminAddr);
            await admin.changeProxyAdmin(tp.address, proxyAdminAddr);
        }
    }
}
