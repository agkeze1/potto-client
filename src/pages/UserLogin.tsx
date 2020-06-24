import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GET_LOGO } from "../context/App";
import { NavLink } from "react-router-dom";
import Input from "./partials/Input";
import LoadingState from "./partials/loading";
import { authService } from "../services/Auth.Service";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { FIRST_USER, USER_LOGIN } from "../queries/User.query";
import { HAS_SCHOOL } from "../queries/School.query";
import { IProps } from "../models/IProps";
import { toast } from "react-toastify";
import { CleanMessage } from "./../context/App";

const UserLogin: React.FC<IProps> = ({ history }) => {
    document.body.className = "auth-wrapper";

    const [email, SetEmail] = useState<string>();
    const [password, SetPassword] = useState<string>();

    // Check if user is already logged in
    if (authService.IsAuthenticated()) {
        history.push("/in");
    }

    // Check if any school exists
    const { data } = useQuery(HAS_SCHOOL, {
        onCompleted: () => {
            if (data && !data.HasSchool) {
                history.push("/default_school");
            }
        },
    });

    // Checks if first User already exists
    const { data: uData } = useQuery(FIRST_USER, {
        onCompleted: () => {
            if (uData && uData.FirstSetup) {
                history.push("/signup");
            }
        },
    });

    const [Login, { loading }] = useMutation(USER_LOGIN, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            const { doc, token } = data.Login;
            authService.Login(doc, token);
        },
    });

    return (
        <>
            {!data && !uData && (
                <h5 className="text-center" style={{ paddingTop: "15%", color: "lightGrey" }}>
                    <img src="./loading.gif" alt="loading" style={{ width: "50px" }} /> <br />
                    loading
                </h5>
            )}
            {data && uData && (
                <>
                    <Helmet>
                        <title> Login | {GetAppName()}</title>
                    </Helmet>
                    <div className="all-wrapper menu-side with-pattern">
                        <div className="auth-box-w">
                            <div className="logo-w">
                                <a href="/">
                                    <img alt="application-logo" width="80" src={GET_LOGO} />
                                </a>
                                <h6 className="mt-1">{GetAppName()}</h6>
                            </div>
                            <h4 className="auth-header">Login</h4>
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
                                        if (authService.IsAuthenticated()) {
                                            document.location.href = "/in";
                                        } else {
                                            toast.error("Incorrect Username or Password!");
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
                                    type="email"
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
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                        <div className="os-icon os-icon-arrow-right7"></div>
                                    </button>
                                    <NavLink className="btn btn-link text-primary" to="#">
                                        Forgot password?
                                    </NavLink>
                                </div>

                                <div className="text-center">
                                    <NavLink className="btn btn-link text-primary text-center" to="/teacher/login">
                                        Teacher's Corner
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
            )}
        </>
    );
};
export default UserLogin;
