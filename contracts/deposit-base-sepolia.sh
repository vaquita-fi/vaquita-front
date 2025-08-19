#! /bin/bash
source .env

forge script script/Deposit.s.sol:DepositScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv \
  --sig "run(address,address,bytes16)" \
  $VAQUITA_POOL_ADDRESS $BASE_USDC_ADDRESS $DEPOSIT_ID