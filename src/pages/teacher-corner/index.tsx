import React, { FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { teacherAuthService } from "../../services/teacher.auth.service";
import { IProps } from "./../../models/IProps";
import SideNav from "./partials/SideNav";
import TeacherProfile from "./Profile";
import { Switch, Route } from "react-router-dom";
import TeacherTimetable from "./Timetable";
import TeacherAttendance from "./Attendance";
import UpdateTeacherPassword from "./UpdatePassword";
import SendFeedback from "../in/SendFeedback";
import MobileMenu from "../partials/MobileMenu";

const TeacherCorner: FC<IProps> = ({ location }) => {
  const { name } = teacherAuthService.GetTeacher();
  return (
    <>
      <Helmet>
        <title>
          {name} | {GetAppName()}
        </title>
      </Helmet>

      <div className="all-wrapper with-side-panel solid-bg-all">
        <div className="layout-w">
          {/* Mobile Navigation */}
          <MobileMenu />

          {/* Main sidebar */}
          <SideNav location={location} />

          <div className="content-w">
            {/* Header */}
            <div className="content-panel-toggler">
              <i className="os-icon os-icon-grid-squares-22"></i>
              <span>Sidebar</span>
            </div>

            {/* Content */}
            <div className="main-container">
              <Switch>
                <Route
                  exact={true}
                  path="/teacher/app/timetable"
                  component={TeacherTimetable}
                />
                <Route
                  exact={true}
                  path="/teacher/app/attendance"
                  component={TeacherAttendance}
                />
                <Route
                  exact={true}
                  path="/teacher/app/update-password"
                  component={UpdateTeacherPassword}
                />
                <Route
                  exact={true}
                  path="/teacher/app/feedback"
                  component={SendFeedback}
                />
                <Route path="/teacher/app" component={TeacherProfile} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherCorner;
