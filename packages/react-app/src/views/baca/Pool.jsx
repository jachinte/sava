import React from "react";
import { Link, useParams } from "react-router-dom";

/**
 * Pool screen.
 * @returns react component
 **/
function Pool() {
  let { id } = useParams();
  return (
    <div className="screen">
      <div>
        <h1>Pool No. {id}</h1>
        <Link to="/home">Go to back to the home screen.</Link>
      </div>
    </div>
  );
}

export default Pool;
