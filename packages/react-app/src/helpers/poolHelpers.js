export function daysLeft(startDate, endDate) {
  return Math.max(Math.round((endDate - startDate) / (24 * 3600)), 0);
}

export function daysLeftStr(startDate, endDate) {
  const days = Math.max(Math.round((endDate - startDate) / (24 * 3600)), 0);
  const s = days === 1 ? "" : "s";
  return `${days} day${s} left`;
}

export function addressAsName(address, chars = 5) {
  if (!address) {
    return "";
  }

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
