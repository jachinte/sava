import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { poolContract } from "../hooks";
import { addressAsName, daysLeft, weiToEthFormatted } from "../helpers";
import "./Home.css";

function PoolItem({ data, address }) {
  if (!data || !address) {
    return;
  }

  return (
    <div className="pool-item">
      <header>
        <h4>{data.name}</h4>
        <p>
          Save{" "}
          <b>
            {weiToEthFormatted(data.individualGoal)} {data.currency}
          </b>{" "}
          in <b>{daysLeft(data.startDate, data.endDate)} days</b>.
        </p>
      </header>
      {data.participants ? (
        <div>
          <h5 className="uppercase">Pool participants ({data.participants.length})</h5>
          <ul className="screen--user-list">
            {data.participants.map(participant => (
              <li ket={participant}>
                <img alt={participant} src="/images/avatar.jpg" />
                <span>
                  <b className="uppercase">{addressAsName(participant)}</b>
                  {address === participant ? " (me)" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      {data.winnerSelected && data.winner === address && (
        <span className="green-text">
          <b>You</b> won the reward for fulfilling your commitment first.
        </span>
      )}
      {data.winnerSelected && data.winner !== address && (
        <span className="green-text">
          <b>{addressAsName(data.winner)}</b> has won the reward for fulfilling his commitment first.
        </span>
      )}
      <Link to={`/pool/${data["0"]}`}>
        <span className="btn btn-lg btn-blue">Enter pool</span>
      </Link>
    </div>
  );
}

/**
 * Home screen.
 * @returns react component
 **/
function Home({ address, contract }) {
  const [userPools, setUserPools] = useState();

  useEffect(() => {
    async function fetchData() {
      if (contract) {
        let rpools = await poolContract.getUserPools(contract, address);
        rpools = await Promise.all(
          rpools.map(async p => {
            p.participants = await poolContract.getContributorsFromPool(contract, p["0"]);
            return p;
          }),
        );
        setUserPools(rpools);
      }
    }
    fetchData();
  }, [address, contract, !userPools]);

  return (
    <div id="home" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <h1 id="screen--title">Welcome back, {addressAsName(address)}!</h1>
      </header>
      <div id="screen--main">
        {userPools && userPools.length > 0 ? (
          <>
            <h3>Your existing pools</h3>
            {userPools.map(pool => (
              <PoolItem key={pool.name} data={pool} address={address} />
            ))}
          </>
        ) : (
          <>
            <h4>You haven't joined any pools yet.</h4>
            <div className="screen--empty-state"></div>
          </>
        )}
      </div>
      <footer id="screen--footer">
        <Link to="/new">
          <div id="footer-btn">
            <div className="btn-group">
              <span className="btn-label" style={{ display: "none" }}>
                Add a new pool
              </span>
              <span className="btn-add btn-blue">+</span>
            </div>
          </div>
        </Link>
      </footer>
    </div>
  );
}

export default Home;
