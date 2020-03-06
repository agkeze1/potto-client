import React, { FC } from "react";
import { GetAppName } from "../../context/App";
import Helmet from "react-helmet";
import { Switch, Route } from "react-router-dom";
import { IProps } from "../../models/IProps";

//Route Pages
import Header from "../partials/Header";
import SideNav from "../partials/SideNav";
import NewSchool from "./NewSchool";
import SchoolList from "./SchoolList";
import NewUser from "./NewUser";
import UserList from "./UserList";
import NewSuperAdmin from "./NewSuperAdmin";
import SuperAdminList from "./SuperAdminList";

const Home: FC<IProps> = ({ location }) => {
  document.body.className =
    "full-screen with-content-panel menu-position-side menu-side-left";
  // const { IsAuthenticated, IsStudent } = authService;

  return (
    <>
      <Helmet>
        <title>Home | {GetAppName()}</title>
      </Helmet>
      <div className="all-wrapper with-side-panel solid-bg-all">
        <div className="layout-w">
          {/* Main sidebar */}
          <SideNav location={location} />

          <div className="content-w">
            {/* Header goes here */}
            <Header location={location} />
            <div className="content-panel-toggler">
              <i className="os-icon os-icon-grid-squares-22"></i>
              <span>Sidebar</span>
            </div>

            {/* Content goes here */}
            <div className="main-container">
              <Switch>
                <Route path="/in/new-school" component={NewSchool} />
                <Route path="/in/school-list" component={SchoolList} />
                <Route path="/in/new-user" component={NewUser} />
                <Route path="/in/user-list" component={UserList} />
                <Route path="/in/new-super-admin" component={NewSuperAdmin} />
                <Route path="/in/super-admin-list" component={SuperAdminList} />
              </Switch>
            </div>
          </div>
        </div>
        <hr />
        <a className="font-sm text-center footer mb-2" href="http://afari.com">
          <img src="/img/lloydant.png" className="logo-footer mr-2" />
          Powered by Afari
        </a>
      </div>
    </>
  );
};

export default Home;
