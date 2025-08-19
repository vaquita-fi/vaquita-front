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

const erc20Abi = [

  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
];

const privateKey = process.env.PRIVATE_KEY!;
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;

const vaquitaPoolAddress = process.env.BASE_SEPOLIA_VAQUITA_POOL_ADDRESS!;
const usdcAddress = process.env.BASE_SEPOLIA_USDC_ADDRESS!;

const provider = new ethers.JsonRpcProvider(rpcUrl);

const signer = new ethers.Wallet(
  privateKey,
  provider
);

// function getRandomBytes16(): string {
//   // Generate 16 random bytes and return as 0x-prefixed hex string
//   const bytes = ethers.randomBytes(16);
//   return "0x" + Buffer.from(bytes).toString("hex");
// }

const parsedAmount = ethers.parseUnits("1", 6);
const depositIdHex = process.env.DEPOSIT_ID!;

const deadline = Math.floor(Date.now() / 1000) + 3600;

const vaquitaPool = new ethers.Contract(vaquitaPoolAddress, vaquitaPoolAbi, signer);
const usdc = new ethers.Contract(usdcAddress, erc20Abi, signer);

const deposit = async () => {
  const txApprove = await usdc.approve(vaquitaPoolAddress, parsedAmount);
  console.log("txApprove", txApprove);

  const receiptApprove = await txApprove.wait();
  console.log("receiptApprove", receiptApprove);

  const tx = await vaquitaPool.deposit(
    depositIdHex,
    parsedAmount,
    604800,
    deadline,
    "0x"
  );
  console.log("tx", tx);

  const receiptDeposit = await tx.wait();
  console.log("receiptDeposit", receiptDeposit);
};

deposit();
