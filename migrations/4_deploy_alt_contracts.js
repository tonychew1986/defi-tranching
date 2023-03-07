const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { get_accounts } = require('./accounts');
const Nutmeg = artifacts.require('Nutmeg');
const NutmegAltA = artifacts.require('NutmegAltA');
const NutDistributorAltA = artifacts.require('NutDistributorAltA');
const CompoundAdapterAltA = artifacts.require('CompoundAdapterAltA');
const CompoundAdapterAltB = artifacts.require('CompoundAdapterAltB');

const MockERC20 = artifacts.require("MockERC20");
const MockERC20AltA = artifacts.require('MockERC20AltA');
const MockERC20AltB = artifacts.require('MockERC20AltB');
const MockERC20AltC = artifacts.require('MockERC20AltC');

const MockCERC20 = artifacts.require("MockCERC20");
const MockCERC20AltA = artifacts.require('MockCERC20AltA');
const MockCERC20AltB = artifacts.require('MockCERC20AltB');
const MockCERC20AltC = artifacts.require('MockCERC20AltC');

module.exports = async function(deployer, network, accounts) {
    const [ sinkAddr, deployAddr, govAddr ] = get_accounts(
        deployer, network, accounts
    );
    console.log('sink fund: ', sinkAddr);
    console.log('deployer:  ', deployAddr);
    console.log('governor:  ', govAddr);
    if (network != "mainnet" && network != "mainnet-fork") {
        await deployer.deploy(NutmegAltA, {from: deployAddr});
        await deployer.deploy(NutDistributorAltA, {from: deployAddr});

        await deployer.deploy(
            MockERC20,
            'Mock ETH',
            'METH', 18, {from: deployAddr}
        );
        const tmock = await MockERC20.deployed();
        await deployer.deploy(MockCERC20, tmock.address, {from: deployAddr});
        await deployer.deploy(MockERC20AltA, {from: deployAddr});
        await deployer.deploy(MockERC20AltB, {from: deployAddr});
        await deployer.deploy(MockERC20AltC, {from: deployAddr});
        const talta = await MockERC20AltA.deployed();
        const taltb = await MockERC20AltB.deployed();
        const taltc = await MockERC20AltC.deployed();

        await deployer.deploy(
            MockCERC20AltA, talta.address, {from: deployAddr}
        );
        await deployer.deploy(
            MockCERC20AltB, taltb.address, {from: deployAddr}
        );
        await deployer.deploy(
            MockCERC20AltC, taltc.address, {from: deployAddr}
        );
        const nutmeg = await Nutmeg.deployed();
        const calta = await deployer.deploy(
            CompoundAdapterAltA, nutmeg.address, {from: deployAddr}
        );
        calta.setPendingGovernor(govAddr, {from: deployAddr});

        const caltb = await deployer.deploy(
            CompoundAdapterAltB, nutmeg.address, {from: deployAddr}
        );

        caltb.setPendingGovernor(govAddr, {from: deployAddr});
    }
}
