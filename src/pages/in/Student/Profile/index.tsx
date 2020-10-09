/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable-next-line */
import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../../context/App";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_STUDENT, UPDATE_STUDENT } from "../../../../queries/Student.query";
import { toast } from "react-toastify";
import { IProps } from "../../../../models/IProps";
import Subjects from "./Subjects";
import { GET_SUB_BY_LEVEL } from "../../../../queries/Subject.query";
import LoadingState from "../../../partials/loading";
import BasicInfo from "./BasicInfo";
import state from "../../../../data/state.json";
import gender from "../../../../data/gender.json";
import DatePicker from "react-datepicker";
import Guardian from "./Guardian";
import SubjectAttendance from "./Attendance/SubjectAttendance";
import LargeImage from "../../partials/LargeImage";
import IconInput from "../../../partials/IconInput";
import Select from "react-select";

const StudentProfile: FC<IProps> = ({ history, match }) => {
    const [activeStudent, SetActiveStudent] = useState<any>();
    const [editStudent, SetEditStudent] = useState<any>();

    // For lga under a state
    const [locals, SetLocals] = useState<any>([]);

    //   Student Id from match object passed
    const { id } = match.params;

    //   Get student with id passed
    const { loading } = useQuery(GET_STUDENT, {
        variables: { id },
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            if (data) {
                SetActiveStudent(data.GetStudent.doc);
                GetSubByLevel({
                    variables: {
                        level: data.GetStudent.doc.current_class?.level?.id,
                    },
                });
            }
        },
        fetchPolicy: "network-only",
    });

    // Get List of subjects of Student's level
    const [GetSubByLevel, { loading: sLoading, data: sData }] = useLazyQuery(GET_SUB_BY_LEVEL, {
        onError: (err) => toast.error(CleanMessage(err.message)),
    });

    // Update Student
    const [UpdateStudent, { loading: uLoading }] = useMutation(UPDATE_STUDENT, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            toast.success(data.UpdateStudent.message);
            SetActiveStudent(data.UpdateStudent.doc);
            setTimeout(() => {
                document.getElementById("btnModal")?.click();
            }, 1000);
        },
    });

    return (
        <>
            <Helmet>
                <title> Student Profile {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div>
                            <h5 className="element-header tracking-in-contract">Student Profile</h5>
                            <LoadingState loading={loading} />
                            {activeStudent && (
                                <div className="element-box ">
                                    <div className="row">
                                        <div className="col-12">
                                            <a
                                                href="javascript:void(0)"
                                                title="Edit"
                                                className="icon-lg m-3 float-right"
                                                onClick={() => {
                                                    SetEditStudent({
                                                        firstname: activeStudent.first_name,
                                                        middlename: activeStudent.middle_name,
                                                        surname: activeStudent.surname,
                                                        regNo: activeStudent.reg_no,
                                                        gender: activeStudent.gender,
                                                        address: activeStudent.address,
                                                        dob: activeStudent.dob,
                                                        state: activeStudent.state,
                                                        lga: activeStudent.lga,
                                                    });

                                                    setTimeout(() => {
                                                        document.getElementById("btnModal")?.click();
                                                    }, 0);
                                                }}
                                            >
                                                <i className="os-icon os-icon-edit"></i>
                                            </a>
                                            <a
                                                href="javascript:void(0)"
                                                title="Back"
                                                className="icon-lg m-3 float-left"
                                                onClick={() => {
                                                    history.goBack();
                                                }}
                                            >
                                                <i className="os-icon os-icon-arrow-left6"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="text-center mb-5 mt-n3">
                                        {/* Profile Picture */}
                                        <LargeImage imgPath={activeStudent.passport} />

                                        <h4 className="up-header text-uppercase mt-3">{activeStudent.full_name}</h4>
                                        <h6 className="up-sub-header text-uppercase text-primary">{activeStudent.reg_no}</h6>
                                    </div>
                                    <div className="os-tabs-w">
                                        <div className="os-tabs-controls">
                                            <ul className="nav nav-tabs smaller">
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link active" data-toggle="tab" href="#basic-info">
                                                        Basic Info
                                                    </a>
                                                </li>
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link" data-toggle="tab" href="#subjects">
                                                        Subjects
                                                    </a>
                                                </li>
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link" data-toggle="tab" href="#guardians">
                                                        Guardians
                                                    </a>
                                                </li>
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link" data-toggle="tab" href="#attendance">
                                                        Attendance
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="tab-content">
                                            {/* Basic Information */}
                                            <div className="tab-pane active" id="basic-info">
                                                <BasicInfo student={activeStudent} />
                                            </div>

                                            {/* Selected Subject */}
                                            <div className="tab-pane" id="subjects">
                                                <Subjects
                                                    subjects={activeStudent.selected_subjects.length > 0 ? activeStudent.selected_subjects : sData?.GetSubjectsForRegistration.docs}
                                                    selected={activeStudent.selected_subjects.length > 0}
                                                />
                                                <LoadingState loading={sLoading} />
                                            </div>

                                            {/* Guardians List*/}
                                            <div className="tab-pane" id="guardians">
                                                <Guardian student={activeStudent} />
                                            </div>

                                            {/* Student attendance */}
                                            <div className="tab-pane" id="attendance">
                                                <div className="os-tabs-w">
                                                    <div className="os-tabs-controls">
                                                        {/* Tab header */}
                                                        <ul className="nav nav-tabs ">
                                                            <li className="nav-item">
                                                                <a className="nav-link active" data-toggle="tab" href="#schoolAtt">
                                                                    School Att.
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" data-toggle="tab" href="#classAtt">
                                                                    Roll Call Att.
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" data-toggle="tab" href="#subjectAtt">
                                                                    Subjects Att.
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="tab-content">
                                                        {/* School Attendance */}
                                                        <div className="tab-pane active" id="schoolAtt">
                                                            <div className="text-center element-box no-bg no-shadow">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Date</th>
                                                                                <th>In</th>
                                                                                <th>Out</th>
                                                                                <th>Device</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>1</td>
                                                                                <td>21st Jan. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>2</td>
                                                                                <td>29st Jan. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>
                                                                                    <label className="badge badge-danger-inverted">Absent</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>3</td>
                                                                                <td>6th Feb. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Roll Call Attendance */}
                                                        <div className="tab-pane" id="classAtt">
                                                            <div className="text-center element-box no-bg no-shadow">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Date</th>
                                                                                <th>Status</th>
                                                                                <th>Device</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>1</td>
                                                                                <td>21st Jan. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-success-inverted">Attended</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>2</td>
                                                                                <td>29st Jan. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-danger-inverted">Absent</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>3</td>
                                                                                <td>6th Feb. 2020</td>
                                                                                <td>
                                                                                    <label className="badge badge-warning-inverted">Exempted</label>
                                                                                </td>
                                                                                <td>Device Component</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Subject Attendance */}
                                                        <div className="tab-pane" id="subjectAtt">
                                                            <SubjectAttendance studentId={activeStudent?.id} />
                                                        </div>
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
            </div>

            {/* Hidden button to lunch edit modal */}
            <button type="button" id="btnModal" data-target="#editModal" data-toggle="modal" style={{ display: "none" }}></button>

            {/* Edit Student Modal */}
            {editStudent?.dob && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Edit Student Info <hr />
                                </h5>
                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body element-box no-shadow pb-2">
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        UpdateStudent({
                                            variables: {
                                                id,
                                                model: editStudent,
                                            },
                                        });
                                    }}
                                >
                                    <div className="row">
                                        {/* First Name input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter first name"
                                                label="First Name"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={editStudent.firstname}
                                                onChange={(firstname: string) => {
                                                    SetEditStudent({
                                                        ...editStudent,
                                                        firstname,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Middle Name input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter middle name"
                                                label="Middle Name"
                                                icon="os-icon-phone"
                                                required={true}
                                                type="text"
                                                initVal={editStudent.middlename}
                                                onChange={(middlename: string) => {
                                                    SetEditStudent({
                                                        ...editStudent,
                                                        middlename,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Last Name input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter last name"
                                                label="Last Name"
                                                icon="os-icon-phone"
                                                required={true}
                                                type="text"
                                                initVal={editStudent.surname}
                                                onChange={(surname: string) => {
                                                    SetEditStudent({
                                                        ...editStudent,
                                                        surname,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Reg. Number input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter Reg. umber"
                                                label="Reg. Number"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={editStudent.regNo}
                                                onChange={(regNo: string) => {
                                                    SetEditStudent({
                                                        ...editStudent,
                                                        regNo,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/* Gender input */}
                                            <div className="form-group">
                                                <label htmlFor="departmental">Gender</label>
                                                <Select
                                                    options={gender.gender}
                                                    value={{
                                                        label: editStudent.gender,
                                                        value: editStudent.gender,
                                                    }}
                                                    onChange={(item: any) => {
                                                        SetEditStudent({
                                                            ...editStudent,
                                                            gender: item.label,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor="">Date of Birth </label>
                                            <br />
                                            <DatePicker
                                                selected={new Date(editStudent.dob)}
                                                onChange={(date) =>
                                                    SetEditStudent({
                                                        ...editStudent,
                                                        dob: date,
                                                    })
                                                }
                                                className="form-control"
                                                dateFormat="d, MMMM yyyy"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="departmental">State</label>
                                                {/* State of Origin input */}
                                                <Select
                                                    options={state.map((item: any, index: number) => ({
                                                        label: item.state.name,
                                                        value: index + "",
                                                    }))}
                                                    value={{
                                                        label: editStudent.state,
                                                        value: editStudent.state,
                                                    }}
                                                    onChange={(item: any) => {
                                                        SetEditStudent({
                                                            ...editStudent,
                                                            state: item.label,
                                                        });
                                                        SetLocals(
                                                            state[item.value].state.locals.map((item: any) => ({
                                                                value: item.name,
                                                                label: item.name,
                                                            }))
                                                        );
                                                    }}
                                                    label="State of Origin"
                                                    icon="phone"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="departmental">LGA</label>
                                                {/* LGA input */}
                                                <Select
                                                    options={locals}
                                                    value={{
                                                        label: editStudent.lga,
                                                        value: editStudent.lga,
                                                    }}
                                                    onChange={(item: any) =>
                                                        SetEditStudent({
                                                            ...editStudent,
                                                            lga: item.label,
                                                        })
                                                    }
                                                    label="LGA"
                                                    icon="phone"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Input */}
                                    <IconInput
                                        placeholder="Enter address"
                                        label="Address"
                                        icon="os-icon-ui-09"
                                        required={true}
                                        type="text"
                                        initVal={editStudent.address}
                                        onChange={(address: string) => {
                                            SetEditStudent({
                                                ...editStudent,
                                                address,
                                            });
                                        }}
                                    />
                                    <LoadingState loading={uLoading} />
                                    <div className="buttons-w my-4">
                                        <button className="btn btn-primary px-5" type="submit">
                                            <span className="os-icon os-icon-save mr-2"></span>
                                            Update Student
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentProfile;
