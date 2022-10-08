import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import contracts from "../contracts/external_contracts";
import RPC from "../hooks/web3RPC";
import poolContract from "../hooks/poolContract";
import "./Home.css";

const pools = [
  {
    id: 1,
    name: "Trip to Cartagena!",
    goal: 1000,
    currency: "USDC",
    days: 31,
    winnerSelected: false,
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
  {
    id: 2,
    name: "Trip to Canada!",
    goal: 1000,
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
];

function PoolItem({ data }) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  const winnerSpan = (
    <span className="green-text">
      This savings pool has ended. <b>{data.winner}</b> has won the reward for fulfilling his commitment first.
    </span>
  );
  const openButton = (
    <Link to={`/pool/${data.id}`}>
      <span className="btn btn-lg btn-blue">Enter pool</span>
    </Link>
  );
  return (
    <div className="pool-item">
      <header>
        <h4>{data.name}</h4>
        <p>
          Save{" "}
          <b>
            {formatter.format(data.individualGoal)} {data.currency}
          </b>{" "}
          in <b>{Math.round((data.endDate - data.startDate) / (24 * 3600))} days</b>.
        </p>
      </header>
      {data.participants ? (
        <div>
          <h5 className="uppercase">Pool participants ({data.participants.length})</h5>
          <ul className="screen--user-list">
            {data.participants.map(participant => (
              <li ket={participant.username}>
                <img alt={participant.username} src={participant.avatar} />
                <span className="uppercase">
                  <b>{participant.username}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      {data.winnerSelected ? winnerSpan : openButton}
    </div>
  );
}

/**
 * Home screen.
 * @returns react component
 **/
function Home({ provider, userInfo }) {
  const [address, setAddress] = useState();
  const [contract, setContract] = useState();
  const [userPools, setUserPools] = useState();

  useEffect(() => {
    async function fetchData() {
      if (provider) {
        setAddress(await RPC.getAccounts(provider));
        const web3 = new Web3(provider);
        const SavingsPool = contracts[1].contracts.SavingsPool;
        setContract(new web3.eth.Contract(SavingsPool.abi, SavingsPool.address));
      }
    }
    fetchData();
  }, [provider]);

  useEffect(() => {
    async function fetchData() {
      if (contract) {
        setUserPools(await poolContract.getUserPools(contract, address));
      }
    }
    fetchData();
  }, [address, contract]);

  return (
    <div id="home" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <h1 id="screen--title">Welcome back, {userInfo.name.split(" ")[0]}!</h1>
      </header>
      <div id="screen--main">
        <h3>Your existing pools</h3>
        {userPools ? userPools.map(pool => <PoolItem key={pool["0"]} data={pool} />) : <div></div>}
      </div>
      <footer id="screen--footer">
        <Link to="/new">
          <div id="footer-btn">
            <div className="btn-group">
              <span className="btn-label">Add a new pool</span> <span className="btn-add btn-blue">+</span>
            </div>
          </div>
        </Link>
      </footer>
    </div>
  );
}

export default Home;
