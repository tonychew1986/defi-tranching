'use strict';
const Nutmeg = artifacts.require("Nutmeg");
const CompoundAdapter = artifacts.require("CompoundAdapter");
const { get_accounts } = require('./accounts');

module.exports = async function(deployer, network, accounts) {
    // accounts[0] - sink fund
    // accounts[1] - deployer
    // accounts[2] - governor
    const [sinkAddr, deployAddr, govAddr ] = get_accounts(
        deployer,
        network,
        accounts
    );
    console.log('sink fund: ', sinkAddr);
    console.log('deployer:  ', deployAddr);
    console.log('governor:  ', govAddr);
    const nutmeg = await Nutmeg.deployed();
    const adapter = await deployer.deploy(
        CompoundAdapter,
        nutmeg.address, {from: deployAddr}
    );
    adapter.setPendingGovernor(govAddr, {from: deployAddr});
}
