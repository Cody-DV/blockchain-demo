pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Acquire.sol";

contract TestAcquire{

  Acquire acquire = Acquire(DeployedAddresses.Acquire());


// Testing Acquire function
  function testUserCanAcquireLand() public {
    uint returnedId = Acquire.acquire(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Acquisition of land ID 8 should be recorded.");

  }

// Testing owner ID retrieval
  function testGetOwnerId() public {

    // Expected owner is this contract
    address expected = this;

    address owner = acquire.owners(8);

    Assert.equal(owner, expected, "Owner of land ID 8 should be recorded.");

  }



  // Testing retrieval of all owners ID's
    function testGetOwnerAddressByLandId() public {

      // Expected owner is this contract
      address expected = this;

      address[16] memory owners = acquire.getOwners();

      Assert.equal(owners[8], expected, "Owner of land ID 8 should be recorded.");

    }


}
