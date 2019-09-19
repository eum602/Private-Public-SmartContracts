const {web3} =  require('./web3')
const{buildTransaction,sendTransaction}=require('./web3Operations')

// set to 1 for faster validation in this course.
web3.transactionConfirmationBlocks = 1;





// Get the address transaction count in order to specify the correct nonce
//const contractAddress = '0xA86EB77c09aE0F2164065aB14094565011b0BfcA'
const setter = async (contractAddress,addressFrom,txData,privKey) => {  
    const txCount = await web3.eth.getTransactionCount(addressFrom)//.then(result => setValue(result))    
    const txObject = buildTransaction(txCount,contractAddress,"0",txData)
    const receipt = await sendTransaction(txObject,privKey)
    //console.log('receipt',receipt.logs)
    return receipt
}
//setter()

module.exports = setter