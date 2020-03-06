import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import In from "./pages/in";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={UserLogin} />
      <Route path="/login" component={UserLogin} />
      <Route path="/signup" component={UserSignup} />
      <Route path="/in" component={In} />
    </Switch>
  );
}

export default App;
