App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load land JSON
    $.getJSON('src/land.json', function(data) {
      var landRow = $('#landRow');
      var landTemplate = $('#landTemplate');

      for (i = 0; i < data.length; i ++) {
        landTemplate.find('.panel-title').text(data[i].name);
        landTemplate.find('img').attr('src', data[i].picture);
        landTemplate.find('.land-type').text(data[i].type);
        landTemplate.find('.land-price').text(data[i].price);
        landTemplate.find('.land-location').text(data[i].location);
        landTemplate.find('.btn-buy').attr('data-id', data[i].id);

        landRow.append(landTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {

    // Check for injected web3 instance
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
    // If there is no web3 instance, fallback to ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7454');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('build/contracts/Acquire.json', function(data) {

      // Get the artifact and instantiate it
      var AcquireArtifact = data;
      App.contracts.Acquire = TruffleContract(AcquireArtifact);

      // Set the provider for the contract
      App.contracts.Acquire.setProvider(App.web3Provider);

      // Use the contract to retrieve and mark the owned land
      return App.markAcquired();

    });

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).off('click', '.btn-buy').on('click', '.btn-buy', App.handleAcquire);
  },

  markAcquired: function(owners, account) {

    var acquireInstance;

    console.log('Owners: ' + owners);

    App.contracts.Acquire.deployed().then(function(instance) {
      acquireInstance = instance;

      return acquireInstance.getOwners.call();
    }).then(function(owners) {
      console.log("Mark Acquired Called"); // Debug
      console.log('Owners: ' + owners);

      for(i = 0; i < owners.length; i++){
        if(owners[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-land').eq(i).find('button').text('Success').attr('disabled', true);
          $('.panel-land').eq(i).find('.land-owner').text(owners[i].substring(0,6) + '...');
        }

      }
    }).catch(function(err){
      console.log(err.message);
    });

  },

  handleAcquire: function(event) {
    event.preventDefault();

    var landId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Acquire.deployed().then(function(instance) {
        acquireInstance = instance;

        // Execute acquire as a transaction by sending account

        console.log('Acquire being called...');
        return acquireInstance.acquire(landId, {from: account});
      }).then(function(result) {
        console.log('MarkAcquired being called...');
          return App.markAcquired();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
