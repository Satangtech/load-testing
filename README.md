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

### Test in 1 minute with rate 10k/s

- List of method (replace \* with method name)

  - getblockchaininfo
  - send
  - createcontract
  - qrc20transfer

- Modify files `req/*.http` and `req/*.json` for correct information.

- Run command

  ```bash
  cd req
  cat *.http | vegeta attack -duration=60s -rate=10000/s | vegeta report
  ```
