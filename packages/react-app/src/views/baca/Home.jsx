import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function PoolItem({ data }) {
  return (
    <div className="pool-item">
      <header>
        <h4>{data.name}</h4>
        <p>
          Save{" "}
          <b>
            {data.goal}
            {data.currency}
          </b>{" "}
          in <b>{data.days} days</b>.
        </p>
      </header>
      <div>
        <h5 className="uppercase">Pool participants ({data.participants.length})</h5>
        <ul className="screen--user-list">
          {data.participants.map(participant => (
            <li ket={participant.username}>
              <img alt={participant.username} src={participant.avatar} />
              <span className="uppercase">
                <b>{participant.username}</b>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Link to={`/pool/${data.id}`}>
        <span className="btn btn-lg btn-blue">Enter pool</span>
      </Link>
    </div>
  );
}

/**
 * Home screen.
 * @returns react component
 **/
function Home({ username, pools }) {
  return (
    <div id="home" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <h1 id="screen--title">Welcome back, {username}!</h1>
      </header>
      <div id="screen--main">
        <h3>Your existing pools</h3>
        {pools.map(pool => (
          <PoolItem key={pool.id} data={pool} />
        ))}
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
