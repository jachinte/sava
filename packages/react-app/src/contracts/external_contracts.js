const SAVINGSABI = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ClaimResponse",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "claimSavings",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "contributeToSavingPool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "individualGoal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
    ],
    name: "createSavingPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "autoincrementSavingPoolIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getClaimableSavingsAmountPerUserInPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "getContributorsInPool",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getCurrentContributionPerUserInPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "getCurrentSavingsInPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "getIndividualGoalInPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getLastPoolIndexPerCreator",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getMaximumAllowedContributionPerUserInPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "getNumberOfContributors",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getSavingPoolsIndexesPerUser",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
    ],
    name: "getSavingsRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getTotalPoolsPerUser",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserContributionInSavingsPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "poolsPerCreator",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "savingPools",
    outputs: [
      {
        internalType: "uint256",
        name: "savingPoolId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "individualGoal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentSavings",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "savingsRewards",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberOfContributors",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "winnerSelected",
        type: "bool",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

module.exports = {
  1: {
    contracts: {
      SavingsPool: {
        address: "0x23aEbE528C2ef0C269418d72F5F344B13cA74DED",
        abi: SAVINGSABI,
      },
    },
  },
};
