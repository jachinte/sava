import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { poolContract } from "../hooks";
import "./Contribution.css";

/**
 * New pool screen.
 * @returns react component
 **/
function New({ contract, address }) {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Create pool");

  const [name, setName] = useState("");
  const [individualGoal, setIndividualGoal] = useState(0);
  const [date, setDate] = useState("");

  const create = async e => {
    if (contract) {
      setButtonDisabled(true);
      setButtonText("Processing...");
      const endDate = new Date(date).getTime();
      const response = await poolContract.createSavingPool(contract, address, name, individualGoal, endDate);
      console.log("response", response);
      const id = 0;
      history.push(`/join/pool/${id}`);
    }
  };

  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={"/home"} id="goback-btn"></Link>
          <h4>Create a new pool</h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Pool name</h3>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <h3>Individual goal</h3>
          <input type="number" value={individualGoal} onChange={e => setIndividualGoal(e.target.value)} />
        </div>
        <div>
          <h3>Target date</h3>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
      <footer id="screen--footer">
        <button onClick={create} className="btn btn-lg btn-blue" disabled={buttonDisabled}>
          {buttonText}
        </button>
      </footer>
    </div>
  );
}

export default New;
