/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
// import { authService } from "../../../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";

const Header: FC<IProps> = ({ location }) => {
    return (
        <div id="header" className="top-bar color-scheme-transparent">
            <div className="top-menu-controls">
                <div className="element-search autosuggest-search-activator">
                    <input placeholder="Start typing to search for students..." />
                </div>
                <div className="logged-user-w">
                    <div className="logged-user-i">
                        <div className="avatar-w">
                            <img src="/avatar.png" alt="menu" />
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
                                    <a
                                        onClick={() => {
                                            authService.Logout();
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
export default Header;
