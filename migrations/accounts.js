'use strict';
function get_accounts(deployer, network, accounts) {
    let sinkAddr, deployAddr, govAddr, proxyAdminAddr;
    if (network == 'ropsten' || network == 'ropsten-fork') {
        sinkAddr = '0x968e88df55acaec002e3d7c2393f9742e40d94b9';
        deployAddr = '0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364';
        govAddr = '0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364';
    }  if (network == 'rinkeby' || network == 'rinkeby-fork') {
        deployAddr = '0x35b9f43f9ec7aef35bff4f3330ef74df95ee9364';
        sinkAddr = '0xB8e9bd1ff33e44CE253F5311Fbed363269685828';
        govAddr = '0xB8e9bd1ff33e44CE253F5311Fbed363269685828';
        proxyAdminAddr = '0x4C250cf2279930dc6c1B17049Df66d436e10C9cF';
    } else if (network == 'mainnet' || network == 'mainnet-fork') {
        sinkAddr = '0xa8DC5cDfb7C75F0deD502E539B9769DD5C9DdE63';
        deployAddr = '0x2E67b3ab6AFBB95796034D9B61F3f633f0729761';
        govAddr = '0xa8DC5cDfb7C75F0deD502E539B9769DD5C9DdE63';
        gnosisAddr = '0xa8DC5cDfb7C75F0deD502E539B9769DD5C9DdE63';
    } else {
        sinkAddr = accounts[0];
        deployAddr = accounts[1];
        govAddr = accounts[2];
    }
    return [sinkAddr, deployAddr, govAddr, proxyAdminAddr];
}


exports.get_accounts = get_accounts;
