/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { GetAppName, GET_LOGO } from "../../../context/App";
import Image from "../../partials/Image";
import { NavLink } from "react-router-dom";
import { teacherAuthService } from "../../../services/teacher.auth.service";

const MobileMenu = () => {
  const { name, image, email } = teacherAuthService.GetTeacher();

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
            <div className="mobile-menu-trigger">
              <div className="os-icon os-icon-hamburger-menu-1"></div>
            </div>
          </div>
        </div>
        <div className="menu-and-user">
          <div className="logged-user-w">
            <Image alt={name} src={image} width={40} />
            <div className="logged-user-info-w">
              <div className="logged-user-name">{name}</div>
              <div className="logged-user-role">{email}</div>
            </div>
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
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
