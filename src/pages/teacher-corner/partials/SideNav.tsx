/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { GetAppName, GET_LOGO } from "../../../context/App";
import { teacherAuthService } from "../../../services/teacher.auth.service";
import Image from "../../partials/Image";

interface SideProps {
  location?: any;
}

const SideNav: FC<SideProps> = ({ location }) => {
  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Logged in User
  const { name, image, first_name, phone } = teacherAuthService.GetTeacher();
  return (
    <>
      <div
        id="sideNav"
        className="menu-w color-scheme-light menu-position-side menu-side-left
         menu-layout-compact sub-menu-style-over sub-menu-color-bright 
         selected-menu-color-light menu-activated-on-hover menu-has-selected-link 
         nav-bg-color"
      >
        <div className="logo-w">
          <NavLink className="logo" to="/teacher/app">
            <div style={{ display: "inline" }}>
              <img style={{ width: "48px" }} alt="logo" src={GET_LOGO} />
            </div>
            <div className="logo-label">{GetAppName()}</div>
          </NavLink>
        </div>
        <ul className="main-menu">
          <li className="menu-link">
            <NavLink exact to="/teacher/app" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-ui-90"></div>
              </div>
              <span>Your Profile</span>
            </NavLink>
          </li>
          <li className="menu-link">
            <NavLink to="/teacher/app/timetable" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-ui-83"></div>
              </div>
              <span>Timetable</span>
            </NavLink>
          </li>
          <li className="menu-link">
            <NavLink to="/teacher/app/attendance" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-agenda-1"></div>
              </div>
              <span>Attendance</span>
            </NavLink>
          </li>
          <li className="menu-link">
            <NavLink to="/teacher/app/feedback" onClick={() => scrollTop()}>
              <div className="icon-w">
                <div className="os-icon os-icon-mail-14"></div>
              </div>
              <span>Send Feedback</span>
            </NavLink>
          </li>
          <li className="menu-link">
            <NavLink
              to="/teacher/app/update-password"
              onClick={() => scrollTop()}
            >
              <div className="icon-w">
                <div className="os-icon os-icon-ui-46"></div>
              </div>
              <span>Change Password</span>
            </NavLink>
          </li>

          <li className="menu-link">
            <a
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  teacherAuthService.Logout();
                  document.location.href = "/teacher/login";
                }
              }}
            >
              <div className="icon-w">
                <div className="os-icon os-icon-signs-11"></div>
              </div>
              <span>Logout</span>
            </a>
          </li>
        </ul>
        <span className="m-2">Teacher</span>
        <div className="logged-user-w avatar-inline">
          <div className="logged-user-i">
            <Image alt={first_name} src={image} width={40} />

            <div className="logged-user-info-w">
              <div className="logged-user-name">{name}</div>
              <div className="logged-user-role">{phone}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
