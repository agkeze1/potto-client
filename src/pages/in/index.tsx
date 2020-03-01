import React, { FC } from "react";
import { GetAppName } from "../../context/App";
import Helmet from "react-helmet";
import { Switch, Route } from "react-router-dom";

import StudentSideNav from "./student/partials/StudentSideNav";
import { IProps } from "../../models/IProps";

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
          {IsAuthenticated() && !IsStudent() && (
            <AdminSideNav location={location} />
          )}

          <div className="content-w">
            {/* Header goes here */}
            {IsAuthenticated() && !IsStudent() && (
              <AdminHeader location={location} />
            )}
            <div className="content-panel-toggler">
              <i className="os-icon os-icon-grid-squares-22"></i>
              <span>Sidebar</span>
            </div>

            {/* Content goes here */}
            <div className="main-container">
              <Switch>
                {/* Student starts here */}
                <Route exact path="/in" component={ProfileHome} />
                <Route path="/in/student/profile" component={StudentProfile} />
                <Route
                  path="/in/student/register-courses"
                  component={RegisterCourses}
                />
                <Route
                  path="/in/student/update-level"
                  component={UpdateLevel}
                />
                <Route
                  path="/in/student/registered-courses"
                  component={RegisteredCourse}
                />
                <Route
                  path="/in/student/update-biodata"
                  component={UpdateBiodata}
                />
                {/* Student ends here */}

                {/* Admin starts here */}
                <Route exact path="/in/admin" component={Dashboard} />
                <Route path="/in/admin/dashboard" component={Dashboard} />
                {/* <Route
									path="/in/admin/admin-profile"
									component={AdminProfile}
								/> */}
                <Route path="/in/admin/new-admin" component={NewAdmin} />
                <Route path="/in/admin/admin-list" component={AdminList} />
                <Route path="/in/admin/new-lecturer" component={NewLecturer} />
                <Route
                  path="/in/admin/assign-course"
                  component={AssignCourse}
                />
                <Route path="/in/admin/department" component={Department} />
                <Route
                  path="/in/admin/lecturer-list"
                  component={LecturerList}
                />
                <Route path="/in/admin/new-course" component={NewCourse} />
                <Route path="/in/admin/course-list" component={CourseList} />
                <Route
                  path="/in/admin/active-session"
                  component={ActiveSession}
                />
                <Route
                  path="/in/admin/max-credit-unit"
                  component={MaxCreditUnit}
                />
                {/* Admin ends here */}
              </Switch>
            </div>
          </div>
        </div>
        <hr />
        <a
          className="font-sm text-center footer mb-2"
          href="http://lloydant.com"
        >
          <img src="/img/lloydant.png" className="logo-footer mr-2" />
          Powered by LloydAnt
        </a>
      </div>
    </>
  );
};

export default Home;
