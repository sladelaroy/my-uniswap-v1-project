require("dotenv").config();
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Aura contract
  const Aura = await hre.ethers.getContractFactory("Aura");
  const aura = await Aura.deploy();
  await aura.waitForDeployment();
  console.log("Aura deployed to:", aura.target);

  // Deploy Exchange contract with Aura's address as an argument
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(aura.target);
  await exchange.waitForDeployment();
  console.log("Exchange deployed to:", exchange.target);

  // Export addresses to a JSON file
  const addresses = {
    Aura: aura.target,
    Exchange: exchange.target
  };

  console.log("Verifying contracts on Etherscan...");

  await hre.run("verify:verify", {
    address: aura.target,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: exchange.target,
    constructorArguments: [aura.target],
  });

  console.log("Contracts verified on Etherscan");

  fs.writeFileSync("../src/contract-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("Contract addresses saved to ../src/contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });