source .env

forge script script/DeployVaquitaPoolBase.s.sol:DeployVaquitaPoolBaseScript \
 --rpc-url $BASE_RPC_URL \
 --etherscan-api-key $ETHERSCAN_API_KEY \
 --private-key $PRIVATE_KEY \
 --broadcast \
 --verify