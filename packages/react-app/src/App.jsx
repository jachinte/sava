import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn, Home, Pool, Invitation, Contribution, New, Confirmation } from "./views";
import { CLIENT_ID, MUMBAI_CHAIN_ID, ALCHEMY_KEY } from "./constants";
import RPC from "./hooks/web3RPC";
import "./App.css";

function App(props) {
  const [web3auth, setWeb3auth] = useState();
  const [provider, setProvider] = useState();
  const [username, setUsername] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            // polygon mumbai chain-id in hex
            chainId: MUMBAI_CHAIN_ID,
            // This is the public RPC we have added, please pass on your own endpoint while creating an app
            rpcTarget: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (typeof web3auth.provider !== undefined) {
          setProvider(web3auth.provider);
          const userInfo = await getUserInfo();
          setUsername(userInfo.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [provider]);

  const getUserInfo = async () => {
    if (typeof web3auth === undefined) {
      console.error("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
    return user;
  };

  const logout = async () => {
    if (typeof web3auth === undefined) {
      console.error("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const chainId = await RPC.getChainId(provider);
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    console.log(address);
  };

  let yourLocalBalance = 0;

  const getBalance = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    yourLocalBalance = balance;
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const receipt = await RPC.sendTransaction(provider);
    console.log(receipt);
  };

  const signMessage = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (typeof provider === undefined) {
      console.log("provider not initialized yet");
      return;
    }
    const privateKey = await RPC.getPrivateKey(provider);
    console.log(privateKey);
  };
  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={sendTransaction} className="card">
        Send Transaction
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button>
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInview = <SignIn web3auth={web3auth} provider={provider} setProvider={setProvider} />;

  const auth = View => {
    if (typeof provider === undefined || typeof username === undefined) {
      return <SignIn web3auth={web3auth} provider={provider} setProvider={setProvider} />;
    } else {
      return View;
    }
  };

  return (
    <div id="app">
      <Switch>
        <Route exact path="/">
          {auth(<Redirect to="/home" />)}
        </Route>
        <Route exact path="/join">
          <Invitation author={"Maria"} />
        </Route>
        <Route exact path="/home">
          {provider && username ? <Home username={username} provider={provider} logout={logout} /> : unloggedInview}
          {/* {auth(<Home username={username} provider={provider} logout={logout} />)} */}
        </Route>
        <Route path="/new">{auth(<New />)}</Route>
        <Route path="/pool/:id">{auth(<Pool />)}</Route>
        <Route path="/contribution/pool/:id">{auth(<Contribution />)}</Route>
        <Route path="/confirmation/:pool/:amount">{auth(<Confirmation />)}</Route>
      </Switch>
    </div>
  );
}

export default App;
