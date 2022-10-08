import React from "react";
import { Link } from "react-router-dom";

/**
 * Sign in screen.
 * @param {*} yourLocalBalance balance on current network
 * @returns react component
 **/
function SignIn({ yourLocalBalance }) {
  return (
    <div>
      Hello there. <Link to="/pool">Go to the pool screen.</Link>
    </div>
  );
}

export default SignIn;
