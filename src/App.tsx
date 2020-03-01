import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={UserLogin} />
      <Route path="/login" component={UserLogin} />
      <Route path="/signup" component={UserSignup} />
    </Switch>
  );
}

export default App;
