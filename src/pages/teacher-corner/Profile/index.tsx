import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, cleanDate, GetAge, CleanMessage } from "./../../../context/App";
import { teacherAuthService } from "../../../services/teacher.auth.service";
import Image from "./../../partials/Image";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { UPDATE_TEACHER } from "../../../queries/Teacher.query";
import LoadingState from "../../partials/loading";

const TeacherProfile = () => {
    const teacher = teacherAuthService.GetTeacher();

    const [editTeacher, setEditTeacher] = useState(teacher);

    const [updateTeacherFunc, { loading }] = useMutation(UPDATE_TEACHER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d) {
                const { message } = d.UpdateTeacher;
                toast.success(message, {
                    position: "bottom-right",
                });
            }
        },
    });

    return (
        <>
            <Helmet>
                <title> Your Profile {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div>
                            <h5 className="element-header">Your Profile</h5>
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <div className="element-box bg-no bg-white">
                                        <div className="text-center">
                                            <Image src={teacher.image} alt={teacher.first_name} width={100} />
                                            <h2 className="up-header ">{teacher.name}</h2>
                                            <h6 className="up-sub-header">
                                                {teacher.email}
                                                <i className="os-icon os-icon-check-circle text-success ml-2" title="Email verified"></i>
                                            </h6>
                                        </div>
                                        <div>
                                            <div className="text-center element-box no-bg no-shadow">
                                                <ul className="pro-details">
                                                    <li>
                                                        <span>Gender</span> | <b>{teacher.gender}</b>
                                                    </li>
                                                    <li>
                                                        <span>Date of Birth</span> | <b>{cleanDate(teacher.dob, true, false)}</b>
                                                        <span className="badge badge-primary ml-2 p-1">{GetAge(teacher.dob)}Yrs</span>
                                                    </li>
                                                    <li>
                                                        <span>Phone number</span> | <b>{teacher.phone}</b>
                                                    </li>
                                                    <li>
                                                        <span>Employment date</span> | <b>{cleanDate(teacher.doj, true, false)}</b>
                                                        <span className="badge badge-primary ml-2 p-1">{GetAge(teacher.doj)}Yrs</span>
                                                    </li>
                                                    <li>
                                                        <span>Address</span> | <b>{teacher.address}</b>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-8">
                                    <div className="element-box no-bg bg-white">
                                        <div className="element-info">
                                            <div className="element-info-with-icon">
                                                <div className="element-info-icon">
                                                    <div className="os-icon os-icon-wallet-loaded"></div>
                                                </div>
                                                <div className="element-info-text">
                                                    <h5 className="element-inner-header">Profile Settings</h5>
                                                    <div className="element-inner-desc">Date of joining cannot be modified</div>
                                                </div>
                                            </div>
                                        </div>
                                        <form
                                            onSubmit={async (event) => {
                                                event.preventDefault();
                                                await updateTeacherFunc({
                                                    variables: {
                                                        id: teacher.id,
                                                        model: {
                                                            firstname: editTeacher.first_name,
                                                            lastname: editTeacher.last_name,
                                                            middlename: editTeacher.middle_name,
                                                            email: editTeacher.email,
                                                            phone: editTeacher.phone,
                                                            gender: editTeacher.gender,
                                                            address: editTeacher.address,
                                                            dob: editTeacher.dob,
                                                        },
                                                    },
                                                });
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <div className="form-group">
                                                        <label htmlFor="fname"> First Name</label>
                                                        <input
                                                            defaultValue={editTeacher.first_name}
                                                            onChange={({ currentTarget: { value } }) => setEditTeacher({ ...editTeacher, first_name: value })}
                                                            className="form-control"
                                                            placeholder="First Name"
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="form-group">
                                                        <label htmlFor="lname">Last Name</label>
                                                        <input
                                                            defaultValue={editTeacher.last_name}
                                                            onChange={({ currentTarget: { value } }) => setEditTeacher({ ...editTeacher, last_name: value })}
                                                            className="form-control"
                                                            id="lname"
                                                            placeholder="Last Name"
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Mname">Middle Name</label>
                                                        <input
                                                            defaultValue={editTeacher.middle_name}
                                                            onChange={({ currentTarget: { value } }) => setEditTeacher({ ...editTeacher, middle_name: value })}
                                                            className="form-control"
                                                            id="Mname"
                                                            placeholder="Middle Name"
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email"> Email address</label>
                                                <input
                                                    className="form-control"
                                                    defaultValue={editTeacher.email}
                                                    onChange={({ currentTarget: { value } }) => setEditTeacher({ ...editTeacher, email: value })}
                                                    placeholder="Enter email"
                                                    required={true}
                                                    type="email"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone"> Phone Number</label>
                                                <input className="form-control" value={teacher.phone} id="phone" disabled={true} type="text" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="doj"> Date of Joining</label>
                                                <input className="form-control" value={new Date(teacher.doj).toDateString()} id="doj" disabled={true} type="text" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Contact Address</label>
                                                <textarea
                                                    defaultValue={editTeacher.address}
                                                    onChange={({ currentTarget: { value } }) => setEditTeacher({ ...editTeacher, address: value })}
                                                    id="address"
                                                    className="form-control"
                                                    rows={2}
                                                ></textarea>
                                            </div>
                                            <div className="form-buttons-w">
                                                <button className="btn btn-primary" type="submit">
                                                    Save Changes
                                                </button>
                                            </div>
                                            <LoadingState loading={loading} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherProfile;
