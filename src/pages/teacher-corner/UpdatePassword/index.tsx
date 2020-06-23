import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_PASSWORD_TEACHER } from "../../../queries/Teacher.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import { teacherAuthService } from "../../../services/teacher.auth.service";

const UpdateTeacherPassword = () => {
    const [currentPassword, setCurrentPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [changeFunc, { loading }] = useMutation(UPDATE_PASSWORD_TEACHER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const { token, message } = d.UpdateTeacherPassword;
            toast.success(message);
            const teacher = teacherAuthService.GetTeacher();
            teacherAuthService.Login(teacher, token);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
    });

    return (
        <>
            <Helmet>
                <title>Update Password | {GetAppName()}</title>
            </Helmet>

            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div className="row justify-content-center">
                            <div className="col-md-5 col-12">
                                <div className="element-box no-bg bg-white mt-5" style={{ minHeight: "50vh" }}>
                                    <h5 className="element-header">Update Password</h5>

                                    <form
                                        onSubmit={async (event) => {
                                            event.preventDefault();
                                            if (currentPassword && newPassword) {
                                                if (newPassword === confirmPassword) await changeFunc({ variables: { old: currentPassword, _new: newPassword } });
                                                else toast.info("Passwords do not match!");
                                            } else {
                                                toast.warn("Current and new passwords are required!", {
                                                    position: "top-right",
                                                });
                                            }
                                        }}
                                    >
                                        <div className="form-group">
                                            <label htmlFor="current_password">Current Password</label>
                                            <input
                                                defaultValue={currentPassword}
                                                onChange={({ currentTarget: { value } }) => setCurrentPassword(value)}
                                                placeholder="enter current password"
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                id="current_password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password</label>
                                            <input
                                                defaultValue={newPassword}
                                                onChange={({ currentTarget: { value } }) => setNewPassword(value)}
                                                placeholder="enter new password"
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                id="password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirm_password">Confirm Password</label>
                                            <input
                                                defaultValue={confirmPassword}
                                                onChange={({ currentTarget: { value } }) => setConfirmPassword(value)}
                                                placeholder="confirm password"
                                                type="password"
                                                className="form-control"
                                                name="confirm_password"
                                                id="confirm_password"
                                            />
                                        </div>
                                        <div className="form-group text-right">
                                            <button className="btn btn-primary" type="submit">
                                                Submit
                                            </button>
                                            <LoadingState loading={loading} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateTeacherPassword;
