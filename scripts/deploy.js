const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const initialRewardAmount = hre.ethers.parseEther("0.01");

  const MentalMathGame = await hre.ethers.getContractFactory("MentalMathGame");
  const mentalMathGame = await MentalMathGame.deploy(initialRewardAmount);

  await mentalMathGame.waitForDeployment();
  const contractAddress = await mentalMathGame.getAddress();

  console.log(`MentalMathGame deployed to: ${contractAddress}`);
  console.log(
    `Initial reward amount: ${hre.ethers.formatEther(initialRewardAmount)} ETH`
  );

  const contractArtifact = hre.artifacts.readArtifactSync("MentalMathGame");

  const frontendContractsDir = path.join(
    __dirname,
    "..",
    "client",
    "src",
    "contracts"
  );
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendContractsDir, "contract-address.json"),
    JSON.stringify({ MentalMathGame: contractAddress }, undefined, 2)
  );

  fs.writeFileSync(
    path.join(frontendContractsDir, "MentalMathGame.json"),
    JSON.stringify(contractArtifact, null, 2)
  );

  console.log("Artifacts and address saved to client/src/contracts");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const fundingAmount = hre.ethers.parseEther("200");
  console.log(
    `Funding contract with ${hre.ethers.formatEther(fundingAmount)} ETH...`
  );
  const fundTx = await mentalMathGame
    .connect(deployer)
    .fundContract({ value: fundingAmount });
  await fundTx.wait();
  console.log(
    "Contract funded. New balance:",
    hre.ethers.formatEther(
      await hre.ethers.provider.getBalance(contractAddress)
    )
  );

  console.log("Ajout de questions...");
  const questions = [
    { problem: "2 + 2 ?", solution: 4 },
    { problem: "5 * 3 ?", solution: 15 },
    { problem: "12 - 7 ?", solution: 5 },
    { problem: "9 / 3 ?", solution: 3 },
  ];
  for (const q of questions) {
    const tx = await mentalMathGame
      .connect(deployer)
      .addQuestion(q.problem, q.solution);
    await tx.wait();
    console.log(`Question ajoutée: ${q.problem}`);
  }

  console.log("Activation de la première question...");
  const firstTx = await mentalMathGame
    .connect(deployer)
    .setFirstQuestionActive();
  await firstTx.wait();
  const [problem, active] = await mentalMathGame.getQuestion();
  console.log(`Première question active: "${problem}", Active: ${active}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
