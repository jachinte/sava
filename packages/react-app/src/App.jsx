import "antd/dist/antd.css";
import { useBalance } from "eth-hooks";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { NETWORKS } from "./constants";
import { SignIn, Pool, Invitation } from "./views";
import { useStaticJsonRPC } from "./hooks";
import "./App.css";

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // Select your target frontend network (localhost, goerli, xdai, mainnet)

function App(props) {
  const networkOptions = [initialNetwork.name, "mainnet", "goerli"];
  const [address] = useState();
  const [selectedNetwork] = useState(networkOptions[0]);
  const targetNetwork = NETWORKS[selectedNetwork];
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const yourLocalBalance = useBalance(localProvider, address);
  return (
    <div id="app">
      <Switch>
        <Route exact path="/">
          <SignIn />
        </Route>
        <Route exact path="/join">
          <Invitation author={"Maria"} />
        </Route>
        <Route exact path="/pool">
          <Pool yourLocalBalance={yourLocalBalance} />
        </Route>
      </Switch>
      {/* <ThemeSwitch /> */}
    </div>
  );
}

export default App;
