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
        <li className="sub-header">
          <span>Navigation</span>
        </li>
        <li className="menu-link">
          <NavLink exact to="/in/admin">
            <div className="icon-w">
              <div className="os-icon os-icon-layout"></div>
            </div>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/new-school" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>New School</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/school-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>School List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/new-admin" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Super Admin</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/admin-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Super Admin List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/new-user" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New User</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/user-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>User List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/new-teacher" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Teacher</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/teacher-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Teacher List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/new-student" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Student</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/student-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Student List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/term" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-tasks-checked"></div>
            </div>
            <span>Term</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/level" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-trending-up"></div>
            </div>
            <span>Level</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/class" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-book-open"></div>
            </div>
            <span>Class</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/guardian-type" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Guardian Type</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/guardian" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Guardian</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/subjects" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Subjects</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/devices" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-check-square"></div>
            </div>
            <span>Devices</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/school-attendance" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>School Attendance</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/class-attendance" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Class Attendance</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/subject-attendance" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Subject Attendance</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/time-table" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-pie-chart-3"></div>
            </div>
            <span>Time Table</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/role" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Role</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/school-attendance" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>School Attendance</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/navigation-group" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Navigation Group</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/navigation" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Navigation</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/feedback" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Feedback</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/feedback-type" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
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
  );
};

export default SideNav;
