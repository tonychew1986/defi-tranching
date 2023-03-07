const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { get_accounts } = require('./accounts');
const Nut = artifacts.require('Nut');
const Nutmeg = artifacts.require("Nutmeg");
const NutDistributor = artifacts.require('NutDistributor');
const TestNutDistributor = artifacts.require('TestNutDistributor');
const CompoundAdapter = artifacts.require("CompoundAdapter");

async function deploy_nut_distributor(deployer, network, nut,
                                      govAddr, deployAddr) {
    let inst;
    if (network == 'ropsten' || network == 'ropsten-fork') {
        inst = await deployProxy(
            TestNutDistributor,
            [nut.address, govAddr, 800],
            {from: deployAddr}
        );
    } else {
        inst = await deployProxy(
            NutDistributor, [nut.address, govAddr],
            {from: deployAddr}
        );
    }
    console.log('NutDistributor deployed: ', inst.address);
    return inst;
}

module.exports = async function(deployer, network, accounts) {
    // accounts[0] - sink fund
    // accounts[1] - deployer
    // accounts[2] - governor
    let [sinkAddr, deployAddr, govAddr ] = get_accounts(
        deployer,
        network,
        accounts
    );
    console.log('sink fund: ', sinkAddr);
    console.log('deployer:  ', deployAddr);
    console.log('governor:  ', govAddr);

    await deployer.deploy(Nut, 'Nutmeg Token',
                          'NUT', sinkAddr, {from: deployAddr});
    const nut = await Nut.deployed();
    console.log('nut: ', nut.address);
    nut.setPendingGovernor(govAddr, {from: deployAddr});
    const nutDistributor = await deploy_nut_distributor(
        deployer, network, nut, govAddr, deployAddr
    );
    const nutmeg = await deployProxy(Nutmeg, [govAddr], {from: deployAddr});
    console.log('Nutmeg deployed: ', nutmeg.address);
}

/* the follow commands should be run by the gnosis 
nut.acceptGovernor();
nut.setNutDistributor(nutDistributor.address, {from: govAddr});
nutmeg.setNut(nut.address, {from: govAddr});
nutmeg.setNutDistributor(nutDistributor.address, {from: govAddr});
nutDistributor.setNutmegAddress(nutmeg.address, {from: govAddr});
*/
