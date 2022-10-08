import "antd/dist/antd.css";
import { Route, Switch } from "react-router-dom";
import { SignIn, Home, Pool, Invitation, Contribution } from "./views";
import "./App.css";

const pools = [
  {
    id: 1,
    name: "Trip to Cartagena!",
    goal: 1000,
    currency: "USDC",
    days: 31,
    winnerSelected: false,
    participants: [
      {
        username: "Leon",
        avatar: "/images/leon.png",
        contribution: 410,
      },
      {
        username: "Jose",
        avatar: "/images/jose.png",
        contribution: 101,
      },
    ],
  },
  {
    id: 2,
    name: "Trip to Canada!",
    goal: 1000,
    currency: "USDC",
    days: 31,
    winnerSelected: true,
    winner: "Jose",
    participants: [
      {
        username: "Leon",
        avatar: "/images/leon.png",
        contribution: 410,
      },
      {
        username: "Jose",
        avatar: "/images/jose.png",
        contribution: 101,
      },
    ],
  },
];

function App(props) {
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
        <Route path="/contribution/pool/:id">
          <Contribution />
        </Route>
      </Switch>
      {/* <ThemeSwitch /> */}
    </div>
  );
}

export default App;
