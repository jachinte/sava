import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Contribution.css";

/**
 * New pool screen.
 * @returns react component
 **/
function New() {
  const [amount, setAmount] = useState(0);
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <Link to={`/home`}>Go back.</Link>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter a contribution</h3>
          <input value={formatter.format(amount)} onChange={e => setAmount(e.target)} />
        </div>
        <div>
          <h5 className="uppercase">Maximum allowed</h5>
        </div>
        <div>
          <h5 className="uppercase">Current contribution</h5>
        </div>
      </div>
    </div>
  );
}

export default New;
