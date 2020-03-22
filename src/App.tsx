import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import FirstSchool from "./pages/FirstSchool";
import In from "./pages/in";
import { FIRST_USER } from "./queries/user.query";
import { HAS_SCHOOL } from "./queries/school.query";
import { useQuery } from "@apollo/react-hooks";

function App() {
  // Check if any school exists
  const { data } = useQuery(HAS_SCHOOL);

  // Checks if first User already exists
  const { data: uData } = useQuery(FIRST_USER);

  return (
    <>
      {!data && !uData && (
        <h5
          className="text-center"
          style={{ paddingTop: "15%", color: "lightGrey" }}
        >
          <img src="./loading.gif" style={{ width: "50px" }} /> <br />
          loading
        </h5>
      )}
      <Switch>
        {data && data.HasSchool && <Route path="/" component={FirstSchool} />}
        {data && !data.HasSchool && (
          <>
            {uData && uData.FirstSetup && (
              <>
                <Route path="/" component={UserSignup} />
              </>
            )}
            {uData && !uData.FirstSetup && (
              <>
                <Route exact path="/" component={UserLogin} />
                <Route path="/in" component={In} />
              </>
            )}
          </>
        )}
      </Switch>
    </>
  );
}

export default App;
