import React from "react";
import { Redirect } from "react-router-dom";
import "./SignIn.css";

/**
 * Sign in screen.
 * @returns react component
 **/
function SignIn({ web3auth, provider, setProvider }) {
  const login = async () => {
    console.log("click");
    if (!web3auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const unloggedInView = (
    <div id="signin" className="screen">
      <header id="signin--header">
        <div id="signin--illustration"></div>
        <h1 id="screen--title">
          Savings
          <br />
          Pool
        </h1>
      </header>
      <div id="signin--main">
        <nav className="signin--buttons-2">
          <button onClick={login}>
            <span className="signin--btn signin--btn-generic">Join</span>
          </button>
        </nav>
      </div>
      <footer id="signin--footer"></footer>
    </div>
  );

  const loggedInView = <Redirect to="/home" />;

  return provider ? loggedInView : unloggedInView;
}

export default SignIn;
