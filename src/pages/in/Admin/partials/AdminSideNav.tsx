import React, { FC } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { GetAppName } from "../../../../context/App";
// import { authService } from "../../../../services/Auth.Service";

interface SideProps {
  location?: any;
}

const AdminSideNav: FC<SideProps> = ({ location }) => {
  // const { name } = authService.GetUser();
  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  return (
    <div className="menu-w color-scheme-light color-style-transparent menu-position-side menu-side-left menu-layout-compact sub-menu-style-over sub-menu-color-bright selected-menu-color-light menu-activated-on-hover menu-has-selected-link">
      <div className="logo-w">
        <NavLink className="logo" to="/in/admin">
          <div style={{ display: "inline" }}>
            <img alt="logo" src="../../img/icon-pink.png" />
          </div>
          <div className="logo-label">{GetAppName()}</div>
        </NavLink>
      </div>
      <div className="logged-user-w avatar-inline">
        <div className="logged-user-i">
          <div className="logged-user-info-w">
            <div className="logged-user-name">{name}</div>
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
        {/* <li className="menu-link">
					<NavLink to="/in/admin/admin-profile">
						<div className="icon-w">
							<div className="os-icon os-icon-user"></div>
						</div>
						<span>Profile</span>
					</NavLink>
				</li> */}
        <li className="menu-link">
          <NavLink to="/in/admin/new-admin" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Admin</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/admin-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Admin List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/new-lecturer" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Lecturer</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/lecturer-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Lecturer List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/assign-course" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-tasks-checked"></div>
            </div>
            <span>Assign Course</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/department" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-trending-up"></div>
            </div>
            <span>Department</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/new-course" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-book-open"></div>
            </div>
            <span>New Course</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/course-list" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>Course List</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/active-session" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-check-square"></div>
            </div>
            <span>Active Session</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/admin/max-credit-unit" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-pie-chart-3"></div>
            </div>
            <span>Max. Credit Unit</span>
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

export default AdminSideNav;
