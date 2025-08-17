source .env

forge script script/DeployVaquitaPoolScrollSepolia.s.sol:DeployVaquitaPoolScrollSepoliaScript \
 --rpc-url $SCROLL_SEPOLIA_RPC_URL \
 --etherscan-api-key $ETHERSCAN_API_KEY \
 --private-key $PRIVATE_KEY \
 --broadcast \
 --verify