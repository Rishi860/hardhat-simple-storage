const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (taskArgs, hre) => { // hre is same as require("hardhat");
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block nu,ber is: ${blockNumber}`);
  }
)

module.exports = {};