import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { daysLeft, fromContractDataToAppData } from "../helpers";
import { poolContract } from "../hooks";
import "./Contribution.css";

/**
 * Contribution screen.
 * @returns react component
 **/
function Contribution({ contract, address }) {
  const { id } = useParams();
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Make Contribution");
  const [amount, setAmount] = useState(0);
  const [pool, setPool] = useState({});
  const [maximumAllowed, setMaximumAllowed] = useState(0);
  const [currentContribution, setCurrentContribution] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setPool(fromContractDataToAppData(await poolContract.getPool(contract, id)));
      setMaximumAllowed(await poolContract.getMaximumAllowedContributionPerUserInPool(contract, id, address));
      setCurrentContribution(await poolContract.getCurrentContributionPerUserInPool(contract, id, address));
    }
    fetchData();
  }, [contract, !pool, !maximumAllowed, !currentContribution]);

  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const onClickContribute = async e => {
    if (contract) {
      setButtonDisabled(true);
      setButtonText("Processing...");
      await poolContract.contributeToSavingPool(contract, id, address, amount);
      history.push(`/confirmation/${id}/${amount}`);
    }
  };

  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/pool/${id}`} id="goback-btn"></Link>
          <h4>Contribute to your goal</h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter a contribution</h3>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <h5 className="uppercase">Maximum allowed</h5>
          <h4>{formatter.format(maximumAllowed)}</h4>
        </div>
        <div>
          <h5 className="uppercase">Current contribution</h5>
          <h4>{formatter.format(currentContribution)}</h4>
        </div>
      </div>
      <footer id="screen--footer">
        <button onClick={onClickContribute} className="btn btn-lg btn-blue" disabled={buttonDisabled}>
          {buttonText}
        </button>
        <h4>{daysLeft(pool?.startDate, pool?.endDate)} days left</h4>
      </footer>
    </div>
  );
}

export default Contribution;
