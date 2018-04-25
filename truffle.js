var HDWalletProvider = require("truffle-hdwallet-provider");

// Add your 12 word mnemonic between the parenthesis - web tools exist to create this for you.
var mnemonic = "";

solc: {
  optimizer: {
    enabled: true
  }
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    live: {
      network_id: 1,
      host: "127.0.0.1",
      port: 7546
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/fbHex63UBfdIw8QB6pGM");
      },
      network_id: 3,
      gas: 4712388,
      gasPrice: 65000000000
    }
  }
};
