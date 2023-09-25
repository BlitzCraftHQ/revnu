// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import OpenZeppelin ERC20 and Ownable for token and contract ownership management
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RevnuToken.sol";

// Hardhat console.log() for debugging
// import "hardhat/console.sol";

contract RevnuRegistry{
    using Counters for Counters.Counter;

    RevnuToken public revnuToken;

    Counters.Counter public _bountiesCounter;
    Counters.Counter public _claimsCounter;

    constructor(address revnuTokenAddress){
        revnuToken = RevnuToken(revnuTokenAddress);
    }

    // Struct to represent a Engagement Request entry
    struct Bounty{
        uint256 bountyId;
        string actionId;        // videoId, channelId, id, etc
        string actionType;      // like, sub, comment, etc
        uint actionCount;    // no. of likes or subscribers 
        uint256 reward;         // total amt (no.of likes * amt quoted)
    }

    // Struct to represent details of completed requests
    struct Claim{
        uint256 claimId;
        uint256 bountyId;
        string proof;
    }

    mapping(uint256 => Bounty) public bountyRegistry;  
    mapping(uint256 => Claim) public claimRegistry;

    event ClaimAdded(uint256 claimId, uint256 bountyId, string _proof);
    event BountyAdded(uint256 bountyId, string actionId, string actionType, uint actionCount, uint256 reward);

    function createBounty(string memory _actionId, string memory _actionType, uint _actionCount, uint256 _reward) public payable{
        // check balance 
        require(revnuToken.balanceOf(msg.sender) >= _reward, "Insufficient Tokens");

        _bountiesCounter.increment();
        uint256 _bountyId = _bountiesCounter.current();
        bountyRegistry[_bountyId] = Bounty(_bountyId, _actionId, _actionType, _actionCount, _reward);

        // transfer amt
        revnuToken.transferFrom(msg.sender, address(this), _reward);

        emit BountyAdded(_bountyId, _actionId, _actionType, _actionCount, _reward);
    }

    function claimBounty(uint256 _bountyId, string memory _proof) public payable{
        _claimsCounter.increment();
        uint256 _claimId = _claimsCounter.current();
        claimRegistry[_claimId] = Claim(_claimId, _bountyId, _proof);

        // // Hardhat log reward and actionCount
        // console.log("Bounty: %s", bountyRegistry[_bountyId].bountyId);
        // console.log("Reward: %s", bountyRegistry[_bountyId].reward);
        // console.log("Action Count: %s", bountyRegistry[_bountyId].actionCount);
        require(bountyRegistry[_bountyId].actionCount != 0, "ActionCount cannot be zero");
        uint256 _reward = bountyRegistry[_bountyId].reward / bountyRegistry[_bountyId].actionCount;
        // console.log("Reward per action: %s", _reward);

        // Transfer amt
        revnuToken.transfer(msg.sender, _reward);
        emit ClaimAdded(_claimId, _bountyId, _proof); 
    }

    function getLatestBountyId() public view returns(uint256){
        return _bountiesCounter.current();
    }

    function getLatestClaimId() public view returns(uint256){
        return _claimsCounter.current();
    }
}
