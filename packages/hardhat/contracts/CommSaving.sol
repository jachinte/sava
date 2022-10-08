// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract CommSaving {

    struct SavingPool {
        uint256 savingPoolId;
        SavingPoolState poolState; //the pool state
        uint256 individualGoal; //the individual goal
        uint256 startDate; // the pool start date
        uint256 endDate; // the pool end date
        uint256 currentSavings; //current savings
        uint256 savingsRewards; //total savings rewards
        mapping(address => uint256) contributions; //map of contributions in the saving pool per contributor
        uint256 numberOfContributors;

    }

    enum SavingPoolState {OPEN, CLOSED}

    SavingPool[] public savingPools;

    uint256 public autoincrementSavingPoolIndex; 


    constructor () payable {
        SavingPool storage firstSavingPool = savingPools.push();
        firstSavingPool.savingPoolId = 0;
        firstSavingPool.poolState = SavingPoolState.OPEN;
        firstSavingPool.individualGoal = 100;
        firstSavingPool.startDate = 1646627707000;
        firstSavingPool.endDate = 1678163707000;
        firstSavingPool.currentSavings = 0;
        firstSavingPool.savingsRewards = 0;

        autoincrementSavingPoolIndex = 1; 
    }

    function contributeToSavingPool(uint savingPoolId) public payable {

        //Saving pool should be greater than 0
        require(msg.value > 0, "Amount should be greater than 0");

        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];

        require(currentSavingPool.poolState == SavingPoolState.OPEN, "The saving pool is not open");

        //Date validations
        //require(block.timestamp >= currentSavingPool.startDate, "User cannot contribute before the start date");
        //require(block.timestamp <= currentSavingPool.endDate, "User cannot contribute after the end date");

        //Get current contribution for user
        uint256 getCurrentContributionForUser = currentSavingPool.contributions[msg.sender];

        //User cannot contribute more than the individual goal   
        require(getCurrentContributionForUser + msg.value <= currentSavingPool.individualGoal, "User cannot contribute more than individual goal");

        //Update user contribution
        if(currentSavingPool.contributions[msg.sender] == 0){
            currentSavingPool.numberOfContributors++;
        }
        currentSavingPool.contributions[msg.sender] += msg.value;
        
        //Update total savings
        currentSavingPool.currentSavings += msg.value;

    }   

    /**
    *@dev Get user contribution in savings pool
    *@param savingPoolId the saving pool index
    */
    function getUserContributionInSavingsPool(uint savingPoolId, address user) public view returns(uint256) {
        return savingPools[savingPoolId].contributions[user];
    }

    /**
    *@dev Get current savings in pool
    *@param savingPoolId the saving pool index
    */
    function getCurrentSavingsInPool(uint savingPoolId) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        return currentSavingPool.currentSavings;
    }

    /**
    *@dev Get individual goal in a pool
    *@param savingPoolId the saving pool index
    */
    function getIndividualGoalInPool(uint savingPoolId) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        
        return currentSavingPool.individualGoal;
    }

    /**
    *@dev Get number of contributors in a pool
    *@param savingPoolId the saving pool index
    */
    function getNumberOfContributors(uint savingPoolId) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        
        return currentSavingPool.numberOfContributors;
    }


    /**
    *@dev Get savings rewards in a pool
    *@param savingPoolId the saving pool index
    */
    function getSavingsRewards(uint savingPoolId) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        
        return currentSavingPool.savingsRewards;
    }
    
    /**
    *@dev Get maximum allowed contribution per user in a pool
    *@param savingPoolId the saving pool index
    *@param user the user
    */
    function getMaximumAllowedContributionPerUserInPool(uint savingPoolId, address user) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];

        uint256 currentContribution = currentSavingPool.contributions[user];
        
        return currentSavingPool.individualGoal - currentContribution;
    }

    /**
    *@dev Get current contribution per user in a pool
    *@param savingPoolId the saving pool index
    *@param user the user
    */
    function getCurrentContributionPerUserInPool(uint savingPoolId, address user) public view returns(uint256) {
        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];

        return currentSavingPool.contributions[user];        
    }


}