source .env

forge script script/DeployVaquitaPoolBaseSepolia.s.sol:DeployVaquitaPoolBaseSepoliaScript \
 --rpc-url $BASE_SEPOLIA_RPC_URL \
 --etherscan-api-key $ETHERSCAN_API_KEY \
 --private-key $PRIVATE_KEY \
 --broadcast \
 --verify