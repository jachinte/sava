const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 });

export function ethToWei(amount) {
  return amount * Math.pow(10, 18);
}

export function weiToEth(amount) {
  return amount / Math.pow(10, 18);
}

export function weiToEthFormatted(amount) {
  return formatter.format(weiToEth(amount));
}

export function daysLeft(startDate, endDate) {
  return Math.max(Math.round((endDate - startDate) / (24 * 3600)), 0);
}

export function daysLeftStr(startDate, endDate) {
  const days = daysLeft(startDate, endDate);
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
