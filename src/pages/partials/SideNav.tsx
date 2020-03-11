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

      {/* <ul className="main-menu">
        <li className="sub-header">
          <span>Layouts</span>
        </li>
        <li className="selected has-sub-menu">
          <a href="index.html">
            <div className="icon-w">
              <div className="os-icon os-icon-layout"></div>
            </div>
            <span>Dashboard</span>
          </a>
          <div className="sub-menu-w">
            <div className="sub-menu-header">Dashboard</div>
            <div className="sub-menu-icon">
              <i className="os-icon os-icon-layout"></i>
            </div>
            <div className="sub-menu-i">
              <ul className="sub-menu">
                <li>
                  <a href="index.html">Dashboard 1</a>
                </li>
                <li>
                  <a href="apps_crypto.html">
                    Crypto Dashboard{" "}
                    <strong className="badge badge-danger">Hot</strong>
                  </a>
                </li>
                <li>
                  <a href="apps_support_dashboard.html">Dashboard 3</a>
                </li>
                <li>
                  <a href="apps_projects.html">Dashboard 4</a>
                </li>
                <li>
                  <a href="apps_bank.html">Dashboard 5</a>
                </li>
                <li>
                  <a href="layouts_menu_top_image.html">Dashboard 6</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className="has-sub-menu">
          <a href="layouts_menu_top_image.html">
            <div className="icon-w">
              <div className="os-icon os-icon-layers"></div>
            </div>
            <span>Menu Styles</span>
          </a>
          <div className="sub-menu-w">
            <div className="sub-menu-header">Menu Styles</div>
            <div className="sub-menu-icon">
              <i className="os-icon os-icon-layers"></i>
            </div>
            <div className="sub-menu-i">
              <ul className="sub-menu">
                <li>
                  <a href="layouts_menu_side_full.html">Side Menu Light</a>
                </li>
                <li>
                  <a href="layouts_menu_side_full_dark.html">Side Menu Dark</a>
                </li>
                <li>
                  <a href="layouts_menu_side_transparent.html">
                    Side Menu Transparent{" "}
                    <strong className="badge badge-danger">New</strong>
                  </a>
                </li>
                <li>
                  <a href="apps_pipeline.html">Side &amp; Top Dark</a>
                </li>
                <li>
                  <a href="apps_projects.html">Side &amp; Top</a>
                </li>
                <li>
                  <a href="layouts_menu_side_mini.html">Mini Side Menu</a>
                </li>
              </ul>
              <ul className="sub-menu">
                <li>
                  <a href="layouts_menu_side_mini_dark.html">Mini Menu Dark</a>
                </li>
                <li>
                  <a href="layouts_menu_side_compact.html">Compact Side Menu</a>
                </li>
                <li>
                  <a href="layouts_menu_side_compact_dark.html">
                    Compact Menu Dark
                  </a>
                </li>
                <li>
                  <a href="layouts_menu_right.html">Right Menu</a>
                </li>
                <li>
                  <a href="layouts_menu_top.html">Top Menu Light</a>
                </li>
                <li>
                  <a href="layouts_menu_top_dark.html">Top Menu Dark</a>
                </li>
              </ul>
              <ul className="sub-menu">
                <li>
                  <a href="layouts_menu_top_image.html">
                    Top Menu Image{" "}
                    <strong className="badge badge-danger">New</strong>
                  </a>
                </li>
                <li>
                  <a href="layouts_menu_sub_style_flyout.html">
                    Sub Menu Flyout
                  </a>
                </li>
                <li>
                  <a href="layouts_menu_sub_style_flyout_dark.html">
                    Sub Flyout Dark
                  </a>
                </li>
                <li>
                  <a href="layouts_menu_sub_style_flyout_bright.html">
                    Sub Flyout Bright
                  </a>
                </li>
                <li>
                  <a href="layouts_menu_side_compact_click.html">
                    Menu Inside Click
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul> */}

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
          <NavLink to="/in/new-super-admin" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-user-plus"></div>
            </div>
            <span>New Super Admin</span>
          </NavLink>
        </li>
        <li className="menu-link">
          <NavLink to="/in/super-admin-list" onClick={() => scrollTop()}>
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
          <NavLink to="/in/new-guardian" onClick={() => scrollTop()}>
            <div className="icon-w">
              <div className="os-icon os-icon-list"></div>
            </div>
            <span>New Guardian</span>
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
