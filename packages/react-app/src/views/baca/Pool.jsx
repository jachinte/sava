import React from "react";
import { Link } from "react-router-dom";

/**
 * Pool screen.
 * @param {*} yourLocalBalance balance on current network
 * @returns react component
 **/
function Pool({ yourLocalBalance }) {
  return (
    <div>
      <Link to="/">Go to back to the sign in screen.</Link>
    </div>
  );
}

export default Pool;
