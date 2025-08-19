import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config({ path: "contracts/.env" });

const vaquitaPoolAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "depositId", type: "bytes16", internalType: "bytes16" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "period", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "signature", type: "bytes", internalType: "bytes" }
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getPosition",
    inputs: [
      { name: "depositId", type: "bytes16", internalType: "bytes16" }
    ],
    outputs: [
      { name: "positionOwner", type: "address", internalType: "address" },
      { name: "positionAmount", type: "uint256", internalType: "uint256" },
      { name: "liquidityIndex", type: "uint256", internalType: "uint256" },
      { name: "entryTime", type: "uint256", internalType: "uint256" },
      { name: "finalizationTime", type: "uint256", internalType: "uint256" },
      { name: "positionIsActive", type: "bool", internalType: "bool" },
      { name: "period", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  }
];

const aavePoolAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      }
    ],
    "name": "getReserveData",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "data",
                "type": "uint256"
              }
            ],
            "internalType": "struct DataTypes.ReserveConfigurationMap",
            "name": "configuration",
            "type": "tuple"
          },
          {
            "internalType": "uint128",
            "name": "liquidityIndex",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "currentLiquidityRate",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "variableBorrowIndex",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "currentVariableBorrowRate",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "currentStableBorrowRate",
            "type": "uint128"
          },
          {
            "internalType": "uint40",
            "name": "lastUpdateTimestamp",
            "type": "uint40"
          },
          {
            "internalType": "uint16",
            "name": "id",
            "type": "uint16"
          },
          {
            "internalType": "address",
            "name": "aTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "stableDebtTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "variableDebtTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "interestRateStrategyAddress",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "accruedToTreasury",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "unbacked",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "isolationModeTotalDebt",
            "type": "uint128"
          }
        ],
        "internalType": "struct DataTypes.ReserveData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const privateKey = process.env.PRIVATE_KEY!;
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL!;
console.log("rpcUrl", rpcUrl);

const vaquitaPoolAddress = process.env.BASE_SEPOLIA_VAQUITA_POOL_ADDRESS!;
const aavePoolAddress = process.env.BASE_SEPOLIA_AAVE_POOL_ADDRESS!;
const usdcAddress = process.env.BASE_SEPOLIA_USDC_ADDRESS!;

const provider = new ethers.JsonRpcProvider(rpcUrl);

const signer = new ethers.Wallet(
  privateKey,
  provider
);

const depositIdHex = process.env.DEPOSIT_ID!;

const vaquitaPool = new ethers.Contract(vaquitaPoolAddress, vaquitaPoolAbi, signer);
const aavePool = new ethers.Contract(aavePoolAddress, aavePoolAbi, signer);

async function getInterest() {
    // 1. get deposit details
    const deposit = await vaquitaPool.getPosition(depositIdHex);
    console.log("deposit", { deposit });

    // 2. get aave liquidity index
    const aaveReserveData = await aavePool.getReserveData(usdcAddress);
    console.log("aaveReserveData", { aaveReserveData });

    const positionValue = (deposit.positionAmount * aaveReserveData.liquidityIndex) / deposit.liquidityIndex;
    const interest = positionValue - deposit.positionAmount;
    console.log("interest", interest);
}

getInterest();