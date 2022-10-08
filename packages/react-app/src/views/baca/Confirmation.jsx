import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Confirmation.css";

/**
 * Confirmation screen.
 * @returns react component
 **/
function Confirmation() {
  const { pool, amount } = useParams();
  const username = "leon"; // TODO Get this from the session
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <div id="confirmation" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Contribution confirmed</h3>
          <h1>{formatter.format(amount)}</h1>
        </div>
        <footer id="screen--footer">
          <Link to={`/pool/${pool}`}>
            <span className="btn btn-lg btn-blue">Go back to dashboard</span>
          </Link>
          <h4>31 days left</h4>
        </footer>
      </div>
    </div>
  );
}

export default Confirmation;
