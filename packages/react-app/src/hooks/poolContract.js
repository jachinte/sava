import Web3 from "web3";

const poolContract = (() => {
  const contributeToSavingPool = async (contract, index, address, amount) => {
    return await contract.methods.contributeToSavingPool(index).send({ from: address, value: amount });
  };

  const getUserPools = async (contract, address) => {
    const response = await contract.methods.getSavingPoolsIndexesPerUser(address).call();
    const rpools = await Promise.all(
      response.map(async index => {
        return await contract.methods.savingPools(index).call();
      }),
    );
    return rpools;
  };

  const getPool = async (contract, index) => {
    return await contract.methods.savingPools(index).call();
  };

  const getContributorsFromPool = async (contract, index) => {
    const response = await contract.methods.getContributorsInPool(index).call();
    return response;
  };

  const getCurrentContributionPerUserInPool = async (contract, index, address) => {
    const response = await contract.methods.getCurrentContributionPerUserInPool(index, address).call();
    return response;
  };

  const getMaximumAllowedContributionPerUserInPool = async (contract, index, address) => {
    const response = await contract.methods.getMaximumAllowedContributionPerUserInPool(index, address).call();
    return response;
  };

  return {
    contributeToSavingPool,
    getUserPools,
    getPool,
    getContributorsFromPool,
    getCurrentContributionPerUserInPool,
    getMaximumAllowedContributionPerUserInPool,
  };
})();

export default poolContract;
