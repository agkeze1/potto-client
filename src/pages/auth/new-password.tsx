import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GET_LOGO, GetParamFromQuery } from "../../context/App";
import Input from "../partials/Input";
import LoadingState from "../partials/loading";

import { toast } from "react-toastify";
import { CleanMessage } from "../../context/App";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import { authService } from "../../services/Auth.Service";
import { NEW_USER_PASSWORD } from "../../queries/User.query";

const UserNewPassword = () => {
    document.body.className = "auth-wrapper";

    const email = GetParamFromQuery("email");
    const token = GetParamFromQuery("token");

    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [changeFunc, { loading }] = useMutation(NEW_USER_PASSWORD, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            const { message, token, doc } = data.NewUserPassword;
            toast.success(message);
            authService.Login(doc, token);
        },
    });
    if (!email || !token) return <Redirect to="/" />;
    return (
        <>
            <Helmet>
                <title> New Password | {GetAppName()}</title>
            </Helmet>
            <div className="all-wrapper menu-side with-pattern scale-in-bottom">
                <div className="auth-box-w">
                    <div className="logo-w">
                        <a href="/">
                            <img alt="application-logo" width="70" src={GET_LOGO} />
                        </a>
                        <h6 className="mt-1">{GetAppName()}</h6>
                    </div>
                    <h4 className="auth-header">New Password</h4>
                    <form
                        className="pb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (newPassword === confirmPassword) {
                                await changeFunc({ variables: { email, password: newPassword, token } });
                                if (authService.IsAuthenticated()) {
                                    document.location.href = "/in";
                                }
                            } else {
                                toast.warning("Password do not match!");
                            }
                        }}
                    >
                        <Input
                            name="password"
                            placeholder="Enter password"
                            label="Password"
                            onChange={(password: string) => {
                                setNewPassword(password);
                            }}
                            icon="os-icon-fingerprint"
                            required={true}
                            type="password"
                        />
                        <Input
                            name="confirm-password"
                            placeholder="confirm password"
                            label="Confirm Password"
                            onChange={(password: string) => {
                                setConfirmPassword(password);
                            }}
                            icon="os-icon-fingerprint"
                            required={true}
                            type="password"
                        />

                        <LoadingState loading={loading} />
                        <div className="text-center pb-3">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? <span>Please wait</span> : <span>Submit</span>}
                                <div className="os-icon os-icon-arrow-right7"></div>
                            </button>
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
export default UserNewPassword;
