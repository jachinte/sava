export function daysLeft(startDate, endDate) {
  return Math.max(Math.round((endDate - startDate) / (24 * 3600)), 0);
}

export function addressAsName(address, chars = 5) {
  const length = address.length;
  return `${address.substring(0, chars)}...${address.substring(length - chars)}`;
}

export function fromContractDataToAppData(contractData) {
  return {
    id: contractData.savingPoolId,
    name: contractData.name,
    individualGoal: contractData.individualGoal,
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    currentSavings: contractData.currentSavings,
    savingsRewards: contractData.savingsRewards,
    numberOfContributors: contractData.numberOfContributors,
    winnerSelected: contractData.winnerSelected,
    winner: contractData.winner,
  };
}
