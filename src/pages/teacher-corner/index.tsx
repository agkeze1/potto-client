import React, { FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { teacherAuthService } from "../../services/teacher.auth.service";
import { IProps } from "./../../models/IProps";
import SideNav from "./partials/SideNav";
import TeacherProfile from "./Profile";
import { Switch, Route } from "react-router-dom";

const TeacherCorner: FC<IProps> = ({ location }) => {
    const { name } = teacherAuthService.GetTeacher();
    return (
        <>
            <Helmet>
                <title>
                    {name} | {GetAppName()}
                </title>
            </Helmet>

            <div className="all-wrapper with-side-panel solid-bg-all">
                <div className="layout-w">
                    {/* Main sidebar */}
                    <SideNav location={location} />

                    <div className="content-w">
                        {/* Header */}
                        <div className="content-panel-toggler">
                            <i className="os-icon os-icon-grid-squares-22"></i>
                            <span>Sidebar</span>
                        </div>

                        {/* Content */}
                        <div className="main-container">
                            <Switch>
                                <Route exact path="/teacher/app/profile" component={TeacherProfile} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default TeacherCorner;
