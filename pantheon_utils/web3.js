const Web3 = require('web3')
const ethTx = require('ethereumjs-tx')

// web3 initialization - must point to the HTTP JSON-RPC endpoint
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

module.exports = {web3,ethTx}