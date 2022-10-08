export function getPoolData(id) {
  return {
    0: {
      id: 0,
      name: "Trip to Cartagena!",
      goal: 1000,
      rewards: 14.121,
      currency: "USDC",
      days: 31,
      participants: [
        {
          username: "Leon",
          avatar: "/images/leon.png",
          contribution: 410,
        },
        {
          username: "Jose",
          avatar: "/images/jose.png",
          contribution: 101,
        },
      ],
    },
    1: {
      id: 1,
      name: "Trip to Canada!",
      goal: 1000,
      rewards: 12.34,
      currency: "USDC",
      days: 31,
      winnerSelected: true,
      winner: "Jose",
      participants: [
        {
          username: "Leon",
          avatar: "/images/leon.png",
          contribution: 410,
        },
        {
          username: "Jose",
          avatar: "/images/jose.png",
          contribution: 101,
        },
      ],
    },
    2: {
      id: 2,
      name: "Metallica concert in Rio",
      goal: 650,
      rewards: 0,
      currency: "USDC",
      days: 22,
      winnerSelected: false,
      participants: [
        {
          username: "Miguel",
          avatar: "/images/leon.png",
          contribution: 0,
        },
      ],
    },
  }[id];
}
