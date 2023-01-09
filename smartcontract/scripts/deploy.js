
const hre = require("hardhat");
const ethers = require("ethers")

async function main() {

  const ChatAPP = await hre.ethers.getContractFactory("ChatApp");
  const deployedChatApp = await ChatAPP.deploy();

  await deployedChatApp.deployed();

  console.log( `ChatApp Contract address : ${deployedChatApp.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
