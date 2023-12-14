import React from "react";
import SignUp from "./components/SignUp";
import { Redirect, Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import Welcome from "./pages/Welcome";

function App() {
const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth">
        <SignUp />
      </Route>
      {isAuthenticated && (
        <Route path="/welcome">
          <Welcome />
        </Route>
      )}
      {!isAuthenticated ? (
        <Redirect from="*" to="/auth" />
      ) : (
        <Redirect from="*" to="/welcome/inbox" />
      )}
    </Switch>
  );
}

export default App;
