pragma solidity ^0.4.17;

contract Acquire {

  address[16] public owners;

  function acquire(uint landId) public returns (uint) {
    require(landId >= 0 && landId <= 15);

    owners[landId] = msg.sender;

    return landId;

  }


  function getOwners() public view returns (address[16]) {
      return owners;
  }


}
