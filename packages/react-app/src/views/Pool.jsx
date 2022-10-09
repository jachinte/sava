import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pool.css";
import { addressAsName, daysLeft, fromContractDataToAppData } from "../helpers";
import { poolContract } from "../hooks";

/**
 * Pool screen.
 * @returns react component
 **/
function Pool({ contract, address }) {
  const { id } = useParams();
  // const data = getPoolData(id);

  // const [key, setKey] = useState();
  // useEffect(() => {
  //   async function fetchData() {
  //     setKey(await web3RPC.getPrivateKey(provider));
  //   }
  //   fetchData();
  // }, []);

  const [data, setData] = useState();
  const [contributions, setContributions] = useState();

  useEffect(() => {
    async function fetchData() {
      setData(fromContractDataToAppData(await poolContract.getPool(contract, id)));
      const addresses = await poolContract.getContributorsFromPool(contract, id);
      const usersData = await Promise.all(
        addresses.map(async address => {
          const contribution = await poolContract.getCurrentContributionPerUserInPool(contract, id, address);
          return { address, value: contribution };
        }),
      );
      setContributions(usersData);
    }
    fetchData();
  }, [!data]);

  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div id="pool" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/home`} id="goback-btn"></Link>
          <h4>{data?.name}</h4>
        </div>
        <Link to={`/join/pool/${id}`} className="title-bar" style={{ marginTop: -30 }}>
          <span id="invite-btn"></span>
          <span>Invite your friends to this pool</span>
        </Link>
      </header>
      <div id="screen--main">
        <div>
          <h3>Pool status and goal</h3>
          <h4>
            <b>{formatter.format(data?.currentSavings)}</b>{" "}
            <span className="text-light">of {formatter.format(data?.individualGoal * data?.numberOfContributors)}</span>
          </h4>
        </div>
        <div>
          <h3>Savings rewards</h3>
          <h4>
            <b className="green-text">{formatter.format(data?.savingsRewards)}</b>
          </h4>
          {data?.winnerSelected ? (
            <p className="green-text">
              <span className="green-text">{addressAsName(data?.winner)}</span> has won the reward for fulfilling his
              commitment first.
            </p>
          ) : (
            <p className="green-text">First to complete contribution wins the rewards.</p>
          )}
        </div>
        <hr />
        <h5 className="uppercase">Pool Participants ({data?.numberOfContributors})</h5>
        {contributions?.map(contribution => (
          <div key={contribution.address}>
            <h3>
              {addressAsName(contribution.address)}
              {contribution.address === address ? " (me)" : ""}
              {contribution.address === data?.winner ? " ⭐" : ""}
            </h3>
            <h4>
              {formatter.format(contribution.value)}{" "}
              <span className="text-light">/ {formatter.format(data?.individualGoal)}</span>
            </h4>
          </div>
        ))}
      </div>
      <footer id="screen--footer">
        <Link to={`/contribution/pool/${id}`}>
          <span className="btn btn-lg btn-blue">Contribute to this pool</span>
        </Link>
        <h4>{daysLeft(data?.startDate, data?.endDate)} days left</h4>
      </footer>
    </div>
  );
}

export default Pool;
