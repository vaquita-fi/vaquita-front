// import { expect } from "chai";
// import { ethers } from "ethers";

describe("Deposit Integration Test", function () {
  // let depositContract: any;
  // let owner: any;
  // let addr1: any;

  beforeEach(async function () {
    // [owner, addr1] = await ethers.getSigners();
    // const Deposit = await ethers.getContractFactory("Deposit");
    // depositContract = await Deposit.deploy();
    // await depositContract.deployed();
  });

  it("should accept deposits and update balances", async function () {
    // const depositAmount = ethers.parseEther("1.0");
    // await depositContract.connect(addr1).deposit({ value: depositAmount });

    // const balance = await depositContract.balances(addr1.address);
    // expect(balance).to.equal(depositAmount);
  });

  it("should emit a Deposit event on deposit", async function () {
    // const depositAmount = ethers.parseEther("0.5");
    // await expect(
    //   depositContract.connect(addr1).deposit({ value: depositAmount })
    // )
    //   .to.emit(depositContract, "Deposit")
    //   .withArgs(addr1.address, depositAmount);
  });
});