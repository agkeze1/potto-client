/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { GetAppName, GET_LOGO } from "../../context/App";
import { authService } from "../../services/Auth.Service";
import Image from "./Image";
import { NavLink } from "react-router-dom";

const MobileMenu = () => {
    const user = authService.GetUser();
    const scrollTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    return (
        <>
            <div className="menu-mobile menu-activated-on-click">
                <div className="mm-logo-buttons-w">
                    <a className="mm-logo" href="/in/dashboard">
                        <img alt="logo" src={GET_LOGO} />
                        <span>{GetAppName()}</span>
                    </a>
                    <div className="mm-buttons">
                        <NavLink to="/in/app-search?q=">
                            <span style={{ fontSize: "1.4rem" }} className="os-icon os-icon-search mr-5"></span>
                        </NavLink>
                        <div className="mobile-menu-trigger">
                            <div className="os-icon os-icon-hamburger-menu-1"></div>
                        </div>
                    </div>
                </div>
                <div className="menu-and-user">
                    <div className="logged-user-w">
                        <Image alt={user.name} src={user.image} width={40} />
                        <div className="logged-user-info-w">
                            <div className="logged-user-name">{user?.name}</div>
                            <div className="logged-user-role">{user?.email}</div>
                        </div>
                    </div>
                    <ul className="main-menu">
                        <li className="selected">
                            <NavLink to="/in/dashboard" onClick={() => scrollTop()}>
                                <div className="icon-w">
                                    <div className="os-icon os-icon-pie-chart-3"></div>
                                </div>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        {user.superAdmin && (
                            <>
                                {/* School Mgt */}
                                <li className="has-sub-menu">
                                    <NavLink to="#">
                                        <div className="icon-w">
                                            <div className="os-icon os-icon-home"></div>
                                        </div>
                                        <span>School</span>
                                    </NavLink>
                                    <div className="sub-menu-w">
                                        <div className="sub-menu-i">
                                            <ul className="sub-menu">
                                                <li>
                                                    <NavLink to="/in/new-school" onClick={() => scrollTop()} className="">
                                                        New
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/in/school-list" onClick={() => scrollTop()}>
                                                        List
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )}

                        {user.admin && (
                            <li className="has-sub-menu">
                                <NavLink to="#">
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-settings"></div>
                                    </div>
                                    <span>Setup</span>
                                </NavLink>
                                <div className="sub-menu-w">
                                    <div className="sub-menu-i">
                                        <ul className="sub-menu">
                                            <li>
                                                <NavLink to="/in/term" onClick={() => scrollTop()}>
                                                    <span>Term</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/level" onClick={() => scrollTop()}>
                                                    <span>Level</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/class" onClick={() => scrollTop()}>
                                                    <span>Class</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/subjects" onClick={() => scrollTop()}>
                                                    <span>Subjects</span>
                                                </NavLink>
                                            </li>

                                            <li>
                                                <NavLink to="/in/guardian-type" onClick={() => scrollTop()}>
                                                    <span>Guardian Type</span>
                                                </NavLink>
                                            </li>
                                        </ul>
                                        <ul className="sub-menu">
                                            <li>
                                                <NavLink to="/in/period" onClick={() => scrollTop()}>
                                                    <span>Period</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/new-timetable" onClick={() => scrollTop()}>
                                                    <span>New Timetable</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/view-timetable" onClick={() => scrollTop()}>
                                                    <span>View Timetable</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/device-list" onClick={() => scrollTop()}>
                                                    <span>Device List</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/in/role" onClick={() => scrollTop()}>
                                                    <span>Role</span>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        )}

                        {/* User Mgt */}
                        {user.superAdmin && (
                            <li className="menu-link">
                                <NavLink to="/in/super-admin-list" onClick={() => scrollTop()}>
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-layout"></div>
                                    </div>
                                    <span>Super Admin</span>
                                </NavLink>
                            </li>
                        )}
                        <li className="has-sub-menu">
                            <NavLink to="#">
                                <div className="icon-w">
                                    <div className="os-icon os-icon-user"></div>
                                </div>
                                <span>User</span>
                            </NavLink>
                            <div className="sub-menu-w">
                                <div className="sub-menu-i">
                                    <ul className="sub-menu">
                                        <li>
                                            <NavLink to="/in/new-user" onClick={() => scrollTop()}>
                                                New
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/user-list" onClick={() => scrollTop()}>
                                                List
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className="has-sub-menu">
                            <NavLink to="#">
                                <div className="icon-w">
                                    <div className="os-icon os-icon-ui-90"></div>
                                </div>
                                <span>Teacher</span>
                            </NavLink>
                            <div className="sub-menu-w">
                                <div className="sub-menu-i">
                                    <ul className="sub-menu">
                                        <li>
                                            <NavLink to="/in/new-teacher" onClick={() => scrollTop()}>
                                                New
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/teacher-list" onClick={() => scrollTop()}>
                                                List
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className="has-sub-menu">
                            <NavLink to="#">
                                <div className="icon-w">
                                    <div className="os-icon os-icon-user-male-circle2"></div>
                                </div>
                                <span>Student</span>
                            </NavLink>
                            <div className="sub-menu-w">
                                <div className="sub-menu-i">
                                    <ul className="sub-menu">
                                        <li>
                                            <NavLink to="/in/new-student" onClick={() => scrollTop()}>
                                                New
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/student-list" onClick={() => scrollTop()}>
                                                List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/graduate-student" onClick={() => scrollTop()}>
                                                Graduate Student
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>

                        {/* Report Mgt */}
                        <li className="has-sub-menu">
                            <NavLink to="#">
                                <div className="icon-w">
                                    <div className="os-icon os-icon-calendar-time"></div>
                                </div>
                                <span>Report</span>
                            </NavLink>
                            <div className="sub-menu-w">
                                <div className="sub-menu-i">
                                    <ul className="sub-menu">
                                        <li>
                                            <NavLink to="/in/school-attendance" onClick={() => scrollTop()}>
                                                School Attendance
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/roll-call" onClick={() => scrollTop()}>
                                                Roll Call
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/subject-attendance" onClick={() => scrollTop()}>
                                                Subject Attendance
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/teacher-attendance" onClick={() => scrollTop()}>
                                                Teacher Attendance
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        {user.superAdmin && (
                            <>
                                {/* Navigation Mgt */}
                                <li className="has-sub-menu">
                                    <NavLink to="#">
                                        <div className="icon-w">
                                            <div className="os-icon os-icon-list"></div>
                                        </div>
                                        <span>Navigation</span>
                                    </NavLink>
                                    <div className="sub-menu-w">
                                        <div className="sub-menu-i">
                                            <ul className="sub-menu">
                                                <li>
                                                    <NavLink to="/in/navigation" onClick={() => scrollTop()}>
                                                        Navigation
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/in/navigation-group" onClick={() => scrollTop()}>
                                                        Navigation Group
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                {/* Feedback Mgt */}
                                <li className="has-sub-menu">
                                    <NavLink to="#">
                                        <div className="icon-w">
                                            <div className="os-icon os-icon-common-07"></div>
                                        </div>
                                        <span>Feedback</span>
                                    </NavLink>
                                    <div className="sub-menu-w">
                                        <div className="sub-menu-i">
                                            <ul className="sub-menu">
                                                <li>
                                                    <NavLink to="/in/feedback" onClick={() => scrollTop()}>
                                                        Feedback
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/in/feedback-type" onClick={() => scrollTop()}>
                                                        Feedback Type
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )}

                        <li className="has-sub-menu">
                            <NavLink to="#">
                                <div className="icon-w">
                                    <div className="os-icon os-icon-email-forward"></div>
                                </div>
                                <span>Communication</span>
                            </NavLink>
                            <div className="sub-menu-w">
                                <div className="sub-menu-i">
                                    <ul className="sub-menu">
                                        <li>
                                            <NavLink to="/in/send-feedback" onClick={() => scrollTop()}>
                                                Send Feedback
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/messaging/teachers" onClick={() => scrollTop()}>
                                                Message Teachers
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/in/messaging/guardian" onClick={() => scrollTop()}>
                                                Message Guardians
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>

                        <li className="menu-link">
                            <a
                                onClick={() => {
                                    authService.Logout();
                                    document.location.reload(true);
                                }}
                            >
                                <div className="icon-w">
                                    <div className="os-icon os-icon-signs-11"></div>
                                </div>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
