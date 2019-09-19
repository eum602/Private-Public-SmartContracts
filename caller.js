const {web3} = require("./pantheon_utils/web3")
const {deploySmartContract,getValueFromCaller} = require('./pantheon_utils/web3Operations')
const setter = require("./pantheon_utils/setterSmartContract")
//binary to deploy the smart contract
const bytecodeBinaryObject = "0x608060405234801561001057600080fd5b50610255806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e06fbf6514610051578063e8a62235146100a8575b600080fd5b34801561005d57600080fd5b50610092600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506100eb565b6040518082815260200191505060405180910390f35b3480156100b457600080fd5b506100e9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610198565b005b6000808290508073ffffffffffffffffffffffffffffffffffffffff1663209652556040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15801561015557600080fd5b505af1158015610169573d6000803e3d6000fd5b505050506040513d602081101561017f57600080fd5b8101908080519060200190929190505050915050919050565b60008190508073ffffffffffffffffffffffffffffffffffffffff16635524107760646040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561020d57600080fd5b505af1158015610221573d6000803e3d6000fd5b5050505050505600a165627a7a72305820f4d017565f27b3d40b2134c86a6b2aa2298027012ce442a1a8005174c6a17bfb0029"
// set to 1 for faster validation in this course.
web3.transactionConfirmationBlocks = 1;

//callee contract address
const calleeContractAddress = "0x15AeC877735b51c01a0cDdDf242C419b1E526f2e"


//abi to interact with the smart contract
const contractAbi = require("./ethereum/build/Caller/Caller.json").output.abi

const addressFrom = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73' //pub_key
const privKey = Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63', 'hex')

const fcn = async () => {
  console.log("#######################Deploying Caller smart contract#######################")
  const contractAddress = await deploySmartContract(bytecodeBinaryObject,addressFrom,privKey)

  console.log("#######################Getting initial value#######################")
  await getValueFromCaller(contractAbi,contractAddress,calleeContractAddress)

  console.log("#######################Setting new value#######################")
  let functionName = "storeAction"
  let typeOfData = "address"
  set = web3.eth.abi.encodeFunctionSignature(`${functionName}(${typeOfData})`)//function name to use
  value = web3.eth.abi.encodeParameter(typeOfData, calleeContractAddress)//setting the value

  const txData = set + value.substr(2)
  await setter(contractAddress,addressFrom,txData,privKey)

  console.log("#######################getting new value from blockchain#######################")
  await getValueFromCaller(contractAbi,contractAddress,calleeContractAddress)
}

module.exports = () => {
  fcn() 
}

if (require.main === module) {
  module.exports()
}