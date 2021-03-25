import React, { FC, useState, useEffect } from "react";
import { IProps } from "./../../../models/IProps";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, CLEAN_DATE, GetAge } from "./../../../context/App";
import { Redirect, NavLink } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { GET_TEACHER, UPDATE_TEACHER_PASSWORD } from "../../../queries/Teacher.query";
import LoadingState from "../../partials/loading";
import TeacherTTAccordion from "../../partials/TeacherTTAccordion";
import MessageEditor from "../../partials/MessagingEditor";
import { SEND_TEACHER_MESSAGE } from "../../../queries/teacher-message.query";
import { User } from "../../../models/User.model";
import { authService } from "./../../../services/Auth.Service";
import IconInput from "../../partials/IconInput";

const TeacherDetails: FC<IProps> = ({ match }) => {
    const { id } = match.params;
    const user = authService.GetUser();
    const [model, setModel] = useState({ password: "", confirm: "" });

    const [teacher, setTeacher] = useState<any>();

    const [getTeacherFunc, { loading }] = useLazyQuery(GET_TEACHER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const { doc } = d.GetTeacher;
            setTeacher(doc);
        }
    });
    const [sendMessageFunc, { loading: messageLoading }] = useMutation(SEND_TEACHER_MESSAGE, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            toast.success(d.SendTeachersMessage.message);
        }
    });

    const [changePasswordFunc, { loading: changing }] = useMutation(UPDATE_TEACHER_PASSWORD, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            toast.success(d.AdminUpdateTeacherPassword.message);
            setModel({ password: "", confirm: "" });
        }
    });

    useEffect(() => {
        if (id) getTeacherFunc({ variables: { id } });
    }, [id, getTeacherFunc]);

    if (!id) {
        return <Redirect to="/in/teacher-list" />;
    }
    return (
        <>
            <Helmet>
                <title>
                    {teacher?.name || "Teacher Detail"} | {GetAppName()}
                </title>
            </Helmet>
            <div>
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">Teacher Profile</h5>
                        <LoadingState loading={loading || messageLoading} />
                        {teacher && (
                            <div className="element-box">
                                <div className="text-left">
                                    <NavLink to="/in/teacher-list">
                                        <i
                                            className="icon-lg os-icon os-icon-arrow-left6"
                                            style={{ fontSize: "25px" }}
                                        ></i>
                                    </NavLink>
                                </div>
                                <div className="text-center mb-5">
                                    <img
                                        className="avatar mb-3 no-scale"
                                        alt="Passport"
                                        src={teacher.image || "/avatar.png"}
                                        style={{
                                            width: "200px",
                                            height: "200px"
                                        }}
                                    />

                                    <h3 className="up-header ">{teacher.name}</h3>
                                    <h6 className="up-sub-header">
                                        {teacher.phone}
                                        {/* <i className="os-icon os-icon-check-circle text-success ml-2" title="Email verified"></i> */}
                                    </h6>
                                </div>

                                <div className="os-tabs-w">
                                    <div className="os-tabs-controls">
                                        <ul className="nav nav-tabs smaller">
                                            {/* Basic Info Tab */}
                                            <li className="nav-item text-uppercase">
                                                <a className="nav-link active" data-toggle="tab" href="#basic-info">
                                                    Basic Info
                                                </a>
                                            </li>

                                            {/* Timetable Tab */}
                                            <li className="nav-item text-uppercase">
                                                <a className="nav-link" data-toggle="tab" href="#timetable">
                                                    Timetable
                                                </a>
                                            </li>
                                            {/* MESSAGE */}
                                            <li className="nav-item text-uppercase">
                                                <a className="nav-link" data-toggle="tab" href="#message">
                                                    Send Message
                                                </a>
                                            </li>

                                            {user && user.admin && (
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link" data-toggle="tab" href="#password">
                                                        Change Password
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        {/* Basic Information */}
                                        <div className="tab-pane active" id="basic-info">
                                            <div className="text-center element-box no-bg no-shadow">
                                                <ul className="pro-details">
                                                    <li>
                                                        <span>Gender</span> | <b>{teacher.gender}</b>
                                                    </li>
                                                    <li>
                                                        <span>Date of Birth</span> | <b>{CLEAN_DATE(teacher.dob)}</b>
                                                        <span className="badge badge-primary ml-2 rounded p-1">
                                                            {GetAge(teacher.dob)} Years
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span>Phone number</span> | <b>{teacher.phone}</b>
                                                    </li>
                                                    <li>
                                                        <span>Employment date</span> | <b>{CLEAN_DATE(teacher.doj)} </b>
                                                        <span className="badge badge-primary ml-2 rounded p-1">
                                                            {GetAge(teacher.doj)} Years
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span>Email Address</span> |{" "}
                                                        <b>
                                                            {teacher.email || (
                                                                <span className="text-danger">No Email Address</span>
                                                            )}
                                                        </b>
                                                    </li>
                                                    <li>
                                                        <span>Address</span> | <b>{teacher.address}</b>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Timetable */}
                                        <div className="tab-pane" id="timetable">
                                            <div className="text-center element-box no-bg no-shadow">
                                                <TeacherTTAccordion day="Monday" />
                                                <TeacherTTAccordion day="Tuesday" />
                                                <TeacherTTAccordion day="Wednesday" />
                                                <TeacherTTAccordion day="Thursday" />
                                                <TeacherTTAccordion day="Friday" />
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="message">
                                            <div className="slit-in-vertical">
                                                <MessageEditor
                                                    onSubmit={async (message: string) =>
                                                        await sendMessageFunc({
                                                            variables: {
                                                                model: {
                                                                    message,
                                                                    excluded: [],
                                                                    teachers: [teacher.id]
                                                                }
                                                            }
                                                        })
                                                    }
                                                    total={1}
                                                />
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="password">
                                            <div className="row">
                                                <div className="col-6">
                                                    <form
                                                        onSubmit={async (event) => {
                                                            event.preventDefault();
                                                            if (model.password !== model.confirm)
                                                                return toast.warn("Passwords do not match!");
                                                            await changePasswordFunc({
                                                                variables: { id, password: model.password }
                                                            });
                                                        }}
                                                    >
                                                        <IconInput
                                                            placeholder="Enter password"
                                                            label="Password"
                                                            icon="os-icon-fingerprint"
                                                            required={true}
                                                            type="password"
                                                            name="password"
                                                            onChange={(password: string) => {
                                                                setModel({
                                                                    ...model,
                                                                    password
                                                                });
                                                            }}
                                                        />
                                                        <IconInput
                                                            name="confirm-password"
                                                            placeholder="Confirm password"
                                                            label="Confirm Password"
                                                            onChange={(confirm: string) => {
                                                                setModel({ ...model, confirm });
                                                            }}
                                                            icon="os-icon-fingerprint"
                                                            required={true}
                                                            type="password"
                                                        />
                                                        <LoadingState loading={changing} />
                                                        <button type="submit" className="btn btn-primary">
                                                            Update Password
                                                            <div className="os-icon os-icon-arrow-right7"></div>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherDetails;
