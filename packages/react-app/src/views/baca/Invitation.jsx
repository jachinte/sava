import React from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import "./Invitation.css";

/**
 * Invitation screen.
 * @param {*} author The creator of the pool
 * @returns react component
 **/
function Invitation({ author }) {
  return (
    <div id="signin" className="screen">
      <header id="signin--header">
        <div id="signin--illustration"></div>
        <h1 id="invitation-title">You're invited to join a savings group with {author}.</h1>
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
