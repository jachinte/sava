import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { daysLeft, fromContractDataToAppData } from "../helpers";
import "./SignIn.css";
import "./Invitation.css";
import { poolContract } from "../hooks";

/**
 * Invitation screen.
 * @returns react component
 **/
function Invitation({ contract, address }) {
  const { pool } = useParams();
  const history = useHistory();
  const [data, setData] = useState();
  const [amount, setAmount] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Join pool");

  useEffect(() => {
    async function fetchData() {
      if (contract) {
        setData(fromContractDataToAppData(await poolContract.getPool(contract, pool)));
      }
    }
    fetchData();
  }, [contract, pool, !data]);

  const onClickJoin = async e => {
    if (contract) {
      setButtonDisabled(true);
      setButtonText("Processing...");
      await poolContract.contributeToSavingPool(contract, pool, address, amount);
      history.push(`/confirmation/${pool}/${amount}`);
    }
  };

  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div id="invitation" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/home`} id="goback-btn"></Link>
        </div>
        <h2 id="invitation-title">
          Make a contribution to join pool <b>{data?.name}</b>
        </h2>
        <div>
          <h5 className="uppercase">Goal</h5>
          <h4 className="text-light">
            Save {formatter.format(data?.individualGoal)} in {daysLeft(data?.startDate, data?.endDate)} days
          </h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter your first deposit</h3>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </div>
      <footer id="screen--footer">
        <button onClick={onClickJoin} className="btn btn-lg btn-blue" disabled={buttonDisabled}>
          {buttonText}
        </button>
      </footer>
    </div>
  );
}

export default Invitation;
