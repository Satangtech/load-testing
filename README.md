# qtum-load-testing

Use [Vegete](https://github.com/tsenart/vegeta) for HTTP load testing.

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

### Run install and create raw tx

- Install lib

```bash
yarn install
```

- Config files `createRawTx.ts`

```typescript
/**
 * rpc url
 * number of UTXO to prepare
 * gas per transaction
 */
const url = "http://test:test1234@127.0.0.1:3889";
const num = 1000;
const gas = 0.01;
const addr = "qJJpYnHBzkPjrQ1Nho5RAMLMMg8cizu558";
```

- Run command gen raw tx

```bash
yarn ts-node createRawTx.ts
```

### Run Vegeta to load test

```bash
cat sendrawtransaction.http | vegeta attack -duration=10s -rate=100/s | vegeta report
```
