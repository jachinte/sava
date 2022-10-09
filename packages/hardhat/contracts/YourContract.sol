// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

interface AddressesProvider {
    function getPool()
    external
    view
    returns (address);
}

interface WETHGateway {
    function depositETH(address lendingPool, address onBehalfOf, uint16 referralCode)
    external
    payable;
    
    function withdrawETH(address lendingPool, uint256 amount, address to)
    external;
}

interface AToken {
  function balanceOf(address _user) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transfer(address receiver, uint256 amount) external returns (bool);
}

contract YourContract {

    struct SavingPool {
        uint256 savingPoolId;
        string name;
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
        address [] contributors;
    }

    //Saving pools array
    SavingPool[] public savingPools;

    //Saving Pool Global Counter
    uint256 public autoincrementSavingPoolIndex; 

    address public supplyTokenAddress = 0x0000000000000000000000000000000000001010; // Mumbai Aave MATIC
    address public aavePoolAddress = 0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B; // Mumbai Aave Pool Address
    address public lendingPoolAddressProvider;
    address public wETHGateway;
    address public wETHToken;

    constructor (
        address _lendingPoolAddressProvider,
        address _wETHGateway,
        address _wETHToken
    ) payable {
        SavingPool storage firstSavingPool = savingPools.push();
        firstSavingPool.name = "Road to Devcon Bogota";
        firstSavingPool.savingPoolId = 0;
        firstSavingPool.individualGoal = 100;
        firstSavingPool.startDate = 1665125434;
        firstSavingPool.endDate = 1678171834;
        firstSavingPool.currentSavings = 0;
        firstSavingPool.savingsRewards = 0;
        firstSavingPool.winnerSelected = false;
        firstSavingPool.winner = address(0);

        autoincrementSavingPoolIndex = 1;
        lendingPoolAddressProvider = _lendingPoolAddressProvider;
        wETHGateway = _wETHGateway;
        wETHToken = _wETHToken;
    }

    /**
    *@dev Create a saving pool with given name, individualGoal, startDate and endDate
    *@param name the saving pool name
    *@param individualGoal the individual savings goal
    *@param startDate the savings pool startDate
    *@param endDate the savings pool endDate
    */
    function createSavingPool(string calldata name, uint256 individualGoal, uint256 startDate, uint256 endDate) public returns (uint256){
        SavingPool storage newSavingPool = savingPools.push();
        newSavingPool.name = name;
        newSavingPool.savingPoolId = autoincrementSavingPoolIndex;
        newSavingPool.individualGoal = individualGoal;
        newSavingPool.startDate = startDate;
        newSavingPool.endDate = endDate;
        newSavingPool.currentSavings = 0;
        newSavingPool.savingsRewards = 0;
        newSavingPool.winnerSelected = false;
        newSavingPool.winner = address(0);

        autoincrementSavingPoolIndex++;

        return newSavingPool.savingPoolId;
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
            currentSavingPool.contributors.push(msg.sender);
        }

        currentSavingPool.contributions[msg.sender] += msg.value;

        //Determine if this transaction makes the user a winner of the rewards pool
        if(currentSavingPool.winnerSelected == false && getMaximumAllowedContributionPerUserInPool(savingPoolId, msg.sender) == 0){
            currentSavingPool.winnerSelected = true;
            currentSavingPool.winner = msg.sender;
        }
        
        //Update total savings
        currentSavingPool.currentSavings += msg.value;

        //Deposit savings to aave
        address lendingPool = AddressesProvider(lendingPoolAddressProvider).getPool();
        WETHGateway(wETHGateway).depositETH{value:msg.value}(lendingPool, address(this), 0);

    }   


    /*function supplyToYieldProvider(uint amount) public returns (bool) {

        // Retrieve LendingPool address
        //LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        //LendingPool lendingPool = LendingPool(provider.getLendingPool());

        // Input variables
        //address daiAddress = address(0x6B175474E89094C44Da98b954EedeAC495271d0F); // mainnet DAI
        //uint256 amountToTransfer = 1000 * 1e18;
        //uint16 referral = 0;

        // Approve LendingPool contract to move your DAI
        //IERC20(daiAddress).approve(provider.getLendingPoolCore(), amountToTransfer);

        // Deposit 1000 DAI
        //lendingPool.deposit(daiAddress, amountToTransfer, referral);

    }*/

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

        //Withdraw claimable savings from aave
        address lendingPool = AddressesProvider(lendingPoolAddressProvider).getPool();
        require(AToken(wETHToken).approve(wETHGateway,claimableSavings), "aToken approval failed");
        WETHGateway(wETHGateway).withdrawETH(lendingPool,claimableSavings,user);

        //Update total savings claimed
        //currentSavingPool.claimedSavingsAmount += claimableSavings;
    }

    /**
    *@dev Get claimable savings amount per user in a pool
    *@param savingPoolId the saving pool index
    */
    function getClaimableSavingsAmountPerUserInPool(uint savingPoolId, address user) public view returns(uint256) {
        require(savingPools[savingPoolId].claimings[user] == false, "User has claimed his savings before");

        uint256 claimableSavings = getUserContributionInSavingsPool(savingPoolId, user);
        
        //Add rewards if current user is the winner
        if(savingPools[savingPoolId].winner == user){
            claimableSavings += getSavingsRewards(savingPoolId);
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


    function getTotalSavings() public view returns(uint256) {

        uint256 totalSavings = 0;

        for(uint i = 0; i < savingPools.length; i++){
            SavingPool storage currentSavingPool = savingPools[i];
            totalSavings = totalSavings + currentSavingPool.currentSavings;
        }

        return totalSavings;
    }

    /**
    *@dev Get savings rewards in a pool
    *@param savingPoolId the saving pool index
    */
    function getSavingsRewards(uint savingPoolId) public view returns(uint256) {

        uint256 totalSavings = getTotalSavings();
        uint256 wETHTokenBalance = AToken(wETHToken).balanceOf(address(this));
        uint256 totalSavingsRewards = wETHTokenBalance - totalSavings;
        SavingPool storage currentSavingPool = savingPools[savingPoolId];
        uint256 savingsRewards = (totalSavingsRewards*currentSavingPool.currentSavings)/totalSavings;
        
        return savingsRewards;
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

    /**
    *@dev Get saving pools indexes per user
    *@param user the user
    */
    function getSavingPoolsIndexesPerUser(address user) public view returns(uint256 [] memory){
        uint256 poolsPerUser = getTotalPoolsPerUser(user);

        uint256[] memory indexes = new uint256[](poolsPerUser);

        uint j = 0;

        for(uint i = 0; i < savingPools.length; i++){
            SavingPool storage currentSavingPool = savingPools[i];
            if(currentSavingPool.contributions[user] > 0){
                indexes[j] = i;
                j++;
            }
        }

      return indexes;
    }

    /**
    *@dev Get number of pool where user is participating and is open
    *@param user address
    *
    */
    function getTotalPoolsPerUser(address user) public view returns (uint256){

        uint counter = 0;
        for(uint i = 0; i < savingPools.length; i++){
            SavingPool storage currentSavingPool = savingPools[i];
            if(currentSavingPool.contributions[user] > 0){
                counter++;
            }
        }

        return counter;
    }

    /**
    *@dev Get contributors in a pool
    *@param savingPoolId the saving pool id
    *
    */
    function getContributorsInPool(uint savingPoolId) public view returns (address[] memory){
        return savingPools[savingPoolId].contributors;
    }

}