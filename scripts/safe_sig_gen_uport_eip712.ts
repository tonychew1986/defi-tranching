import EIP712Domain from "eth-typed-data";
import BigNumber from "bignumber.js";
import * as ethUtil from 'ethereumjs-util';
import { ethers } from "ethers";
import axios from "axios";

const { utils } = ethers;

const gnosisEstimateTransaction = async (safe: string, tx: any): Promise<any> => {
  try {
    const resp = await axios.post(`https://safe-relay.rinkeby.gnosis.pm/api/v2/safes/${safe}/transactions/estimate/`, tx)
    return resp.data
  } catch (e) {
    throw e
  }
}

const gnosisProposeTx = async (safe: string, tx: any): Promise<any> => {
  try {
    const resp = await axios.post(`https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safe}/transactions/`, tx)
    return resp.data
  } catch (e) {
    if (e.response) console.log(JSON.stringify(e.response.data))
    throw e
  }
}
/*
 * Safe transaction service example
 * * * * * * * * * * * * * * * * * * * */

default_options = {
execute: true
};

export const submit = async (safe, to, sender, privateKey, data, options = {}) => {
  options = { ...default_options, ...options };
  const safeDomain = new EIP712Domain({
    verifyingContract: safe,
  });

  const SafeTx = safeDomain.createType('SafeTx', [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ]);

  const baseTxn = {
    to,
    value: 0,
    data: data,
    operation: "0",
  };

  // Let the Safe service estimate the tx and retrieve the nonce
  const { safeTxGas, lastUsedNonce } = await gnosisEstimateTransaction(
    safe,
    baseTxn,
  );

  const txn = {
    ...baseTxn,
    safeTxGas,
    // Here we can also set any custom nonce
    nonce: lastUsedNonce === undefined ? 0 : lastUsedNonce + 1,
    // We don't want to use the refund logic of the safe to lets use the default values
    baseGas: 0,
    gasPrice: 0,
    gasToken: "0x0000000000000000000000000000000000000000",
    refundReceiver: "0x0000000000000000000000000000000000000000",
  };

  const safeTx = new SafeTx({ 
    ...txn,
    data: utils.arrayify(txn.data)
  });
  const signer = async data => {
    let { r, s, v } = ethUtil.ecsign(data, Buffer.from(privateKey, 'hex'));
    return ethUtil.toRpcSig(v, r, s)
  }
  const signature = await safeTx.sign(signer);

  const toSend = {
    ...txn,
    sender,
    contractTransactionHash: "0x" + safeTx.signHash().toString('hex'),
    signature: signature,
  };

  console.log(JSON.stringify({ toSend }));

  if (options.execute) {
    const { data } = await gnosisProposeTx(safe, toSend);
  }
  console.log({data})
  console.log("Done?");
}
