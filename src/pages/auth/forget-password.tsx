import React, { useState } from "react";
import Helmet from "react-helmet";
import { CleanMessage, GetAppName, GET_LOGO } from "./../../context/App";
import Input from "./../partials/Input";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { PASSWORD_RESET } from "../../queries/User.query";
import LoadingState from "../partials/loading";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>();

    const [sendResetFunc, { loading }] = useMutation(PASSWORD_RESET, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.UserPasswordReset) {
                toast.success(data.UserPasswordReset);
                setTimeout(() => {
                    document.location.href = "/";
                }, 500);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Forgot Password | {GetAppName()}</title>
            </Helmet>
            <div className="all-wrapper menu-side with-pattern scale-in-bottom">
                <div className="auth-box-w">
                    <div className="logo-w">
                        <a href="/">
                            <img alt="application-logo" width="80" src={GET_LOGO} />
                        </a>
                        <h6 className="mt-1">{GetAppName()}</h6>
                    </div>
                    <h4 className="auth-header">Password Reset</h4>
                    <form
                        className="pb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await sendResetFunc({ variables: { email } });
                        }}
                    >
                        {/* Email input */}
                        <Input name="email" placeholder="Enter email" label="Email" onChange={(email: string) => setEmail(email)} icon="os-icon-user-male-circle" required={true} type="email" />

                        <LoadingState loading={loading} />
                        <div className="text-center pb-3">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? <span>Please wait</span> : <span>Reset Password</span>}
                                <div className="os-icon os-icon-arrow-right7"></div>
                            </button>
                            <NavLink className="btn btn-link text-primary" to="/">
                                Back to Login
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

export default ForgotPassword;
