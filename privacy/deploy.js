const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const EEAClient = require("./src");

const { orion, pantheon } = require("../keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "../ethereum/build/Caller/Caller.bin")
)

const web3 = new EEAClient(new Web3(pantheon.node1.url), 2018);

const createPrivateEmitterContract = () => {
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: pantheon.node1.privateKey
  };
  //console.log(contractOptions)
  return web3.eea.sendRawTransaction(contractOptions);
};

const getPrivateContractAddress = transactionHash => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv
    .getTransactionReceipt(transactionHash, orion.node1.publicKey) //node3 is only for obtaining the 
    //public transaction receipt, this can be any orion node
    .then(privateTransactionReceipt => {
      console.log("Private Transaction Receipt\n", privateTransactionReceipt);
      return privateTransactionReceipt.contractAddress;
    });
};

module.exports = () => {
  return createPrivateEmitterContract()
    .then(getPrivateContractAddress)
    .catch(console.error);
}

if (require.main === module) {
  module.exports();
}