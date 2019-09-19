const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");
console.log(typeof(source))
const input = {
  language: 'Solidity',
  sources: {
      'campaign.sol': {
          content: source//'import ./contracts/Campaign.sol'
      }
  },
  settings: {
      outputSelection: {
          '*': {
              '*': [ '*' ]
          }
      }
  }
}
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['campaign.sol'];
fs.ensureDirSync(buildPath);
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[
      contract
    ]
  );
}