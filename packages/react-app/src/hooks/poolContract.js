import Web3 from "web3";

const poolContract = (() => {
  const getUserPools = async (contract, address) => {
    const response = await contract.methods.getSavingPoolsIndexesPerUser(address).call();
    const rpools = await Promise.all(
      response.map(async index => {
        return await contract.methods.savingPools(index).call();
      }),
    );
    return rpools;
  };

  const getContributorsFromPool = async (contract, index) => {
    const response = await contract.methods.getContributorsInPool(index).call();
    return response;
  };

  return {
    getUserPools,
    getContributorsFromPool,
  };
})();

export default poolContract;
