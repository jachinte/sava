import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Contribution.css";

/**
 * Contribution screen.
 * @returns react component
 **/
function Contribution() {
  const { id } = useParams();
  const [amount, setAmount] = useState(0);
  const username = "leon"; // TODO Get this from the session
  const individualGoal = 500;
  const balance = 410;
  const maximumAllowed = individualGoal - balance;
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/pool/${id}`} id="goback-btn"></Link>
          <h4>Contribute to your goal</h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter a contribution</h3>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <h5 className="uppercase">Maximum allowed</h5>
          <h4>{formatter.format(maximumAllowed)}</h4>
        </div>
        <div>
          <h5 className="uppercase">Current contribution</h5>
          <h4>{formatter.format(balance)}</h4>
        </div>
      </div>
      <footer id="screen--footer">
        <Link to={`/confirmation/${id}/${amount}`}>
          <span className="btn btn-lg btn-blue">Make Contribution</span>
        </Link>
        <h4>31 days left</h4>
      </footer>
    </div>
  );
}

export default Contribution;
