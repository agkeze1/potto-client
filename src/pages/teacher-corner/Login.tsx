import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GET_LOGO } from "../../context/App";
import { NavLink } from "react-router-dom";
import Input from "../partials/Input";
import LoadingState from "../partials/loading";
import { useMutation } from "@apollo/react-hooks";

import { IProps } from "../../models/IProps";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../context/App";
import { TEACHER_LOGIN } from "../../queries/Teacher.query";
import { teacherAuthService } from "../../services/teacher.auth.service";

const TeacherLogin: React.FC<IProps> = ({ history }) => {
    document.body.className = "auth-wrapper";

    const [email, SetEmail] = useState<string>();
    const [password, SetPassword] = useState<string>();

    // Check if user is already logged in
    if (teacherAuthService.IsAuthenticated()) {
        history.push("/teacher/app");
    }

    const [Login, { loading }] = useMutation(TEACHER_LOGIN, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            const { doc, token, message } = data.TeacherLogin;
            teacherAuthService.Login(doc, token);
            toast.success(message, {
                position: "bottom-center",
            });
        },
    });

    return (
        <>
            <Helmet>
                <title> Teacher Login | {GetAppName()}</title>
            </Helmet>
            <div className="all-wrapper menu-side with-pattern scale-in-bottom">
                <div className="auth-box-w">
                    <div className="logo-w">
                        <a className="image--parent" href="/">
                            <img alt="application-logo" width="80" src={GET_LOGO} />
                        </a>
                        <h6 className="mt-1">{GetAppName()}</h6>
                    </div>
                    <h4 className="auth-header">Teacher's Login</h4>
                    <form
                        className="pb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            // Reset Message

                            if (email && password) {
                                // Login
                                await Login({
                                    variables: {
                                        email,
                                        password,
                                    },
                                });
                                if (teacherAuthService.IsAuthenticated()) {
                                    document.location.href = "/teacher/app";
                                }
                            }
                        }}
                    >
                        {/* Email input */}
                        <Input
                            name="email"
                            placeholder="Enter email or phone"
                            label="Email / Phone"
                            onChange={(email: string) => {
                                SetEmail(email);
                            }}
                            icon="os-icon-user-male-circle"
                            required={true}
                            type="text"
                        />

                        {/* Password input */}
                        <Input
                            name="password"
                            placeholder="Enter password"
                            label="Password"
                            onChange={(password: string) => {
                                SetPassword(password);
                            }}
                            icon="os-icon-fingerprint"
                            required={true}
                            type="password"
                        />
                        <LoadingState loading={loading} />
                        <div className="buttons-w pb-3">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? <span>Please wait</span> : <span>Login</span>}
                                <div className="os-icon os-icon-arrow-right7"></div>
                            </button>
                            <NavLink className="btn btn-link text-primary" to="/teacher/reset-password">
                                Forgot password?
                            </NavLink>
                        </div>
                    </form>
                    <a className="text-center font-sm footer pb-3 text-primary" href="http://afari.com">
                        <img src="/img/lloydant.png" alt="" className="logo-footer mr-2" />
                        Powered by Afari
                    </a>
                </div>
            </div>
        </>
    );
};
export default TeacherLogin;
