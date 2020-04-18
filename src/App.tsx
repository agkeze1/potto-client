import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import FirstSchool from "./pages/FirstSchool";
import In from "./pages/in";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={UserLogin} />
      <Route exact path="/login" component={UserLogin} />
      <Route path="/default_school" component={FirstSchool} />
      <Route path="/signup" component={UserSignup} />
      <Route path="/in" component={In} />
    </Switch>
  );
}

export default App;
