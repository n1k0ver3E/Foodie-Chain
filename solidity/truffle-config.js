const path = require("path");
const { projectId, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  contracts_build_directory: path.join(__dirname, "../client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      //port: 7545,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: 9545,
      //port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`)
      },
      network_id: 3
    },
  },
  compilers: {
    solc: {
      version: "0.8.6",
      parser: "solcjs",
    },
  },
};
