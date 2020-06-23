import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GET_LOGO } from "../../context/App";
import Input from "../partials/Input";
import LoadingState from "../partials/loading";
import { useLazyQuery } from "@apollo/react-hooks";

import { toast } from "react-toastify";
import { CleanMessage } from "../../context/App";
import { PASSWORD_RESET } from "../../queries/Teacher.query";
import { NavLink } from "react-router-dom";

const TeacherPasswordReset = () => {
    document.body.className = "auth-wrapper";

    const [email, SetEmail] = useState<string>();

    const [resetFunc, { loading }] = useLazyQuery(PASSWORD_RESET, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            toast.success(data.PasswordReset);
        },
    });

    return (
        <>
            <Helmet>
                <title> Teacher Password Reset | {GetAppName()}</title>
            </Helmet>
            <div className="all-wrapper menu-side with-pattern slide-in-elliptic-top-fwd">
                <div className="auth-box-w">
                    <div className="logo-w">
                        <a href="/">
                            <img alt="application-logo" width="48" src={GET_LOGO} />
                        </a>
                        <h6 className="mt-1">{GetAppName()}</h6>
                    </div>
                    <h4 className="auth-header">Teacher's Password Reset</h4>
                    <form
                        className="pb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await resetFunc({ variables: { no: email } });
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

                        <LoadingState loading={loading} />
                        <div className="text-center pb-3">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? <span>Please wait</span> : <span>Reset Password</span>}
                                <div className="os-icon os-icon-arrow-right7"></div>
                            </button>
                            <NavLink className="btn btn-link text-primary" to="/teacher/login">
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
export default TeacherPasswordReset;
