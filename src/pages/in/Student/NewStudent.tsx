import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../../models/IProps";
import { GetAppName } from "../../../context/App";
import IconInput from "../../partials/IconInput";
import ImageUpload from "../../partials/ImageUpload";
import Dropdown from "../../partials/Dropdown";
import { authService } from "../../../services/Auth.Service";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { NEW_STUDENT, ADD_GUARDIAN } from "../../../queries/Student.query";
import { GET_GUARDIAN_TYPES, GET_GUARDIAN_BY_MOBILE } from "../../../queries/Guardian.query";
import { IMessage } from "../../../models/IMessage";
import AlertMessage from "../../partials/AlertMessage";
import LoadingState from "../../partials/loading";
import state from "../../../data/state.json";
import { GET_CLASSES } from "../../../queries/Class.query";
import { GET_LEVELS } from "../../../queries/Level.query";
import { NEW_GUARDIAN } from "../../../queries/Guardian.query";
import gender from "../../../data/gender.json";
import titles from "../../../data/title.json";
import DatePicker from "react-datepicker";
import NotifyProvider from "../../../events/event-resolver";
import { ACTION_EVENT } from "../../../events";
import { NavLink } from "react-router-dom";

const NewStudent: FC<IProps> = ({ history }) => {
    const [lMessage, SetLMessage] = useState<IMessage>();
    const [cMessage, SetCMessage] = useState<IMessage>();
    const [gTypeMessage, SetGTypeMessage] = useState<IMessage>();
    const [newStudent, SetNewStudent] = useState<any>();
    const [newGuardian, SetNewGuardian] = useState<any>();
    const [guardianTypes, SetGuardianTypes] = useState<any>([]);
    const [showGuardian, SetShowGuardian] = useState<boolean>();
    const [newStuMsg, SetNewStuMsg] = useState<IMessage>();
    const [locals, SetLocals] = useState<any>([]);
    const [activeLevelId, SetActiveLevelId] = useState<any>();
    const [levels, SetLevel] = useState<any>([]);
    const [classes, SetClasses] = useState<any>([]);
    const [returnedStu, SetReturnedStu] = useState<any>();
    const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
    const [showGTypeRefresh, SetShowGTypeRefresh] = useState<boolean>(false);
    const [newGuardMsg, SetNewGuardMsg] = useState<IMessage>();
    const [guardByPhoneMsg, SetGuardByPhoneMsg] = useState<IMessage>();
    const [guardianExists, SetGuardianExists] = useState<boolean>(false);
    const [guardianPhone, SetGuardianPhone] = useState<string>();
    const [returnedGuard, SetReturnedGuard] = useState<any>({});
    const [studentId, setStudentId] = useState(undefined);

    // Get  School of logged in user
    const { school } = authService.GetUser();

    const scrollTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    // Get Levels for level input
    const { loading: lLoading, refetch: refetchLevels } = useQuery(GET_LEVELS, {
        variables: {
            school: school.id,
        },
        onError: (err) => {
            SetLMessage({
                message: err.message,
                failed: true,
            });
            SetShowLevelsRefresh(true);
        },
        onCompleted: (data) => {
            if (data && data.GetLevels) {
                SetLevel(
                    data.GetLevels.docs.map((level: any) => ({
                        label: level.name,
                        value: level.id,
                    }))
                );
                SetShowLevelsRefresh(false);
            }
        },
        notifyOnNetworkStatusChange: true,
    });

    // Get classes for class input
    const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
        onError: (err) =>
            SetCMessage({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            if (data)
                SetClasses(
                    data.GetClasses.docs.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );
        },
    });

    // Get Guardian Types for GuardianTypes input
    const { loading: gTypeLoading, refetch: refetchGType } = useQuery(GET_GUARDIAN_TYPES, {
        onError: (err) => {
            SetGTypeMessage({
                message: err.message,
                failed: true,
            });
            SetShowGTypeRefresh(true);
        },
        onCompleted: (data) => {
            if (data && data.GetGuardianTypes) {
                SetGuardianTypes(
                    data.GetGuardianTypes.docs.map((type: any) => ({
                        label: type.name,
                        value: type.id,
                    }))
                );
                SetShowGTypeRefresh(false);
            }
        },
        notifyOnNetworkStatusChange: true,
    });

    // Save New Student record
    const [SaveNewStudent, { loading }] = useMutation(NEW_STUDENT, {
        onError: (err) =>
            SetNewStuMsg({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            if (data) {
                SetReturnedStu(data.NewStudent.doc);
                NotifyProvider.NotifyAll({
                    content: data.NewStudent.doc.id,
                    action: ACTION_EVENT.STUDENT.CREATED,
                });
                setStudentId(data.NewStudent.doc.id);
                document.getElementById("btnGuardModal")?.click();
            }
        },
    });

    // Fetch classes on Level change
    useEffect(() => {
        if (activeLevelId) {
            SetClasses(undefined);
            GetClasses({ variables: { level: activeLevelId } });
        }
    }, [activeLevelId, GetClasses]);

    // Save New Guardian record
    const [SaveNewGuardian, { loading: nGLoading }] = useMutation(NEW_GUARDIAN, {
        onError: (err) =>
            SetNewGuardMsg({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            if (data) {
                SetNewGuardMsg({
                    message: data.NewGuardian.message,
                    failed: false,
                });
                setTimeout(() => {
                    history.push("/in/student-list");
                }, 1000);
            }
        },
    });

    // Get Guardian by Phone number
    const [GetGuardByPhone, { loading: gLoading }] = useLazyQuery(GET_GUARDIAN_BY_MOBILE, {
        onError: (err) => {
            if (err.message.includes("Guardian not found!")) {
                document.getElementById("btnGuardModal")?.click();
                SetGuardianExists(false);
                SetShowGuardian(true);
            } else {
                SetGuardByPhoneMsg({
                    message: err.message,
                    failed: true,
                });
            }
        },
        onCompleted: (data) => {
            if (data && data.GetGuardianByMobile.doc) {
                SetGuardianExists(true);
                SetReturnedGuard(data.GetGuardianByMobile.doc);
            }
        },
    });

    // Add Existing Guardian to Student
    const [AddNewGuardian, { loading: aGLoading }] = useMutation(ADD_GUARDIAN, {
        onError: (err) =>
            SetNewGuardMsg({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            if (data) {
                SetNewGuardMsg({
                    message: data.AddStudentGuardian.message,
                    failed: false,
                });
                setTimeout(() => {
                    document.getElementById("btnGuardModal")?.click();
                    history.push("/in/student-list");
                }, 1000);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>New Student | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        {!showGuardian && <h5 className="element-header">New Student</h5>}
                        {showGuardian && <h5 className="element-header">Student's' Guardian</h5>}

                        <div className="row justify-content-center element-box">
                            {/* Guardian info form*/}
                            {showGuardian && returnedStu && (
                                <div className="col-lg-10 pt-5">
                                    <div className="row pb-4">
                                        <div className="col-12 text-center">
                                            <img
                                                src={returnedStu.passport || "/avatar.png"}
                                                alt="passport"
                                                className="text-center mb-2"
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "150px",
                                                    height: "150px",
                                                }}
                                            />
                                            <h5>{returnedStu.full_name}</h5>
                                            <label>{returnedStu.reg_no}</label>
                                        </div>
                                    </div>

                                    <h5 className="element-header">Guardian Information</h5>

                                    <LoadingState loading={nGLoading} />
                                    <AlertMessage message={newGuardMsg?.message} failed={newGuardMsg?.failed} />
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            scrollTop();

                                            SaveNewGuardian({
                                                variables: {
                                                    model: {
                                                        ...newGuardian,
                                                        phone: guardianPhone,
                                                    },
                                                    student: returnedStu.id,
                                                },
                                            });
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* Title input */}
                                                <Dropdown
                                                    items={titles.titles.map((title: any) => ({
                                                        label: title.label,
                                                        value: title.value,
                                                    }))}
                                                    onSelect={(item: any) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            title: item.label,
                                                        })
                                                    }
                                                    label="Title"
                                                    icon="phone"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* Type input */}
                                                <Dropdown
                                                    items={guardianTypes.map((rel: any) => ({
                                                        label: rel.label,
                                                        value: rel.value,
                                                    }))}
                                                    onSelect={(item: any) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            type: item.value,
                                                        })
                                                    }
                                                    label="Type"
                                                    icon="phone"
                                                />
                                                {showGTypeRefresh && (
                                                    <button
                                                        onClick={() => {
                                                            SetShowGTypeRefresh(false);
                                                            SetGTypeMessage(undefined);
                                                            refetchGType();
                                                        }}
                                                        className="btn btn-primary btn-sm px-1 mb-2"
                                                        type="submit"
                                                    >
                                                        Reload Type
                                                    </button>
                                                )}
                                                <LoadingState loading={gTypeLoading} />
                                                <AlertMessage message={gTypeMessage?.message} failed={gTypeMessage?.failed} />
                                            </div>
                                        </div>
                                        {/* Full name input */}
                                        <IconInput
                                            placeholder="Enter full name"
                                            label="Full Name"
                                            icon="os-icon-ui-09"
                                            required={true}
                                            type="text"
                                            onChange={(name: string) =>
                                                SetNewGuardian({
                                                    ...newGuardian,
                                                    name,
                                                })
                                            }
                                        />
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* Phone number input */}
                                                <IconInput
                                                    placeholder="Enter phone number"
                                                    label="Phone Number"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    disabled={true}
                                                    initVal={guardianPhone}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* Email input */}
                                                <IconInput
                                                    placeholder="Enter email"
                                                    label="Email"
                                                    icon="os-icon-ui-09"
                                                    required={false}
                                                    type="text"
                                                    onChange={(email: string) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            email,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* Gender input */}
                                                <Dropdown
                                                    items={gender.gender.map((item: any) => ({
                                                        label: item.label,
                                                        value: item.value,
                                                    }))}
                                                    onSelect={(item: any) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            gender: item.label,
                                                        })
                                                    }
                                                    label="Gender"
                                                    icon="phone"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* State of Origin input */}
                                                <Dropdown
                                                    items={state.map((item: any, index: number) => ({
                                                        label: item.state.name,
                                                        value: index + "",
                                                    }))}
                                                    onSelect={(item: any) => {
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            state: item.label,
                                                        });
                                                        SetLocals(
                                                            state[item.value].state.locals.map((item: any) => ({
                                                                label: item.name,
                                                                value: item.name,
                                                            }))
                                                        );
                                                    }}
                                                    label="State of Origin"
                                                    icon="phone"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* LGA */}
                                                <Dropdown
                                                    items={locals}
                                                    onSelect={(item: any) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            lga: item.label,
                                                        })
                                                    }
                                                    label="LGA"
                                                    icon="phone"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* Hometown input */}
                                                <IconInput
                                                    placeholder="Enter Hometown"
                                                    label="Hometown"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    onChange={(hometown: string) =>
                                                        SetNewGuardian({
                                                            ...newGuardian,
                                                            hometown,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {/* Address input */}
                                        <IconInput
                                            placeholder="Enter address"
                                            label="Address"
                                            icon="os-icon-ui-09"
                                            required={true}
                                            type="text"
                                            onChange={(address: string) =>
                                                SetNewGuardian({
                                                    ...newGuardian,
                                                    address,
                                                })
                                            }
                                        />
                                        <label>Passport</label>
                                        <ImageUpload
                                            title="Browse passport..."
                                            onData={(image: string) =>
                                                SetNewGuardian({
                                                    ...newGuardian,
                                                    image,
                                                })
                                            }
                                        />
                                        <div className="buttons-w mt-3 mb-5">
                                            <button className="btn btn-primary px-5 mt-3" type="submit">
                                                Save Guardian
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Student info form */}
                            {!showGuardian && (
                                <div className="col-lg-10 pt-5">
                                    <h5 className="element-header">Basic Information</h5>

                                    <AlertMessage message={newStuMsg?.message} failed={newStuMsg?.failed} />
                                    <LoadingState loading={loading} />

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            scrollTop();
                                            SetNewStuMsg(undefined);
                                            if (newStudent.class) {
                                                // Save New student record
                                                SaveNewStudent({
                                                    variables: {
                                                        model: newStudent,
                                                    },
                                                });
                                            } else {
                                                SetCMessage({
                                                    message: "Class does not exist under selected Level!",
                                                    failed: true,
                                                });
                                            }
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* Reg.no input */}
                                                <IconInput
                                                    placeholder="Enter reg. number"
                                                    label="Registration Number"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    onChange={(regNo: string) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            regNo,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* First name input */}
                                                <IconInput
                                                    placeholder="Enter first name"
                                                    label="First Name"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    onChange={(firstname: string) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            firstname,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* Middle name input */}
                                                <IconInput
                                                    placeholder="Enter middle name"
                                                    label="Middle Name"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    onChange={(middlename: string) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            middlename,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {/* Surname input */}
                                                <IconInput
                                                    placeholder="Enter last name"
                                                    label="Last Name"
                                                    icon="os-icon-ui-09"
                                                    required={true}
                                                    type="text"
                                                    onChange={(surname: string) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            surname,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-6 mb-3">
                                                {/* Date of Birth input */}
                                                <label htmlFor="">Date of Birth </label>
                                                <br />
                                                <DatePicker
                                                    placeholderText="day, month year"
                                                    selected={newStudent?.dob}
                                                    onChange={(date) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            dob: date,
                                                        })
                                                    }
                                                    className="form-control"
                                                    dateFormat="d, MMMM yyyy"
                                                />
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                {/*  Date Admission Input */}
                                                <label htmlFor="">Date of Admission </label>
                                                <br />
                                                <DatePicker
                                                    placeholderText="day, month year"
                                                    selected={newStudent?.admissionDate}
                                                    onChange={(date) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            admissionDate: date,
                                                        })
                                                    }
                                                    className="form-control"
                                                    dateFormat="d, MMMM yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                {/* Gender input */}
                                                <Dropdown
                                                    items={gender.gender.map((item: any) => ({
                                                        label: item.label,
                                                        value: item.label,
                                                    }))}
                                                    onSelect={(item: any) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            gender: item.label,
                                                        })
                                                    }
                                                    label="Gender"
                                                    icon="phone"
                                                />
                                            </div>
                                            <div className="col-sm-4">
                                                {/* Level input */}
                                                <Dropdown
                                                    items={levels}
                                                    onSelect={(item: any) => {
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            class: undefined,
                                                        });
                                                        SetCMessage(undefined);
                                                        SetActiveLevelId(item.value);
                                                    }}
                                                    label="Level"
                                                />
                                                {showLevelsRefresh && (
                                                    <button
                                                        onClick={() => {
                                                            SetShowLevelsRefresh(false);
                                                            SetLMessage(undefined);
                                                            refetchLevels();
                                                        }}
                                                        className="btn btn-primary btn-sm px-1 mb-2"
                                                        type="submit"
                                                    >
                                                        Reload Level
                                                    </button>
                                                )}
                                                <LoadingState loading={lLoading} />
                                                <AlertMessage message={lMessage?.message} failed={lMessage?.failed} />
                                            </div>
                                            <div className="col-sm-4">
                                                {/* Current Class input */}
                                                <Dropdown
                                                    items={classes}
                                                    onSelect={(item: any) => {
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            class: item.value,
                                                        });
                                                    }}
                                                    label="Class"
                                                    icon="phone"
                                                />
                                                <LoadingState loading={cLoading} />
                                                <AlertMessage message={cMessage?.message} failed={cMessage?.failed} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* State of Origin input */}
                                                <Dropdown
                                                    items={state.map((item: any, index: number) => ({
                                                        label: item.state.name,
                                                        value: index + "",
                                                    }))}
                                                    onSelect={(item: any) => {
                                                        SetNewStudent({
                                                            ...newStudent,
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
                                            <div className="col-sm-6">
                                                {/* LGA input */}
                                                <Dropdown
                                                    items={locals}
                                                    onSelect={(item: any) =>
                                                        SetNewStudent({
                                                            ...newStudent,
                                                            lga: item.value,
                                                        })
                                                    }
                                                    label="LGA"
                                                    icon="phone"
                                                />
                                            </div>
                                        </div>

                                        {/* Address input */}
                                        <IconInput
                                            placeholder="Enter address"
                                            label="Address"
                                            icon="os-icon-ui-09"
                                            required={false}
                                            type="text"
                                            onChange={(address: string) =>
                                                SetNewStudent({
                                                    ...newStudent,
                                                    address,
                                                })
                                            }
                                        />
                                        <label>Passport</label>
                                        <ImageUpload
                                            title="Browse passport..."
                                            onData={(passport: string) =>
                                                SetNewStudent({
                                                    ...newStudent,
                                                    passport,
                                                })
                                            }
                                        />
                                        <div className="buttons-w mt-3 mb-5">
                                            <button className="btn btn-primary px-5 mt-3" type="submit">
                                                Save & Continue
                                                <i className="os-icon os-icon-arrow-right7 ml-2"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Button to lunch Guardian Phone modal */}
            <button id="btnGuardModal" data-target="#guardianPhoneModal" data-toggle="modal" data-backdrop="static" data-keyboard="false" style={{ display: "none" }}></button>

            {/* Guardian Phone Modal */}
            {returnedStu && (
                <div aria-hidden="true" className="modal fade" id="guardianPhoneModal" role="dialog">
                    <div className="modal-dialog modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Student's Guardian <hr />
                                </h5>
                            </div>
                            <div className="modal-body pb-2">
                                {!guardianExists && (
                                    <div className="element-box no-shadow">
                                        <div className="row pb-4">
                                            <div className="col-12 text-center">
                                                <img
                                                    src={returnedStu.passport || "/avatar.png"}
                                                    alt=""
                                                    className="mb-2"
                                                    style={{
                                                        borderRadius: "50%",
                                                        width: "150px",
                                                        height: "150px",
                                                    }}
                                                />
                                                <h5>{returnedStu.full_name}</h5>
                                                <label>{returnedStu.reg_no}</label>
                                                <hr />
                                            </div>
                                        </div>
                                        <LoadingState loading={gLoading} />
                                        <AlertMessage message={guardByPhoneMsg?.message} failed={guardByPhoneMsg?.failed} />
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                SetGuardByPhoneMsg(undefined);
                                                GetGuardByPhone({
                                                    variables: {
                                                        mobile: guardianPhone,
                                                    },
                                                });
                                            }}
                                        >
                                            <div className="row">
                                                {/* Phone number input */}
                                                <div className="col-12">
                                                    <IconInput
                                                        placeholder="Enter Guardian Phone number"
                                                        label="Guardian Phone"
                                                        icon="os-icon-phone"
                                                        required={true}
                                                        type="text"
                                                        onChange={(mobile: string) => {
                                                            SetGuardianPhone(mobile);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 buttons-w mb-5">
                                                    <button className="btn btn-primary px-5" type="submit">
                                                        Continue
                                                    </button>
                                                    <a href={`/in/student/${studentId}`} className="btn btn-default btn-link px-5" type="button">
                                                        Skip
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {guardianExists && (
                                    <div className="element-box no-shadow">
                                        <div className="row pb-4">
                                            <div className="col-12 text-center">
                                                <img
                                                    src={returnedGuard.image || "/avatar.png"}
                                                    alt=""
                                                    className="mb-2"
                                                    style={{
                                                        borderRadius: "50%",
                                                        width: "150px",
                                                        height: "150px",
                                                    }}
                                                />
                                                <h5>{returnedGuard.name}</h5>
                                                <label htmlFor="">{returnedGuard.phone}</label>
                                                <hr />
                                                <AlertMessage message={newGuardMsg?.message} failed={newGuardMsg?.failed} />
                                                <LoadingState loading={aGLoading} />
                                                <b>Guardian with entered phone number already exists.</b>
                                                <label htmlFor="">Do you want to use this Guardian?</label>

                                                <div className="text-center mt-3">
                                                    <button
                                                        className="btn btn-secondary mr-2"
                                                        onClick={() => {
                                                            SetReturnedGuard(undefined);
                                                            SetGuardianExists(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-success ml-2"
                                                        onClick={() => {
                                                            AddNewGuardian({
                                                                variables: {
                                                                    id: returnedStu.id,
                                                                    guardianId: returnedGuard.id,
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        Use Guardian
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewStudent;
