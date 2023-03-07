/// to run
// truffle exec (filename) --network rinkeby


// Copy GnosisSafe.json into contracts/build
const Nut = artifacts.require('Nut');
const Nutmeg = artifacts.require("Nutmeg");
const NutDistributor = artifacts.require('NutDistributor');
const CompoundAdapter = artifacts.require("CompoundAdapter");
const { privateKeys } = require('./secrets.json');

const myAccounts = privateKeys.map(r => web3.eth.accounts.privateKeyToAccount(r));
const { submit } = require('./safe_sig_gen_uport_eip712');
const safe = '0xB8e9bd1ff33e44CE253F5311Fbed363269685828';

async function send_request(to, data) {
    await web3.eth.call({
        to: to, // contract address
        data: data,
        from: safe
    });
    t = await submit(safe, to, myAccounts[0],
                     privateKeys[0], data);
}


module.exports = async function(callback) {
    let nut = await Nut.at(
        '0x3539Ea2868762E29f0637B5B0253e6E711CaD6cB');
    let nut_dist =
        await NutDistributor.at(
            '0xfD13F7E36aaC8Eb1283a8Dd42EB4b3d6f7802ECA');
    let nutmeg = await Nutmeg.at(
        '0xB42a86dCA1ad2ba98BF736B9b480E60eFE84dfEa');

    await send_request(nutmeg.address,
                       nutmeg.contract.methods.setNut(nut.address).encodeABI()); 

/*    await send_request(nutmeg.address,
                       nutmeg.contract.methods.setNutDistributor(
                           nut_dist.address
f                       ).encodeABI());
    await send_request(nut_dist.address,
                       nut_dist.contract.methods.setNutmegAddress(
                           nut.address)
                       .encodeABI());  */
    console.log('done')
    callback();
}



