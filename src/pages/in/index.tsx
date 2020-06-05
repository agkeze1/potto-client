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
import SuperAdmin from "./SuperAdmin";
import Level from "./Level";
import Class from "./Class";
import Term from "./Term";
import Subjects from "./Subjects";
import NewStudent from "./NewStudent";
import StudentList from "./StudentList";
import NewTeacher from "./NewTeacher";
import TeacherList from "./TeacherList";
import GuardianType from "./GuardianType";
import DeviceList from "./DeviceList";
import Navigation from "./Navigation";
import NavigationGroup from "./NavigationGroup";
import Feedback from "./Feedback";
import FeedbackType from "./FeedbackType";
import Role from "./Role";
import NewTimetable from "./NewTimetable";
import ViewTimetable from "./ViewTimetable";
import Dashboard from "./Dashboard";
import Period from "./Period";
import { authService } from "../../services/Auth.Service";
import SendFeedback from "./SendFeedback";
import GraduateStudent from "./GraduateStudent";

const Home: FC<IProps> = ({ location, history }) => {
    document.body.className = "full-screen with-content-panel menu-position-side menu-side-left bodyBefore";
    // document.body.style.background

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) history.push("/login");
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
                        {/* Header */}
                        <Header location={location} />
                        <div className="content-panel-toggler">
                            <i className="os-icon os-icon-grid-squares-22"></i>
                            <span>Sidebar</span>
                        </div>

                        {/* Content */}
                        <div className="main-container">
                            <Switch>
                                <Route exact path="/in" component={Dashboard} />
                                <Route exact path="/in/dashboard" component={Dashboard} />
                                <Route path="/in/new-school" component={NewSchool} />
                                <Route path="/in/school-list" component={SchoolList} />
                                <Route path="/in/new-user" component={NewUser} />
                                <Route path="/in/user-list" component={UserList} />
                                <Route path="/in/super-admin-list" component={SuperAdmin} />
                                <Route path="/in/level" component={Level} />
                                <Route path="/in/class" component={Class} />
                                <Route path="/in/term" component={Term} />
                                <Route path="/in/subjects" component={Subjects} />
                                <Route path="/in/new-student" component={NewStudent} />
                                <Route path="/in/student-list" component={StudentList} />
                                <Route path="/in/new-teacher" component={NewTeacher} />
                                <Route path="/in/teacher-list" component={TeacherList} />
                                <Route path="/in/guardian-type" component={GuardianType} />
                                <Route path="/in/device-list" component={DeviceList} />
                                <Route path="/in/navigation" component={Navigation} />
                                <Route path="/in/navigation-group" component={NavigationGroup} />
                                <Route path="/in/feedback" component={Feedback} />
                                <Route path="/in/feedback-type" component={FeedbackType} />
                                <Route path="/in/role" component={Role} />
                                <Route path="/in/new-timetable" component={NewTimetable} />
                                <Route path="/in/view-timetable" component={ViewTimetable} />
                                <Route path="/in/period" component={Period} />
                                <Route path="/in/send-feedback" component={SendFeedback} />
                                <Route path="/in/graduate-student" component={GraduateStudent} />
                            </Switch>
                        </div>
                    </div>
                </div>
                <hr />
                <a className="font-sm text-center footer mb-2" href="http://afari.com">
                    <img src="/img/lloydant.png" alt="app logo" className="logo-footer mr-2" />
                    Powered by Afari
                </a>
            </div>
        </>
    );
};

export default Home;
