/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { GetAppName, GET_LOGO, scrollTop } from "../../context/App";
import { authService } from "../../services/Auth.Service";

interface SideProps {
    history?: any;
}

const SideNav: FC<SideProps> = ({ history }) => {
    const [keyword, setKeyword] = useState<string>();

    // Logged in User
    const user = authService.GetUser();
    return (
        <>
            <div
                ref={(el) => {
                    if (!el) return;
                    const elem = document.getElementById("main-container");
                    if (elem) {
                        elem.style.height = el.getBoundingClientRect().height + "px";
                    }
                }}
                id="sideNav"
                className="menu-w color-scheme-light menu-position-side menu-side-left
         menu-layout-compact sub-menu-style-over sub-menu-color-bright 
         selected-menu-color-light menu-activated-on-hover menu-has-selected-link 
         nav-bg-color"
            >
                <div className="logo-w">
                    <NavLink className="logo" to="/in/dashboard">
                        <div style={{ display: "inline" }}>
                            <img style={{ width: "48px" }} alt="logo" src={user.school.logo || GET_LOGO} />
                        </div>
                        <div className="logo-label">{user.school.alias || GetAppName()}</div>
                    </NavLink>
                </div>
                <div className="element-search autosuggest-search-activator">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (keyword) history.push(`/in/app-search?q=${keyword}`);
                        }}
                    >
                        <input
                            onChange={({ currentTarget: { value } }) => setKeyword(value)}
                            placeholder="Start typing to search..."
                        />
                    </form>
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
                            <li className="sub-header">
                                <span>School Mgt</span>
                            </li>
                            <li className="has-sub-menu">
                                <NavLink to="#">
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-home"></div>
                                    </div>
                                    <span>School</span>
                                </NavLink>
                                <div className="sub-menu-w">
                                    <div className="sub-menu-header">School</div>
                                    <div className="sub-menu-icon">
                                        <i className="os-icon os-icon-layout"></i>
                                    </div>
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
                                <div className="sub-menu-header">Setup</div>
                                <div className="sub-menu-icon">
                                    <i className="os-icon os-icon-layout"></i>
                                </div>
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
                    {user.superAdmin && (
                        <>
                            <li className="menu-link">
                                <NavLink to="/in/app/plan" onClick={() => scrollTop()}>
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-layers"></div>
                                    </div>
                                    <span>Service Plan</span>
                                </NavLink>
                            </li>
                        </>
                    )}

                    {user.admin && (
                        <>
                            <li className="menu-link">
                                <NavLink to="/in/attendance/exemption" onClick={() => scrollTop()}>
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-watch"></div>
                                    </div>
                                    <span>Exemption</span>
                                </NavLink>
                            </li>
                        </>
                    )}
                    {/* User Mgt */}
                    <li className="sub-header">
                        <span>User Mgt</span>
                    </li>
                    {user.superAdmin && (
                        <li className="menu-link">
                            <NavLink to="/in/super-admin-list" onClick={() => scrollTop()}>
                                <div className="icon-w">
                                    <i className="os-icon os-icon-layout"></i>
                                </div>{" "}
                                Super Admin
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
                            <div className="sub-menu-header">User</div>
                            <div className="sub-menu-icon">
                                <i className="os-icon os-icon-layout"></i>
                            </div>
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
                            <div className="sub-menu-header">Teacher</div>
                            <div className="sub-menu-icon">
                                <i className="os-icon os-icon-layout"></i>
                            </div>
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
                            <div className="sub-menu-header">Student</div>
                            <div className="sub-menu-icon">
                                <i className="os-icon os-icon-layout"></i>
                            </div>
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
                                    <li>
                                        <NavLink to="/in/promotion-student" onClick={() => scrollTop()}>
                                            Student Promotion
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>

                    {/* Report Mgt */}
                    <li className="sub-header">
                        <span>Reports</span>
                    </li>
                    <li className="has-sub-menu">
                        <NavLink to="#">
                            <div className="icon-w">
                                <div className="os-icon os-icon-calendar-time"></div>
                            </div>
                            <span>Reports</span>
                        </NavLink>
                        <div className="sub-menu-w">
                            <div className="sub-menu-header">Report</div>
                            <div className="sub-menu-icon">
                                <i className="os-icon os-icon-layout"></i>
                            </div>
                            <div className="sub-menu-i">
                                <ul className="sub-menu">
                                    <li>
                                        <NavLink to="/in/roll-call" onClick={() => scrollTop()}>
                                            Roll Call
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/in/school-attendance" onClick={() => scrollTop()}>
                                            School Attendance
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
                            <li className="sub-header">
                                <span>Navigation Mgt</span>
                            </li>
                            <li className="has-sub-menu">
                                <NavLink to="#">
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-list"></div>
                                    </div>
                                    <span>Navigation</span>
                                </NavLink>
                                <div className="sub-menu-w">
                                    <div className="sub-menu-header">Navigation</div>
                                    <div className="sub-menu-icon">
                                        <i className="os-icon os-icon-layout"></i>
                                    </div>
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
                            <li className="sub-header">
                                <span>Feedback Mgt</span>
                            </li>
                            <li className="has-sub-menu">
                                <NavLink to="#">
                                    <div className="icon-w">
                                        <div className="os-icon os-icon-common-07"></div>
                                    </div>
                                    <span>Feedback</span>
                                </NavLink>
                                <div className="sub-menu-w">
                                    <div className="sub-menu-header">Feedback</div>
                                    <div className="sub-menu-icon">
                                        <i className="os-icon os-icon-layout"></i>
                                    </div>
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
                    <li className="sub-header">
                        <span>MORE</span>
                    </li>
                    <li className="has-sub-menu">
                        <NavLink to="#">
                            <div className="icon-w">
                                <div className="os-icon os-icon-email-forward"></div>
                            </div>
                            <span>Communication</span>
                        </NavLink>
                        <div className="sub-menu-w">
                            <div className="sub-menu-header">Communication</div>
                            <div className="sub-menu-icon">
                                <i className="os-icon os-icon-layout"></i>
                            </div>
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
                    {user.superAdmin && (
                        <li className="menu-link">
                            <NavLink to="/in/audit" onClick={() => scrollTop()}>
                                <div className="icon-w">
                                    <div className="os-icon os-icon-tasks-checked"></div>
                                </div>
                                <span>Audit Trail</span>
                            </NavLink>
                        </li>
                    )}

                    <li className="menu-link">
                        <a
                            onClick={() => {
                                authService.Logout();
                                document.location.href = "/";
                            }}
                            href="#"
                        >
                            <div className="icon-w">
                                <div className="os-icon os-icon-signs-11"></div>
                            </div>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SideNav;
