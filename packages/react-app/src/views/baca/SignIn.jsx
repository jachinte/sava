import React from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

/**
 * Sign in screen.
 * @param {*} yourLocalBalance balance on current network
 * @returns react component
 **/
function SignIn({ yourLocalBalance }) {
  return (
    <div id="signin" className="screen">
      <header id="signin--header">
        <div id="signin--illustration"></div>
        <h1>You're invited to join a savings group with Maria.</h1>
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
      <footer></footer>
    </div>
  );
}

export default SignIn;
