import { RPCClient } from "firovm-sdk";
import { promises as fs } from "fs";
import { byteCode } from "./erc20";
import {
  url,
  numUTXO,
  fee,
  addr,
  createContract,
  gasLimit,
  gasPrice,
} from "./config";

const dirTx = "tx";
const rpc = new RPCClient(url);

async function createRawTransaction(utxo: any) {
  const left = (utxo.amount - fee).toFixed(8);
  let data: any[];

  if (createContract) {
    data = [
      [{ txid: utxo.txid, vout: utxo.vout }],
      [
        {
          contract: {
            bytecode: byteCode,
            gasLimit,
            gasPrice,
            senderAddress: addr,
          },
        },
      ],
    ];
  } else {
    data = [[{ txid: utxo.txid, vout: utxo.vout }], [{ [addr]: left }]];
  }

  const { result, error } = await rpc.rpc("createrawtransaction", data);
  if (error) {
    console.log("createrawtransaction:", error);
    throw error;
  }
  return result;
}

async function getUtxoList() {
  const { result, error } = await rpc.rpc("listunspent");
  if (error) {
    console.log("listunspent:", error);
    throw error;
  }
  const utxoList = result.filter((utxo: any) => utxo.amount >= 1);
  console.log("valid UTXO number: " + utxoList.length);
  return utxoList;
}

async function prepareRaxTx() {
  console.log("Start create raw transactions");

  const utxoList = await getUtxoList();
  if (utxoList.length < numUTXO) {
    console.log("Not enough UTXOs");
    return;
  }

  await fs.writeFile("sendrawtransaction.http", "");
  for (let i = 0; i < numUTXO; i++) {
    let rawTransaction = await createRawTransaction(utxoList[i]);
    let res;

    if (createContract) {
      res = await rpc.rpc("signrawsendertransactionwithwallet", [
        rawTransaction,
      ]);
      if (res.error) {
        console.log(`signrawsendertransactionwithwallet:`, res.error);
        throw res.error;
      }
      rawTransaction = res.result.hex;
    }

    res = await rpc.rpc("signrawtransactionwithwallet", [rawTransaction]);
    if (res.error) {
      console.log(`signrawtransactionwithwallet:`, res.error);
      throw res.error;
    }

    await fs.writeFile(
      `${dirTx}/tx${i}.json`,
      JSON.stringify({
        jsonrpc: "2.0",
        method: "sendrawtransaction",
        params: [res.result.hex],
        id: 1,
      })
    );
    await fs.appendFile(
      "sendrawtransaction.http",
      `POST ${url}\nContent-Type: application/json\n@${dirTx}/tx${i}.json\n\n`
    );
    console.log(`tx${i}`);
  }
  console.log("finish");
}

(async () => {
  try {
    await fs.access(dirTx);
  } catch (error) {
    fs.mkdir(dirTx);
  }
  await prepareRaxTx();
})();
