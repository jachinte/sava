export function fromContractDataToAppData(contractData) {
  return {
    id: contractData.savingPoolId,
    name: contractData.name,
    individualGoal: contractData.individualGoal,
    startDate: new Date(contractData.startDate),
    endDate: new Date(contractData.endDate),
    currentSavings: contractData.currentSavings,
    savingsRewards: contractData.savingsRewards,
    numberOfContributors: contractData.numberOfContributors,
    winnerSelected: contractData.winnerSelected,
    winner: contractData.winner,
  };
}
