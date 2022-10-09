import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { poolContract } from "../hooks";
import { addressAsName } from "../helpers";
import "./Home.css";

function PoolItem({ data }) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  const winnerSpan = (
    <span className="green-text">
      This savings pool has ended. <b>{data.winner}</b> has won the reward for fulfilling his commitment first.
    </span>
  );
  const openButton = (
    <Link to={`/pool/${data["0"]}`}>
      <span className="btn btn-lg btn-blue">Enter pool</span>
    </Link>
  );
  return (
    <div className="pool-item">
      <header>
        <h4>{data.name}</h4>
        <p>
          Save{" "}
          <b>
            {formatter.format(data.individualGoal)} {data.currency}
          </b>{" "}
          in <b>{Math.round((data.endDate - data.startDate) / (24 * 3600))} days</b>.
        </p>
      </header>
      {data.participants ? (
        <div>
          <h5 className="uppercase">Pool participants ({data.participants.length})</h5>
          <ul className="screen--user-list">
            {data.participants.map(participant => (
              <li ket={participant}>
                <img alt={participant} src="/images/avatar.jpg" />
                <span className="uppercase">
                  <b>{addressAsName(participant)}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      {data.winnerSelected ? winnerSpan : openButton}
    </div>
  );
}

/**
 * Home screen.
 * @returns react component
 **/
function Home({ address, contract, userInfo }) {
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
  }, [address, contract]);

  return (
    <div id="home" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <h1 id="screen--title">Welcome back, {address}!</h1>
      </header>
      <div id="screen--main">
        {userPools && userPools.length > 0 ? (
          <>
            <h3>Your existing pools</h3>
            {userPools.map(pool => (
              <PoolItem key={pool["0"]} data={pool} />
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
              <span className="btn-label">Add a new pool</span> <span className="btn-add btn-blue">+</span>
            </div>
          </div>
        </Link>
      </footer>
    </div>
  );
}

export default Home;
