import React from "react";
import { Link, useParams } from "react-router-dom";
import { getPoolData } from "../helpers";
import "./SignIn.css";
import "./Invitation.css";

/**
 * Invitation screen.
 * @returns react component
 **/
function Invitation() {
  const { pool } = useParams();
  const data = getPoolData(pool);
  return (
    <div id="signin" className="screen">
      <header id="signin--header">
        <div id="signin--illustration"></div>
        <div className="title-bar">
          <Link to={`/home`} id="goback-btn"></Link>
        </div>
        <h2 id="invitation-title">
          You're invited to join pool <b>{data.name}</b>
        </h2>
      </header>
      <div id="signin--main">
        <div className="signin--main-title">
          Login
          <br />
          With
        </div>
        <nav className="signin--buttons">
          <Link to="/pool">
            <span className="signin--btn signin--btn-facebook"></span>
          </Link>
          <Link to="/pool">
            <span className="signin--btn signin--btn-google"></span>
          </Link>
        </nav>
      </div>
      <footer id="signin--footer"></footer>
    </div>
  );
}

export default Invitation;
