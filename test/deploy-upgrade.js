const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const Nut = artifacts.require('Nut');
const Nutmeg = artifacts.require('Nutmeg');
const TestNutmeg = artifacts.require('TestNutmeg');
const NutDistributor = artifacts.require('NutDistributor');
const TestNutDistributor = artifacts.require('TestNutDistributor');

contract("Upgrade", addresses => {
    const [owner] = addresses;
    describe('upgrades', () => {
        it('nutmeg', async () => {
            const inst = await deployProxy(Nutmeg, [owner]);
            const inst2 = await upgradeProxy(inst.address, TestNutmeg);
        });
        it('nutdistributor', async () => {
            const nut = await Nut.new("Nut token", "NUT", owner, {from: owner});
            const inst = await deployProxy(NutDistributor, [nut.address, owner]);
            assert.notEqual(await inst.getVersionString(), 'test.nutdistrib');
            const inst2 = await upgradeProxy(inst.address, TestNutDistributor);
            assert.equal(await inst2.getVersionString(), 'test.nutdistrib');
        });
    });
});
