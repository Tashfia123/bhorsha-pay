const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("CrowdFunding");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("CrowdFunding deployed at:", contract.address);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
