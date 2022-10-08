import React from "react";
import { Link, useParams } from "react-router-dom";
import "./Contribution.css";

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
 * Contribution screen.
 * @returns react component
 **/
function Contribution() {
  const { id } = useParams();
  const username = "leon"; // TODO Get this from the session
  const data = getPoolData(id);
  const balance = data.participants.map(p => p.contribution).reduce((sum, elem) => sum + elem, 0);
  const individualGoal = data.goal / data.participants.length;
  const maximumAllowed = individualGoal - balance;
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <Link to={`/pool/${id}`}>Go back.</Link>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter a contribution</h3>
        </div>
        <div>
          <h5 className="uppercase">Maximum allowed</h5>
          <span>{formatter.format(maximumAllowed)}</span>
        </div>
        <div>
          <h5 className="uppercase">Current contribution</h5>
          <span>{formatter.format(balance)}</span>
        </div>
      </div>
      <footer id="screen--footer">
        <Link to="/">
          <span className="btn btn-lg btn-blue">Make Contribution</span>
        </Link>
        <h4>31 days left</h4>
      </footer>
    </div>
  );
}

export default Contribution;
