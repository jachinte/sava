import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Contribution.css";

/**
 * New pool screen.
 * @returns react component
 **/
function New() {
  const [name, setName] = useState();
  const [individualGoal, setIndividualGoal] = useState(0);
  const [date, setDate] = useState(new Date());
  const id = 1;
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
        <Link to={`/pool/${id}`}>
          <span className="btn btn-lg btn-blue">Create Pool</span>
        </Link>
      </footer>
    </div>
  );
}

export default New;
