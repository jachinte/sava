import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { daysLeftStr, fromContractDataToAppData, weiToEthFormatted } from "../helpers";
import { poolContract } from "../hooks";
import "./Confirmation.css";

/**
 * Confirmation screen.
 * @returns react component
 **/
function Confirmation({ contract }) {
  const { pool, amount } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      setData(fromContractDataToAppData(await poolContract.getPool(contract, pool)));
    }
    fetchData();
  }, [contract, !data]);

  return (
    <div id="confirmation" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Contribution confirmed</h3>
          <h1>{weiToEthFormatted(amount)}</h1>
        </div>
        <footer id="screen--footer">
          <Link to={`/pool/${pool}`}>
            <span className="btn btn-lg btn-blue">Go back to dashboard</span>
          </Link>
          <h4>{daysLeftStr(data?.startDate, data?.endDate)}</h4>
        </footer>
      </div>
    </div>
  );
}

export default Confirmation;
