source .env

forge script script/VaquitaPool.s.sol:VaquitaPoolScript \
 --rpc-url $RPC_URL \
 --etherscan-api-key $ETHERSCAN_API_KEY \
 --private-key $PRIVATE_KEY \
 --broadcast \
 --verify