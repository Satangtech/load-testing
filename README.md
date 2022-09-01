# Qtum Load Testing

Use [Vegeta](https://github.com/tsenart/vegeta) for HTTP load testing.

## Prerequisites

- [nodejs](https://nodejs.org/)
- [yarn](https://classic.yarnpkg.com/)
- [jq](https://stedolan.github.io/jq/)
- [vegeta](https://stedolan.github.io/jq/)

## Install Vegeta on Linux

```bash
mkdir vegeta && cd vegeta
wget https://github.com/tsenart/vegeta/releases/download/v12.8.4/vegeta_12.8.4_linux_amd64.tar.gz
tar -zxvf vegeta_12.8.4_linux_amd64.tar.gz
chmod +x vegeta
./vegeta --version

# Add to .bashrc
echo "export PATH=$PATH:/home/ubuntu/vegeta" >>  ~/.bashrc
source ~/.bashrc
vegeta --version

# Test run Vegeta
echo "GET http://httpbin.org/get" | vegeta attack -duration=5s -rate=5 | vegeta report
```

### Create unspent transaction

- Create wallet

```bash
qtum-cli createwallet wallet1

# output
{
  "name": "wallet1",
  "warning": ""
}
```

- Get new address

```bash
qtum-cli getnewaddress

# output
qUe9cwiX81Y729BMgPMV4enHVBbDPDj7Xf
```

- Generate to Address

```bash
qtum-cli generatetoaddress 10000 qUe9cwiX81Y729BMgPMV4enHVBbDPDj7Xf
```

- Check unspent to target amount

```bash
qtum-cli listunspent | jq length

# output
10000
```

### Run install and create raw transaction

- Install lib

```bash
yarn install
```

- Config file `config.ts`

```typescript
export const url = "http://test:test1234@127.0.0.1:3889"; // rpc url
export const numUTXO = 10; // number of UTXO to prepare
export const fee = 0.01; // fee per transaction
export const addr = "qUe9cwiX81Y729BMgPMV4enHVBbDPDj7Xf"; // Address from getnewaddress
export const createContract = false; // create contract or send payment
export const gasLimit = 2500000; // gas limit for create contract
export const gasPrice = "0.0000004"; // gas price for create contract
```

- Run command generate raw transaction

```bash
yarn ts-node prepareRaxTx.ts
```

### Run vegeta to send raw transactions is already signed to server

```bash
cat sendrawtransaction.http | vegeta attack -duration=1s -rate=10/s | vegeta report

# output
Requests      [total, rate, throughput]         10, 11.10, 10.46
Duration      [total, attack, wait]             956.363ms, 900.679ms, 55.684ms
Latencies     [min, mean, 50, 90, 95, 99, max]  29.51ms, 65.221ms, 60.433ms, 106.098ms, 140.375ms, 140.375ms, 140.375ms
Bytes In      [total, mean]                     980, 98.00
Bytes Out     [total, mean]                     4498, 449.80
Success       [ratio]                           100.00%
Status Codes  [code:count]                      200:10
Error Set:
```
