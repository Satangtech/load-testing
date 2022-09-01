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

- Config file `createRawTx.ts`

```typescript
/**
 * rpc url
 * number of UTXO to prepare
 * gas per transaction
 */
const url = "http://test:test1234@127.0.0.1:3889";
const num = 10000;
const gas = 0.01;
const addr = "qUe9cwiX81Y729BMgPMV4enHVBbDPDj7Xf";
```

- Run command generate raw transaction

```bash
yarn ts-node createRawTx.ts
```

### Run vegeta to send raw transactions is already signed to server

```bash
cat sendrawtransaction.http | vegeta attack -duration=10s -rate=1000/s | vegeta report
```
