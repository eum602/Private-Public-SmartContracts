const {web3,ethTx} =  require('./web3')

function buildTransaction(txnCount,addressTo,valueInEther,customData){
    const data = web3.utils.toHex(customData)

    // Create the transaction object
    //console.log("outgoing data:",web3.utils.toHex(customData)) 
    return txObject = {
        nonce: web3.utils.toHex(txnCount),
        gasPrice: web3.utils.toHex(10000),
        gasLimit: web3.utils.toHex(10000000),
        to: addressTo,
        value: web3.utils.toHex(web3.utils.toWei(valueInEther, 'ether')),
        data
    };
}

function buildSmartContractTransaction(txnCount,contractData){
    const data = web3.utils.toHex(contractData)

    // Create the transaction object
    //console.log("outgoing data:",web3.utils.toHex(customData)) 
    return txObject = {
        nonce: web3.utils.toHex(txnCount),
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(10000000),
        data
    }
}

const sendTransaction= async(txObject,privKey)=>{
    const tx = new ethTx(txObject)
    tx.sign(privKey)

    const serializedTx = tx.serialize()
    const rawTxHex = '0x' + serializedTx.toString('hex')    
    
    const receipt = await web3.eth.sendSignedTransaction(rawTxHex)
    return receipt        
}

const getData = async(blockNumber)=>{
    const block = await web3.eth.getBlock(blockNumber)
    //console.log(block)
    await getTransaction(block.transactions[0])
}

const getTransaction = async txHash => {
    console.log("Retrieving transaction from Pantheon...")
    const receivedTX = await web3.eth.getTransaction(txHash)
    return receivedTX
}


const deploySmartContract = async(contractData,addressFrom,privKey) => {
    const txCount = await web3.eth.getTransactionCount(addressFrom)
    const txObject = buildSmartContractTransaction(txCount,contractData)
    const receipt = await sendTransaction(txObject,privKey)
    //Retriveing contract address and transaction hash
    //console.log("Transaction hash: ", receipt.transactionHash)
    console.log("Contract address", receipt.contractAddress)
    //await create(`block-${receipt.blockNumber}-received-smart-contract-tx`, JSON.stringify(receipt))
    //console.log(`Contract address saved in path: \
      // ./.data/block-${receipt.blockNumber}-received-smart-contract-tx.txt`)
      return receipt.contractAddress
}

const getValueFromPublicBlockchain = async (EventEmitterAbi,address) => {//address: contract address
    //console.log("retrieving data from pantheon public smart contract...")
    const contractInstance = new web3.eth.Contract(EventEmitterAbi,address, {
      from: '0x1234567890123456789012345678901234567891', // default from address
      gasPrice: '0' // default gas price in wei, 20 gwei in this case
    })
    const value=await contractInstance.methods.value().call()
    console.log('value',value)
    return value
}
  

const filter = () => {
    const address = "0x42699A7612A82f1d9C36148af9C77354759b210b" //contract address
    const START_BLOCK = 0;
    const END_BLOCK = 1000;
    const contractInstance = new web3.eth.Contract(EventEmitterAbi,address, {
      from: '0x1234567890123456789012345678901234567891', // default from address
      gasPrice: '0' // default gas price in wei, 20 gwei in this case
    })
    contractInstance.getPastEvents("allEvents",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK // You can also specify 'latest'          
        })
    .then(events => console.log(events))
    .catch((err) => console.error(err));
}

module.exports = {
    buildTransaction,
    buildSmartContractTransaction,
    sendTransaction,
    getData,
    getTransaction,
    deploySmartContract,
    getValueFromPublicBlockchain
}