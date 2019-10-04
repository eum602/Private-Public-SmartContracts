const Web3 = require("web3");
const EEAClient = require("./src");
const CallerAbi = require("../ethereum/build/Caller/Caller.json")
  .output.abi;

  //console.log(CallerAbi)

const { orion, pantheon , contractAddresses } = require("../keys.js");

const storeValueFromNode1 = (privateCallerContractAddress, publicCalleeContractAddress) => {
  const web3 = new EEAClient(new Web3(pantheon.node1.url), 2018);
  const contract = new web3.eth.Contract(CallerAbi,privateCallerContractAddress);

   const functionAbi = contract._jsonInterface.find(e => {//_jsonInterface is for web3@1.2.0
       console.log(e.name)
    return e.name === "storeAction";
  });

  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [publicCalleeContractAddress])
    .slice(2);
  const functionCall = {
    to: privateCallerContractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: pantheon.node1.privateKey
  }
  return web3.eea
    .sendRawTransaction(functionCall)
    .then(transactionHash => {
      console.log("Transaction Hash:", transactionHash);
      return web3.priv.getTransactionReceipt(
        transactionHash,
        orion.node1.publicKey //this can be any other, for instance node 2 or node 3 because it returns the hash
        //from public transaction
      );
    })
    .then(result => {
      try{
        console.log("Event Emited:", result.logs[0].data);
      }catch(e){
        console.log("result does not have nothing on logs property")
        console.log(result)
      }
      //console.log("Transaction receipt: ", result)
      return result;
    });
};

const getValue = (url, privateCallerContractAddress, privateFrom, privateFor, privateKey,publicCalleeContractAddress) => {
  const web3 = new EEAClient(new Web3(url), 2018);

  const contract = new web3.eth.Contract(CallerAbi)

  // eslint-disable-next-line no-underscore-dangl
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "getAction";
  });

  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [publicCalleeContractAddress])
    .slice(2)  

  const functionCall = {
    to: privateCallerContractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom,
    privateFor,
    privateKey
  }

  return web3.eea
    .sendRawTransaction(functionCall)
    .then(transactionHash => {
      return web3.priv.getTransactionReceipt(
        transactionHash,
        orion.node1.publicKey
      )
    })
    .then(result => {
      console.log(`Get Value from ${url}:`, result.output);
      return result;
    });
}

const getValueFromNode1 = (privateCallerContractAddress,publicCalleeContractAddress) => {
  return getValue(
    pantheon.node1.url,
    privateCallerContractAddress,
    orion.node1.publicKey,
    [orion.node2.publicKey],
    pantheon.node3.privateKey,
    publicCalleeContractAddress
  );
};

const getValueFromNode2 = (privateCallerContractAddress,publicCalleeContractAddress) => {
  return getValue(
    pantheon.node2.url,
    privateCallerContractAddress,
    orion.node2.publicKey,
    [orion.node1.publicKey],
    pantheon.node2.privateKey,
    publicCalleeContractAddress
  );
};

const getValueFromNode3 = (privateCallerContractAddress,publicCalleeContractAddress) => {
  return getValue(
    pantheon.node3.url,
    privateCallerContractAddress,
    orion.node3.publicKey,
    [orion.node1.publicKey],
    pantheon.node3.privateKey,
    publicCalleeContractAddress
  );
};

module.exports = {
  storeValueFromNode1,
  getValueFromNode1,
  getValueFromNode2,
  getValueFromNode3
};

if (require.main === module) {
  //const address = process.env.CONTRACT_ADDRESS;
  storeValueFromNode1(contractAddresses.privateCallerContractAddress, contractAddresses.publicCalleeContractAddress)
  //getValueFromNode1(contractAddresses.privateCallerContractAddress,contractAddresses.publicCalleeContractAddress);
    .then(() => {
      return getValueFromNode1(contractAddresses.privateCallerContractAddress,contractAddresses.publicCalleeContractAddress);
    })
    // .then(() => {
    //   return getValueFromNode2(contractAddresses.privateCallerContractAddress,contractAddresses.publicCalleeContractAddress);
    // })
    // .then(() => {
    //   return getValueFromNode3(contractAddresses.privateCallerContractAddress,contractAddresses.publicCalleeContractAddress);
    // })
    //.catch(console.log);
}