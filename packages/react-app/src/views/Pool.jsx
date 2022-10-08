import React from "react";
import { Link, useParams } from "react-router-dom";
import "./Pool.css";

function getPoolData(id) {
  return {
    id: 1,
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
  };
}

/**
 * Pool screen.
 * @returns react component
 **/
function Pool() {
  const { id } = useParams();
  const data = getPoolData(id);
  const balance = data.participants.map(p => p.contribution).reduce((sum, elem) => sum + elem, 0);
  const individualGoal = data.goal / data.participants.length;
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <div id="pool" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/home`} id="goback-btn"></Link>
          <h4>{data.name}</h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Pool status and goal</h3>
          <h4>
            <b>{formatter.format(balance)}</b> <span className="text-light">of {formatter.format(data.goal)}</span>
          </h4>
        </div>
        <div>
          <h3>Savings rewards</h3>
          <h4>
            <b className="green-text">{formatter.format(data.rewards)}</b>
          </h4>
          <p className="green-text">First to complete contribution wins the rewards.</p>
        </div>
        <hr />
        <h5 className="uppercase">Pool Participants ({data.participants.length})</h5>
        {data.participants.map(participant => (
          <div key={participant.username}>
            <h3>{participant.username}'s contribution</h3>
            <h4 className="text-light">
              {formatter.format(participant.contribution)} / {formatter.format(individualGoal)}
            </h4>
          </div>
        ))}
      </div>
      <footer id="screen--footer">
        <Link to={`/contribution/pool/${id}`}>
          <span className="btn btn-lg btn-blue">Complete Contribution</span>
        </Link>
        <h4>31 days left</h4>
      </footer>
    </div>
  );
}

export default Pool;
