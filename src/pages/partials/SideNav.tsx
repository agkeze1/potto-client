import React, { FC } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { GetAppName } from "../../context/App";
// import { authService } from "../../../../services/Auth.Service";

interface SideProps {
  location?: any;
}

const SideNav: FC<SideProps> = ({ location }) => {
  // const { name } = authService.GetUser();
  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  return (
    <>
      <div className="menu-w color-scheme-light color-style-transparent menu-position-side menu-side-left menu-layout-compact sub-menu-style-over sub-menu-color-bright selected-menu-color-light menu-activated-on-hover menu-has-selected-link">
        <div className="logo-w">
          <NavLink className="logo" to="/in/dashboard">
            <div style={{ display: "inline" }}>
              <img alt="logo" src="/logo192.png" />
            </div>
            <div className="logo-label">{GetAppName()}</div>
          </NavLink>
        </div>
        <div className="logged-user-w avatar-inline">
          <div className="logged-user-i">
            <div className="logged-user-info-w">
              <div className="logged-user-name">Douglas Cage</div>
              <div className="logged-user-role">Administrator</div>
            </div>
          </div>
        </div>
        <ul className="main-menu">
          <li className="selected">
            <NavLink to="/in/dashboard" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* School Mgt */}
          <li className="sub-header">
            <span>School Mgt</span>
          </li>
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
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
                    <NavLink to="/in/new-school" onClick={() => scrollTop()}>
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
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
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
                    <NavLink to="/in/timetable" onClick={() => scrollTop()}>
                      <span>Timetable</span>
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

          {/* User Mgt */}
          <li className="sub-header">
            <span>User Mgt</span>
          </li>
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Super Admin</span>
            </NavLink>
            <div className="sub-menu-w">
              <div className="sub-menu-header">Super Admin</div>
              <div className="sub-menu-icon">
                <i className="os-icon os-icon-layout"></i>
              </div>
              <div className="sub-menu-i">
                <ul className="sub-menu">
                  <li>
                    <NavLink
                      to="/in/new-super-admin"
                      onClick={() => scrollTop()}
                    >
                      New
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/in/super-admin-list"
                      onClick={() => scrollTop()}
                    >
                      List
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
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
                    <NavLink
                      to="/in/new-super-admin"
                      onClick={() => scrollTop()}
                    >
                      New
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/in/super-admin-list"
                      onClick={() => scrollTop()}
                    >
                      List
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
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
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Student</span>
            </NavLink>
            <div className="sub-menu-w">
              <div className="sub-menu-header">Teacheer</div>
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
                </ul>
              </div>
            </div>
          </li>
          <li>
            <NavLink to="/in/form-teacher" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Form Teacher</span>
            </NavLink>
          </li>

          {/* Student Mgt */}
          <li className="sub-header">
            <span>Student Mgt</span>
          </li>
          <li className="has-sub-menu">
            <NavLink to="#" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
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
                </ul>
              </div>
            </div>
          </li>
          <li>
            <NavLink to="/in/guardian-type" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Guardian Type</span>
            </NavLink>
          </li>

          {/* Attendance Mgt */}
          <li className="sub-header">
            <span>Attendance</span>
          </li>
          <li>
            <NavLink to="/in/school-attendance" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>School Attendance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/in/class-attendance" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Class Attendance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/in/subject-attendance" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Subject Attendance</span>
            </NavLink>
          </li>

          {/* Navigation Mgt */}
          <li className="sub-header">
            <span>Navigation Mgt</span>
          </li>
          <li>
            <NavLink to="/in/navigation" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Navigation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/in/navigation-group" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Navigation Group</span>
            </NavLink>
          </li>

          {/* Feedback Mgt */}
          <li className="sub-header">
            <span>Feedback Mgt</span>
          </li>
          <li>
            <NavLink to="/in/feedback" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Feedback</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/in/feedback-type" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-layout"></div>
              </div>
              <span>Feedback Type</span>
            </NavLink>
          </li>

          <li className="menu-link">
            <a
              onClick={() => {
                // authService.Logout();
                document.location.reload();
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
