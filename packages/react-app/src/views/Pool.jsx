import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pool.css";
import { addressAsName, daysLeftStr, fromContractDataToAppData } from "../helpers";
import { poolContract } from "../hooks";

/**
 * Pool screen.
 * @returns react component
 **/
function Pool({ contract, address }) {
  const { id } = useParams();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Claim your funds");

  const [data, setData] = useState();
  const [contributions, setContributions] = useState([]);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [savingsCompleted, setSavingsCompleted] = useState(false);
  const [poolEnded, setPoolEnded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!contract) {
        return;
      }
      setData(fromContractDataToAppData(await poolContract.getPool(contract, id)));
      const addresses = await poolContract.getContributorsFromPool(contract, id);
      const usersData = await Promise.all(
        addresses.map(async address => {
          const contribution = await poolContract.getCurrentContributionPerUserInPool(contract, id, address);
          return { address, value: contribution };
        }),
      );
      setContributions(usersData);
      setClaimableAmount(await poolContract.getClaimableSavingsAmountPerUserInPool(contract, id, address));
    }
    fetchData();
  }, [contract, address, !data]);

  useEffect(() => {
    let completed = false;
    contributions.forEach(contribution => {
      if (contribution.address === address) {
        completed = contribution.value === data?.individualGoal;
      }
    });
    setSavingsCompleted(completed);
    setPoolEnded(new Date() > new Date(data?.endDate * 1000));
  }, [address, data, contributions]);

  const claimSavings = async e => {
    if (contract && address) {
      setButtonDisabled(true);
      setButtonText("Processing...");
      await poolContract.claimSavings(contract, id, address);
      setButtonText("Savings deposited");
    }
  };

  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div id="pool" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/home`} id="goback-btn"></Link>
          <h4>{data?.name}</h4>
        </div>
        <Link to={`/join/pool/${id}`} className="title-bar" style={{ marginTop: -30 }}>
          <span id="invite-btn"></span>
          <span>Invite your friends to this pool</span>
        </Link>
      </header>
      <div id="screen--main">
        <div>
          <h3>Pool status and goal</h3>
          <h4>
            <b>{formatter.format(data?.currentSavings)}</b>{" "}
            <span className="text-light">of {formatter.format(data?.individualGoal * data?.numberOfContributors)}</span>
          </h4>
        </div>
        <div>
          <h3>Savings rewards</h3>
          <h4>
            <b className="green-text">{formatter.format(data?.savingsRewards)}</b>
          </h4>
          {data?.winnerSelected && data?.winner === address && (
            <p className="green-text">
              <b>You</b> won the reward for fulfilling your commitment first.
            </p>
          )}
          {data?.winnerSelected && data?.winner !== address && (
            <p className="green-text">
              <b>{addressAsName(data?.winner)}</b> has won the reward for fulfilling his commitment first.
            </p>
          )}
          {!data?.winnerSelected && <p className="green-text">First to complete contribution wins the rewards.</p>}
        </div>
        <hr />
        <h5 className="uppercase">Pool Participants ({data?.numberOfContributors})</h5>
        {contributions?.map(contribution => (
          <div key={contribution.address}>
            <h3>
              {addressAsName(contribution.address)}
              {contribution.address === address ? " (me)" : ""}
              {contribution.address === data?.winner ? " ⭐" : ""}
            </h3>
            <h4>
              {formatter.format(contribution.value)}{" "}
              <span className="text-light">/ {formatter.format(data?.individualGoal)}</span>
            </h4>
          </div>
        ))}
      </div>
      <footer id="screen--footer">
        {!poolEnded && savingsCompleted && <span className="btn btn-lg btn-disabled">You made it!</span>}
        {!poolEnded && !savingsCompleted && (
          <Link to={`/contribution/pool/${id}`}>
            <span className="btn btn-lg btn-blue">Contribute to this pool</span>
          </Link>
        )}
        {poolEnded && claimableAmount > 0 && (
          <button onClick={claimSavings} disabled={buttonDisabled} className="btn btn-lg btn-green">
            {buttonText}
          </button>
        )}
        {poolEnded && claimableAmount === 0 && (
          <button disabled={true} className="btn btn-lg btn-disabled">
            Savings deposited
          </button>
        )}
        <h4>{poolEnded ? "The pool has ended." : daysLeftStr(data?.startDate, data?.endDate)}</h4>
      </footer>
    </div>
  );
}

export default Pool;
