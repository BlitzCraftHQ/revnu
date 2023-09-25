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

    constructor(address revnuTokenAddress){
        revnuToken = RevnuToken(revnuTokenAddress);
    }

    // Struct to represent a Engagement Request entry
    struct Bounty{
        uint256 bountyId;
        string actionId;        // videoId, channelId, id, etc
        string actionType;      // like, sub, comment, etc
        uint actionCount;    // no. of likes or subscribers 
        uint actionCompleted;   // no. of likes or subscribers completed
        uint256 reward;         // total amt (no.of likes * amt quoted)
    }

    // Struct to represent details of completed requests
    struct Claim{ 
        uint256 bountyId;
        bytes32 claimHash;
    }

    mapping(uint256 => Bounty) public bountyRegistry;
    mapping(bytes32 => Claim) public claimRegistry;

    event ClaimAdded(uint256 bountyId, bytes32 claimHash);
    event BountyAdded(uint256 bountyId, string actionId, string actionType, uint actionCount, uint actionCompleted, uint256 reward);

    function createBounty(string memory _actionId, string memory _actionType, uint _actionCount, uint256 _reward) public payable{
        // check balance 
        require(revnuToken.balanceOf(msg.sender) >= _reward, "Insufficient Tokens");
        require(_actionCount != 0, "ActionCount cannot be zero");


        _bountiesCounter.increment();
        uint256 _bountyId = _bountiesCounter.current();
        bountyRegistry[_bountyId] = Bounty(_bountyId, _actionId, _actionType, _actionCount, 0, _reward);

        emit BountyAdded(_bountyId, _actionId, _actionType, _actionCount, 0, _reward);
        
        // Deposit reward tokens to contract
        revnuToken.transferFrom(msg.sender, address(this), _reward);
    }

    function claimBounty(uint256 _bountyId) public payable{
        // Check if bounty exists
        require(bountyRegistry[_bountyId].bountyId == _bountyId, "Bounty does not exist.");

        // Check if bounty is claimed
        require(bountyRegistry[_bountyId].actionCompleted < bountyRegistry[_bountyId].actionCount, "Bounty completed.");


        // Generate claimHash using bountyId and msg.sender
        bytes32 _claimHash = keccak256(abi.encodePacked(_bountyId, msg.sender));

        // Check if claimHash already exists
        require(claimRegistry[_claimHash].claimHash != _claimHash, "Bounty already claimed by user."); 

        claimRegistry[_claimHash] = Claim(_bountyId, _claimHash);
        uint256 _reward = bountyRegistry[_bountyId].reward / bountyRegistry[_bountyId].actionCount; 

        // Increment Bounty actionCompleted
        bountyRegistry[_bountyId].actionCompleted += 1;

        emit ClaimAdded(_bountyId, _claimHash); 
       
        // Transfer amt
        revnuToken.transfer(msg.sender, _reward);
    }

    function getLatestBountyId() public view returns(uint256){
        return _bountiesCounter.current();
    }
}
