import "antd/dist/antd.css";
import { Route, Switch } from "react-router-dom";
import { SignIn, Home, Pool, Invitation } from "./views";
import "./App.css";

function App(props) {
  const pools = [
    {
      id: 1,
      name: "Trip to Cartagena!",
      goal: 1000,
      currency: "USDC",
      days: 31,
      participants: [
        {
          username: "Leon",
          avatar: "/images/leon.png",
        },
        {
          username: "Jose",
          avatar: "/images/jose.png",
        },
      ],
    },
  ];
  return (
    <div id="app">
      <Switch>
        <Route exact path="/">
          <SignIn />
        </Route>
        <Route exact path="/join">
          <Invitation author={"Maria"} />
        </Route>
        <Route exact path="/home">
          <Home username="Jose" pools={pools} />
        </Route>
        <Route path="/pool/:id">
          <Pool />
        </Route>
      </Switch>
      {/* <ThemeSwitch /> */}
    </div>
  );
}

export default App;
