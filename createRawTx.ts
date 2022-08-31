/**
 * prepare enough raw Tx,
 */
import { RPCClient } from "firovm-sdk";
import { promises as fs } from "fs";
const dirTx = "tx";

async function createTransaction(
  rpc: RPCClient,
  utxo: any,
  gas: number,
  addr: string
) {
  let left = utxo.amount - gas;
  let data: any = [[{ txid: utxo.txid, vout: utxo.vout }], { [addr]: left }];

  const { result, error } = await rpc.rpc("createrawtransaction", data);
  return result;
}

async function getUtxoList(rpc: RPCClient) {
  let { result } = await rpc.rpc("listunspent");
  const utxoList = result.filter((utxo: any) => utxo.amount >= 1);
  console.log("valid UTXO number: " + utxoList.length);
  return utxoList;
}

/**
 * prepare raw Tx
 */
async function createRaxTx(
  rpc: RPCClient,
  num: number,
  gas: number,
  addr: string
) {
  console.log("start create rawTx");

  let utxoList = await getUtxoList(rpc);
  if (utxoList.length < num) {
    console.log("not enough UTXOs");
    return;
  }

  await fs.writeFile("sendrawtransaction.http", "");
  for (let i = 1; i <= num; i++) {
    let rawTransaction = await createTransaction(rpc, utxoList[i], gas, addr);
    const { result, error } = await rpc.rpc("signrawtransactionwithwallet", [
      rawTransaction,
    ]);

    await fs.writeFile(
      `${dirTx}/tx${i}.json`,
      JSON.stringify({
        jsonrpc: "2.0",
        method: "sendrawtransaction",
        params: [result.hex],
        id: 1,
      })
    );
    await fs.appendFile(
      "sendrawtransaction.http",
      `POST http://test:test1234@127.0.0.1:3889\nContent-Type: application/json\n@${dirTx}/tx${i}.json\n\n`
    );
    console.log(`tx${i}`);
  }

  console.log("finish");
}

/**
 * rpc url
 * number of UTXO to prepare
 * gas per transaction
 */
(async () => {
  const url = "http://test:test1234@127.0.0.1:3889";
  const num = 1000;
  const gas = 0.01;
  const addr = "qJJpYnHBzkPjrQ1Nho5RAMLMMg8cizu558";
  const rpc = new RPCClient(url);

  try {
    await fs.access(dirTx);
  } catch (error) {
    fs.mkdir(dirTx);
  }

  await createRaxTx(rpc, num, gas, addr);
})();
