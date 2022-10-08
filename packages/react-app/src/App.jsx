import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { useBalance } from "eth-hooks";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { ThemeSwitch } from "./components";
import { NETWORKS } from "./constants";
import { SignIn, Pool } from "./views";
import { useStaticJsonRPC } from "./hooks";
import RPC from "./hooks/web3RPC";

const clientId = "BFt8f0zCLJtfThnpTEsmOs8EdgHgmIkKsObguZbdp7XEEwheU4BCDH8shgSBQ3l-UVTKV0qqrLIEnsXSYe35kpE"; // get from https://dashboard.web3auth.io

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // Select your target frontend network (localhost, goerli, xdai, mainnet)

function App(props) {
  const [web3auth, setWeb3auth] = useState();
  const [provider, setProvider] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", // polygon mumbai chain-id in hex
            rpcTarget: "https://polygon-mumbai.g.alchemy.com/v2/RGPhWsJCplbShwpSYOo1Df7oplSaTl8d", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    console.log("web3auth is already initialized");
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const chainId = await RPC.getChainId(provider);
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    console.log(address);
  };

  let yourLocalBalance = 0;

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    yourLocalBalance = balance;
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const receipt = await RPC.sendTransaction(provider);
    console.log(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
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

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <div className="grid">{provider ? loggedInView : unloggedInView}</div>
        </Route>
        <Route exact path="/pool">
          <div className="grid">{provider ? <Pool yourLocalBalance={yourLocalBalance} /> : unloggedInView}</div>
        </Route>
      </Switch>
      <ThemeSwitch />
    </div>
  );
}

export default App;
