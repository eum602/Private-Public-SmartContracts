## Smart Contracts ##

## NOTES

To run this, you should have a private network over IBFT2.0 consensus algorithm and a private orion transaction manager running for each node

## How to use

### Clone Repository ####
```shell
$ git clone https://github.com/eum602/Private-Public-SmartContracts.git
$ cd Private-Public-SmartContracts/
```

### Install the needed dependencies ####

```shell
$ npm install
```

### Copying keys  ####
Fill all needed keys in the file keys.js

### Deploy the public contract ###
Deploy the public contract by running:
```shell
$ node callee.js
```
After that the contract address will be shown on screen. Copy that address into the keys.js files

```shell
$ contractAddresses:{
      ...
      publicCalleeContractAddress: "0x42699A7612A82f1d9C36148af9C77354759b210b"
    }
    ...
```

### Deploy the private contract address ###
```shell
$ node privacy/deploy.js
```
After that the private contract address will be shown on screen. Copy that address into the keys.js files
```shell
$ contractAddresses:{
      ...
       privateCallerContractAddress:"0x3564ef0e04bc2364af376af00a2bbb2982cfb6ca",
    }
    ...
```

### Reading public smart contract state from a private smart contract ###
``` shell
$ node privacy/interact.js
```