// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract YourContract {

    struct SavingPool {
        uint256 savingPoolId;
        string name;
        SavingPoolState poolState; //the pool state
        uint256 individualGoal; //the individual goal
        uint256 startDate; // the pool start date
        uint256 endDate; // the pool end date
        uint256 currentSavings; //current savings
        uint256 savingsRewards; //total savings rewards
        //uint256 claimedSavingsAmount; //total of claimed saivings
        mapping(address => uint256) contributions; //map of contributions in the saving pool per contributor
        mapping(address => bool) claimings; //map of claimings in the saving pool per contributor. True if it was claimed, false otherwise.
        uint256 numberOfContributors; //number of contributors in the pool
        bool winnerSelected; //flag to determine if the saving pool has a winner or not
        address winner; //winner of the rewards pool
    }

    enum SavingPoolState {OPEN, CLOSED}

    //Saving pools array
    SavingPool[] public savingPools;

    //Saving Pool Global Counter
    uint256 public autoincrementSavingPoolIndex; 


    constructor () payable {
        SavingPool storage firstSavingPool = savingPools.push();
        firstSavingPool.name = "Road to Devcon Bogota";
        firstSavingPool.savingPoolId = 0;
        firstSavingPool.poolState = SavingPoolState.OPEN;
        firstSavingPool.individualGoal = 100;
        firstSavingPool.startDate = 1665125434;
        firstSavingPool.endDate = 1678171834;
        firstSavingPool.currentSavings = 0;
        firstSavingPool.savingsRewards = 0;
        firstSavingPool.winnerSelected = false;
        firstSavingPool.winner = address(0);

        autoincrementSavingPoolIndex = 1; 
    }

    /**
    *@dev Create a saving pool with given name, individualGoal, startDate and endDate
    *@param name the saving pool name
    *@param individualGoal the individual savings goal
    *@param startDate the savings pool startDate
    *@param endDate the savings pool endDate
    */
    function createSavingPool(string calldata name, uint256 individualGoal, uint256 startDate, uint256 endDate) public{
        SavingPool storage newSavingPool = savingPools.push();
        newSavingPool.name = name;
        newSavingPool.savingPoolId = autoincrementSavingPoolIndex;
        newSavingPool.poolState = SavingPoolState.OPEN;
        newSavingPool.individualGoal = individualGoal;
        newSavingPool.startDate = startDate;
        newSavingPool.endDate = endDate;
        newSavingPool.currentSavings = 0;
        newSavingPool.savingsRewards = 0;
        newSavingPool.winnerSelected = false;
        newSavingPool.winner = address(0);

        autoincrementSavingPoolIndex++;
    }

    /**
    *@dev Contribute to a saving pool
    *@param savingPoolId the saving pool index
    */
    function contributeToSavingPool(uint savingPoolId) public payable {

        //Saving pool should be greater than 0
        require(msg.value > 0, "Amount should be greater than 0");

        //Get saving pool
        SavingPool storage currentSavingPool = savingPools[savingPoolId];

        require(currentSavingPool.poolState == SavingPoolState.OPEN, "The saving pool is not open");

        //Date validations
        require(block.timestamp >= currentSavingPool.startDate, "User cannot contribute before the start date");
        require(block.timestamp <= currentSavingPool.endDate, "User cannot contribute after the end date");

        //Get current contribution for user
        uint256 getCurrentContributionForUser = currentSavingPool.contributions[msg.sender];

        //User cannot contribute more than the individual goal   
        require(getCurrentContributionForUser + msg.value <= currentSavingPool.individualGoal, "User cannot contribute more than individual goal");

        //Update user contribution
        if(currentSavingPool.contributions[msg.sender] == 0){
            currentSavingPool.numberOfContributors++;
        }
        currentSavingPool.contributions[msg.sender] += msg.value;

        //Determine if this transaction makes the user a winner of the rewards pool
        if(currentSavingPool.winnerSelected == false && getMaximumAllowedContributionPerUserInPool(savingPoolId, msg.sender) == 0){
            currentSavingPool.winnerSelected = true;
            currentSavingPool.winner = msg.sender;
        }
        
        //Update total savings
        currentSavingPool.currentSavings += msg.value;

    }   

    /**
    *@dev Close a saving pool
    *@param savingPoolId the saving pool index
    */
    function closeSavingPool(uint savingPoolId) public {
        SavingPool storage currentSavingPool = savingPools[savingPoolId];

        require(currentSavingPool.poolState == SavingPoolState.OPEN, "The saving pool should be open");
        require(block.timestamp >= currentSavingPool.endDate);

        currentSavingPool.poolState = SavingPoolState.CLOSED;
    }

    /**
    *@dev Claim user savings
    *@param savingPoolId the saving pool index
    */
    function claimSavings(uint savingPoolId) public payable {
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        address payable user = payable(msg.sender);

        //Get claimable savings amout for user
        uint256 claimableSavings = getClaimableSavingsAmountPerUserInPool(savingPoolId, user);

        //Change claiming state to true
        currentSavingPool.claimings[user] = true;

        //Transfer claimable savings to user
        user.transfer(claimableSavings);

        //Update total savings claimed
        //currentSavingPool.claimedSavingsAmount += claimableSavings;
    }

    /**
    *@dev Get claimable savings amount per user in a pool
    *@param savingPoolId the saving pool index
    */
    function getClaimableSavingsAmountPerUserInPool(uint savingPoolId, address user) public view returns(uint256) {
        require(savingPools[savingPoolId].poolState == SavingPoolState.CLOSED, "The saving pool should be closed");
        require(savingPools[savingPoolId].claimings[user] == false, "User has claimed his savings before");

        uint256 claimableSavings = getUserContributionInSavingsPool(savingPoolId, user);
        
        //Add rewards if current user is the winner
        if(savingPools[savingPoolId].winner == user){
            claimableSavings += savingPools[savingPoolId].savingsRewards;
        }

        return claimableSavings;
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