import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pool.css";
import { fromContractDataToAppData } from "../helpers";
import { poolContract } from "../hooks";

/**
 * Pool screen.
 * @returns react component
 **/
function Pool({ contract }) {
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
  const [attrs, setAttrs] = useState();

  useEffect(() => {
    async function fetchData() {
      setData(fromContractDataToAppData(await poolContract.getPool(contract, id)));
      if (data) {
        setAttrs({
          balance: data?.participants?.map(p => p.contribution).reduce((sum, elem) => sum + elem, 0),
        });
      }
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
      </header>
      <div id="screen--main">
        <div>
          <h3>Pool status and goal</h3>
          <h4>
            <b>{formatter.format(attrs?.balance)}</b>{" "}
            <span className="text-light">of {formatter.format(data?.individualGoal * data?.numberOfContributors)}</span>
          </h4>
        </div>
        <div>
          <h3>Savings rewards</h3>
          <h4>
            <b className="green-text">{formatter.format(data?.savingsRewards)}</b>
          </h4>
          <p className="green-text">First to complete contribution wins the rewards.</p>
        </div>
        <hr />
        <h5 className="uppercase">Pool Participants ({data?.numberOfContributors})</h5>
        {data?.participants?.map(participant => (
          <div key={participant.username}>
            <h3>{participant.username}'s contribution</h3>
            <h4 className="text-light">
              {formatter.format(participant.contribution)} / {formatter.format(data?.individualGoal)}
            </h4>
          </div>
        ))}
      </div>
      <footer id="screen--footer">
        <Link to={`/join/pool/${id}`}>
          <span className="btn btn-lg btn-green">Invite your friends</span>
        </Link>
        <Link to={`/contribution/pool/${id}`}>
          <span className="btn btn-lg btn-blue">Complete contribution</span>
        </Link>
        <h4>31 days left</h4>
      </footer>
    </div>
  );
}

export default Pool;
