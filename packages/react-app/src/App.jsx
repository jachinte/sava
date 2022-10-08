import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { SignIn, Home, Pool, Invitation, Contribution, New, Confirmation } from "./views";
import { CLIENT_ID, MUMBAI_CHAIN_ID, ALCHEMY_KEY } from "./constants";
import "./App.css";

function App(props) {
  const history = useHistory();
  const [web3auth, setWeb3auth] = useState();
  const [provider, setProvider] = useState();
  const [username, setUsername] = useState();

  const getUserInfo = async () => {
    if (web3auth) {
      const user = await web3auth.getUserInfo();
      return user;
    }
    console.error("web3auth not initialized yet");
  };

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

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                email_passwordless: {
                  showOnModal: false,
                },
                external_wallet: {
                  showOnModal: false,
                },
              },
            },
            [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
              label: "wallet_connect_v1",
              showOnModal: false,
            },
          },
        });
        if (web3auth.provider) {
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

  const logout = async () => {
    if (web3auth) {
      await web3auth.logout();
      setProvider(null);
      history.push("/");
    }
  };

  const auth = View => {
    if (provider && username) {
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
    <div id="app">
      <Switch>
        <Route exact path="/">
          {auth(<Redirect to="/home" />)}
        </Route>
        <Route exact path="/join">
          <Invitation author={"Maria"} />
        </Route>
        <Route exact path="/home">
          {auth(<Home username={username} provider={provider} logout={logout} />)}
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
