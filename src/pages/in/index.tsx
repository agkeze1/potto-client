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
import NewStudent from "./Student/NewStudent";
import StudentList from "./Student";
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
import RollCall from "./AttendanceReport/RollCall";
import SendFeedback from "./SendFeedback";
import GraduateStudent from "./GraduateStudent";
import SubjectAttendance from "./AttendanceReport/SubjectAttendance";
import TeacherAttendance from "./TeacherAttendance";
import TeacherMessage from "./TeacherMessage";
import SendTeacherMessage from "./TeacherMessage/NewMessage";
import GuardianMessage from "./GuardianMessage/index";
import MobileMenu from "../partials/MobileMenu";
import AppSearch from "./Search";
import TeacherDetails from "./Teacher/Details";
import NotFound from "./404";
import StudentProfile from "./Student/profile";
import { PubNubConsumer, PubNubProvider } from "pubnub-react";
import NotifyProvider, { handleNewData } from "../../events/event-resolver";
import { authService } from "../../services/Auth.Service";
import PubNub from "pubnub";
import ServicePlan from "./ServicePlan/index";

const Home: FC<IProps> = ({ history }) => {
    document.body.className = "full-screen with-content-panel menu-position-side menu-side-left bodyBefore";
    // document.body.style.background
    const { REACT_APP_PUBLISH_KEY, REACT_APP_SUBSCRIBE_KEY } = process.env;

    const user = authService.GetUser();

    const pubNub = new PubNub({
        publishKey: REACT_APP_PUBLISH_KEY,
        subscribeKey: REACT_APP_SUBSCRIBE_KEY || "",
        restore: true,
        heartbeatInterval: 0,
        uuid: user.id || "",
    });
    NotifyProvider.pubNub = pubNub;
    return (
        <>
            <Helmet>
                <title>Home | {GetAppName()}</title>
            </Helmet>
            <PubNubProvider client={pubNub}>
                <div className="all-wrapper with-side-panel solid-bg-all">
                    <div className="layout-w">
                        {/* Mobile Navigation */}
                        <MobileMenu />

                        {/* Main sidebar */}
                        <SideNav history={history} />

                        <div className="content-w">
                            {/* Header */}
                            <Header history={history} />
                            <PubNubConsumer>
                                {(client) => {
                                    client.addListener({
                                        message: (MessageEvent) => {
                                            handleNewData(MessageEvent.message);
                                        },
                                    });
                                    client.subscribe({
                                        channels: [user?.school.id || ""],
                                    });
                                    return "";
                                }}
                            </PubNubConsumer>
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
                                    <Route path="/in/roll-call" component={RollCall} />
                                    <Route path="/in/send-feedback" component={SendFeedback} />
                                    <Route path="/in/subject-attendance" component={SubjectAttendance} />
                                    <Route path="/in/graduate-student" component={GraduateStudent} />
                                    <Route path="/in/teacher-attendance" component={TeacherAttendance} />
                                    <Route path="/in/messaging/teachers" exact={true} component={TeacherMessage} />
                                    <Route path="/in/messaging/teachers/new" component={SendTeacherMessage} />
                                    <Route path="/in/messaging/guardian" component={GuardianMessage} />
                                    <Route path="/in/app-search" component={AppSearch} />
                                    <Route path="/in/teacher/:id" exact component={TeacherDetails} />
                                    <Route path="/in/student/:id" component={StudentProfile} />
                                    <Route component={NotFound} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <a className="font-sm text-center footer py-2" href="http://potto.com">
                        <img src="/avatar.png" alt="app logo" className="logo-footer mr-2" />
                        Powered by Potto
                    </a>
                </div>
            </PubNubProvider>
        </>
    );
};

export default Home;
