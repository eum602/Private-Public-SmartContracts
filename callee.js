const {web3} = require("./pantheon_utils/web3")
const {deploySmartContract,getValueFromPublicBlockchain} = require('./pantheon_utils/web3Operations')
const setter = require("./pantheon_utils/setterSmartContract")
//binary to deploy the smart contract
const contractData = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063209652551461005c578063552410771461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a7230582075c62564b30e771aa918ad342181ef3ae43a467d1823dadc5da945f5cf62713a0029"
// set to 1 for faster validation in this course.
web3.transactionConfirmationBlocks = 1;

//abi to interact with the smart contract
const EventEmitterAbi = require("./ethereum/build/EventEmitter/EventEmitter.json").output.abi

const addressFrom = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73' //pub_key
const privKey = Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63', 'hex')

const fcn = async () => {
  console.log("#######################Deploying smart contract#######################")
  const contractAddress = await deploySmartContract(contractData,addressFrom,privKey)

  console.log("#######################Getting initial value#######################")
  await getValueFromPublicBlockchain(EventEmitterAbi,contractAddress)

  console.log("#######################Setting new value#######################")
  const functionName = "setValue"
  const typeOfData = "uint256"
  const valueToSet = 40
  let set = web3.eth.abi.encodeFunctionSignature(`${functionName}(${typeOfData})`)//function name to use
  let value = web3.eth.abi.encodeParameter('uint256', valueToSet)//setting the value

  const txData = set + value.substr(2)
  await setter(contractAddress,addressFrom,txData,privKey)

  console.log("#######################getting new value from blockchain#######################")
  await getValueFromPublicBlockchain(EventEmitterAbi,contractAddress)
}

module.exports = () => {
  fcn() 
}

if (require.main === module) {
  module.exports()
}