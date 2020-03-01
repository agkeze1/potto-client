import React, { FC } from "react";
import { NavLink, Redirect } from "react-router-dom";
// import { authService } from "../../../../services/Auth.Service";
import { IProps } from "../../../../models/IProps";

const AdminHeader: FC<IProps> = ({ location }) => {
  return (
    <div className="top-bar color-scheme-transparent">
      <div className="top-menu-controls">
        <div className="logged-user-w">
          <div className="logged-user-i">
            <div className="avatar-w">
              <img src="/img/images.png" alt="profile" />
            </div>
            <div className="logged-user-menu color-style-bright">
              <div className="bg-icon">
                <i className="os-icon os-icon-fingerprint"></i>
              </div>
              <ul>
                <li>
                  <NavLink exact to="/in/admin">
                    <i className="os-icon os-icon-layout"></i>
                    <span>Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/in/admin/new-admin">
                    <i className="os-icon os-icon-user-plus"></i>
                    <span>New Admin</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/admin-list">
                    <i className="os-icon os-icon-list"></i>
                    <span>Admin List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/new-lecturer">
                    <i className="os-icon os-icon-user-plus"></i>
                    <span>New Lecturer</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/lecturer-list">
                    <i className="os-icon os-icon-list"></i>
                    <span>Lecturer List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/assign-course">
                    <i className="os-icon os-icon-tasks-checked"></i>
                    <span>Assign Course</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/new-department">
                    <i className="os-icon os-icon-trending-up"></i>
                    <span>New Department</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/department-list">
                    <i className="os-icon os-icon-list"></i>
                    <span>Department List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/new-course">
                    <i className="os-icon os-icon-book-open"></i>
                    <span>New Course</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/course-list">
                    <i className="os-icon os-icon-list"></i>
                    <span>Course List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/active-session">
                    <i className="os-icon os-icon-check-square"></i>
                    <span>Active Session</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/in/admin/max-credit-unit">
                    <i className="os-icon os-icon-pie-chart-3"></i>
                    <span>Max. Credit Unit</span>
                  </NavLink>
                </li>
                <li>
                  <a
                    onClick={() => {
                      // authService.Logout();
                      document.location.reload();
                    }}
                    href="#"
                  >
                    <i className="os-icon os-icon-signs-11"></i>
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminHeader;
