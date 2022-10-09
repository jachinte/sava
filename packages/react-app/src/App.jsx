import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { SignIn, Home, Pool, Invitation, Contribution, New, Confirmation } from "./views";
import { CLIENT_ID, MUMBAI_CHAIN_ID, ALCHEMY_KEY } from "./constants";
import Web3 from "web3";
import contracts from "./contracts/external_contracts";
import { web3RPC } from "./hooks";
import "./App.css";

function App(props) {
  const history = useHistory();
  const [web3auth, setWeb3auth] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [address, setAddress] = useState();

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
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [!provider]);

  useEffect(() => {
    async function fetchData() {
      if (provider) {
        setAddress(await web3RPC.getAccounts(provider));
        const web3 = new Web3(provider);
        const SavingsPool = contracts[1].contracts.SavingsPool;
        setContract(new web3.eth.Contract(SavingsPool.abi, SavingsPool.address));
      }
    }
    fetchData();
  }, [provider]);

  const logout = async () => {
    if (web3auth) {
      await web3auth.logout();
      setProvider(undefined);
      history.push("/");
    }
  };

  const auth = View => {
    if (provider) {
      return View;
    }
    return (
      <SignIn
        web3auth={web3auth}
        provider={provider}
        setProvider={setProvider}
        redirectPath={history.location.pathname}
      />
    );
  };

  return (
    <>
      {history.location.pathname !== "/" && <button onClick={logout} id="logout-btn" />}
      <div id="app">
        <Switch>
          <Route exact path="/">
            {auth(<Redirect to="/home" />)}
          </Route>
          <Route exact path="/join/pool/:pool">
            <Invitation contract={contract} address={address} />
          </Route>
          <Route exact path="/home">
            {auth(<Home contract={contract} address={address} />)}
          </Route>
          <Route path="/new">{auth(<New contract={contract} address={address} />)}</Route>
          <Route path="/pool/:id">{auth(<Pool contract={contract} address={address} />)}</Route>
          <Route path="/contribution/pool/:id">{auth(<Contribution contract={contract} address={address} />)}</Route>
          <Route path="/confirmation/:pool/:amount">{auth(<Confirmation contract={contract} />)}</Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
