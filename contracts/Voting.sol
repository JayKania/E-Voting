// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Voting {
    
    
    mapping( uint => bool) voted;
    mapping( uint => string) votedTo;
    
    event voteTransfered(uint from, string to);
    
    struct Candidate{
        string name;
        uint256 no_of_votes;
    }
    
    Candidate c0;
    Candidate c1;
    Candidate c2;
    
    constructor() public {
        c0 = Candidate("jay_0", 0);
        c1 = Candidate("jay_1", 0);
        c2 = Candidate("jay_2", 0);
    }
    
    function voteJay_0(uint _name) public{
        require(!checkVote(_name), "Already Voted!");
        casteVote(_name);
        votedTo[_name] = c0.name;
        c0.no_of_votes++;
        emit voteTransfered(_name, c0.name);
    }
    function voteJay_1( uint _name) public{
        require(!checkVote(_name), "Already Voted!");
        casteVote(_name);
        votedTo[_name] = c1.name;
        c1.no_of_votes++;
        emit voteTransfered(_name, c1.name);
    }
    function voteJay_2( uint _name) public{
        require(!checkVote(_name), "Already Voted!");
        casteVote(_name);
        votedTo[_name] = c2.name;
        c2.no_of_votes++;
        emit voteTransfered(_name, c2.name);
    }
    
    
    
    function votesOfJay_0() public view returns(uint)  {
        return c0.no_of_votes;
    }
    function votesOfJay_1() public view returns(uint)  {
        return c1.no_of_votes;
    }
    function votesOfJay_2() public view returns(uint)  {
        return c2.no_of_votes;
    }
    
    
    
    function casteVote( uint _name) internal{
        voted[_name] = true;
    }
    function checkVote( uint _name) public view returns(bool) {
        return voted[_name];
    }
    function optedCandidate( uint _name) public view returns(string memory) {
        return votedTo[_name];
    }
}