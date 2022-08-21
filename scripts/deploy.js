// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  console.log("inside main function: deploy.js");
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");// we alerady have ss compiled in contracts folder so hardhat knows where to pick it up from;
  console.log("Deploying Contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Contract deployed at address: ${simpleStorage.address}`);
  // what happens when we deploy to hardhat?
  if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // Etherscan might not be updated so we need to verify there are some blocks mined
    console.log("in verofy");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentfavNumber = await simpleStorage.retrieve();
  console.log(`Current fav number is: ${currentfavNumber}`);
  const transactionResponse = await simpleStorage.store("123");
  await transactionResponse.wait(1);
  const updatedNumber = await simpleStorage.retrieve();
  console.log(`Update number is: ${updatedNumber}`);
}

// could still have an error cause the contract I tested with it was already deployed
async function verify(contractAddress, args){
  console.log("Verifying contract...");
  try {
    await run("verify:verify",{
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if(e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
