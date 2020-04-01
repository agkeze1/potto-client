import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import { authService } from "../../services/Auth.Service";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { NEW_STUDENT } from "../../queries/Student.query";
import { GET_GUARDIAN_TYPES } from "../../queries/Guardian.query";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import state from "../../data/state.json";
import { GET_CLASSES } from "../../queries/Class.query";
import { GET_LEVELS } from "../../queries/Level.query";
import { NEW_GUARDIAN } from "../../queries/Guardian.query";
import gender from "../../data/gender.json";
import titles from "../../data/title.json";
import type from "../../data/guardian-type.json";

const NewStudent: FC<IProps> = ({ history }) => {
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [gTypeMessage, SetGTypeMessage] = useState<IMessage>();
  const [newStudent, SetNewStudent] = useState<any>();
  const [newGuardian, SetNewGuardian] = useState<any>();
  const [guardianTypes, SetGuardianTypes] = useState<any>([]);
  const [showGuardian, SetShowGuardian] = useState<boolean>();
  const [newStuMsg, SetNewStuMsg] = useState<IMessage>();
  const [newGuardMsg, SetNewGuardMsg] = useState<IMessage>();
  const [locals, SetLocals] = useState<any>([]);
  const [activeLevelId, SetActiveLevelId] = useState<any>();
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [returnedStu, SetReturnedStu] = useState<any>();
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showGTypeRefresh, SetShowGTypeRefresh] = useState<boolean>(false);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School of logged in user
  const { school } = authService.GetUser();

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Get Levels for level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: {
      school: school.id
    },
    onError: err => {
      SetLMessage({
        message: err.message,
        failed: true
      });
      SetShowLevelsRefresh(true);
    },
    onCompleted: data => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id
          }))
        );
        SetShowLevelsRefresh(false);
      }
    }
  });

  // Get Levels on Reload level button click
  const [GetLevels, { loading: llLoading }] = useLazyQuery(GET_LEVELS, {
    variables: {
      school: school.id
    },
    onError: err => {
      SetLMessage({
        message: err.message,
        failed: true
      });
      SetShowLevelsRefresh(true);
    },
    onCompleted: data => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id
          }))
        );
        SetShowLevelsRefresh(false);
      }
    }
  });

  // Get classes for class input
  const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
    onError: err =>
      SetCMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data)
        SetClasses(
          data.GetClasses.docs.map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        );
    }
  });

  // Get Guardian Types for GuardianTypes input
  const { loading: gTypeLoading } = useQuery(GET_GUARDIAN_TYPES, {
    onError: err => {
      SetGTypeMessage({
        message: err.message,
        failed: true
      });
      SetShowGTypeRefresh(true);
    },
    onCompleted: data => {
      if (data && data.GetGuardianTypes) {
        SetGuardianTypes(
          data.GetGuardianTypes.docs.map((type: any) => ({
            label: type.name,
            value: type.id
          }))
        );
        SetShowGTypeRefresh(false);
      }
    }
  });

  // Get Guardian Types on Reload GuardianTypes button click
  const [GetGuardianTypes, { loading: ggTypeLoading }] = useLazyQuery(
    GET_GUARDIAN_TYPES,
    {
      onError: err => {
        SetGTypeMessage({
          message: err.message,
          failed: true
        });
        SetShowGTypeRefresh(true);
      },
      onCompleted: data => {
        if (data && data.GetGuardianTypes) {
          SetGuardianTypes(
            data.GetGuardianTypes.docs.map((level: any) => ({
              label: level.name,
              value: level.id
            }))
          );
          SetShowGTypeRefresh(false);
        }
      }
    }
  );

  // Save New Student record
  const [SaveNewStudent, { loading }] = useMutation(NEW_STUDENT, {
    onError: err =>
      SetNewStuMsg({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data) SetReturnedStu(data.NewStudent.doc);
      SetShowGuardian(true);
    }
  });

  // Fetch classes on Level change
  useEffect(() => {
    if (activeLevelId) {
      SetClasses(undefined);
      GetClasses({ variables: { level: activeLevelId } });
    }
  }, [activeLevelId]);

  // Save New Student record
  const [SaveNewGuardian, { loading: gLoading }] = useMutation(NEW_GUARDIAN, {
    onError: err =>
      SetNewGuardMsg({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data) {
        SetNewGuardMsg({
          message: data.NewGuardian.message,
          failed: false
        });
        setTimeout(() => {
          history.push("/in/student-list");
        }, 1000);
      }
    }
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
            {showGuardian && (
              <h5 className="element-header">Student's' Guardian</h5>
            )}

            <div className="row justify-content-center element-box">
              {/* Student info */}
              {!showGuardian && (
                <div className="col-lg-10 pt-5">
                  <h5 className="element-header">Basic Information</h5>

                  <AlertMessage
                    message={newStuMsg?.message}
                    failed={newStuMsg?.failed}
                  />
                  <LoadingState loading={loading} />

                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      scrollTop();
                      console.log("Student record: ", newStudent);
                      SetNewStuMsg(undefined);
                      if (newStudent.class) {
                        // Save New student record
                        SaveNewStudent({
                          variables: {
                            model: newStudent
                          }
                        });
                      } else {
                        SetCMessage({
                          message: "Class does not exist under selected Level!",
                          failed: true
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
                              regNo
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
                              firstname
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
                              middlename
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
                              surname
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6">
                        {/* Date of Birth input */}
                        <label htmlFor="">Date of Birth</label>
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <div className="os-icon os-icon-calendar"></div>
                            </div>
                          </div>
                          <input
                            type="date"
                            className="form-control"
                            required
                            onChange={({ currentTarget }) =>
                              SetNewStudent({
                                ...newStudent,
                                dob: currentTarget.value
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        {/* Admission Date */}
                        <label htmlFor="">Date of Admission</label>
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <div className="os-icon os-icon-calendar"></div>
                            </div>
                          </div>
                          <input
                            type="date"
                            className="form-control"
                            required
                            onChange={({ currentTarget }) =>
                              SetNewStudent({
                                ...newStudent,
                                admissionDate: currentTarget.value
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        {/* Gender input */}
                        <Dropdown
                          items={gender.gender.map((item: any) => ({
                            label: item.label,
                            value: item.label
                          }))}
                          onSelect={(item: any) =>
                            SetNewStudent({
                              ...newStudent,
                              gender: item.label
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
                              class: undefined
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
                              GetLevels();
                            }}
                            className="btn btn-primary btn-sm px-1 mb-2"
                            type="submit"
                          >
                            Reload Level
                          </button>
                        )}
                        <LoadingState loading={lLoading || llLoading} />
                        <AlertMessage
                          message={lMessage?.message}
                          failed={lMessage?.failed}
                        />
                      </div>
                      <div className="col-sm-4">
                        {/* Current Class input */}
                        <Dropdown
                          items={classes}
                          onSelect={(item: any) => {
                            SetNewStudent({
                              ...newStudent,
                              class: item.value
                            });
                          }}
                          label="Class"
                          icon="phone"
                        />
                        <LoadingState loading={cLoading} />
                        <AlertMessage
                          message={cMessage?.message}
                          failed={cMessage?.failed}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        {/* State of Origin input */}
                        <Dropdown
                          items={state.map((item: any, index: number) => ({
                            label: item.state.name,
                            value: index + ""
                          }))}
                          onSelect={(item: any) => {
                            SetNewStudent({
                              ...newStudent,
                              state: item.label
                            });
                            SetLocals(
                              state[item.value].state.locals.map(
                                (item: any) => ({
                                  value: item.name,
                                  label: item.name
                                })
                              )
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
                              lga: item.value
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
                          address
                        })
                      }
                    />
                    <label>Passport</label>
                    <ImageUpload
                      title="Browse passport..."
                      onData={(passport: string) =>
                        SetNewStudent({
                          ...newStudent,
                          passport
                        })
                      }
                    />
                    <div className="buttons-w mt-3 mb-5">
                      <button
                        className="btn btn-primary px-5 mt-3"
                        type="submit"
                      >
                        Save & Continue
                        <i className="os-icon os-icon-arrow-right7 ml-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Guardian info */}
              {showGuardian && returnedStu && (
                <div className="col-lg-10 pt-5">
                  <div className="row pb-4">
                    <div className="col-12 text-center">
                      <img
                        src={returnedStu.passport}
                        alt=""
                        className="text-center mb-2"
                        style={{
                          borderRadius: "50%",
                          width: "150px",
                          height: "150px"
                        }}
                      />
                      <h5>
                        {returnedStu.first_name +
                          " " +
                          returnedStu.middle_name +
                          " " +
                          returnedStu.surname}
                      </h5>
                      <label>{returnedStu.reg_no}</label>
                    </div>
                  </div>

                  <h5 className="element-header">Guardian Information</h5>

                  <LoadingState loading={gLoading} />
                  <AlertMessage
                    message={newGuardMsg?.message}
                    failed={newGuardMsg?.failed}
                  />
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      scrollTop();

                      SaveNewGuardian({
                        variables: {
                          model: newGuardian,
                          student: returnedStu.id
                        }
                      });
                    }}
                  >
                    <div className="row">
                      <div className="col-sm-6">
                        {/* Title input */}
                        <Dropdown
                          items={titles.titles.map((title: any) => ({
                            label: title.label,
                            value: title.value
                          }))}
                          onSelect={(item: any) =>
                            SetNewGuardian({
                              ...newGuardian,
                              title: item.label
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
                            value: rel.value
                          }))}
                          onSelect={(item: any) =>
                            SetNewGuardian({
                              ...newGuardian,
                              type: item.value
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
                              GetGuardianTypes();
                            }}
                            className="btn btn-primary btn-sm px-1 mb-2"
                            type="submit"
                          >
                            Reload Type
                          </button>
                        )}
                        <LoadingState loading={gTypeLoading || ggTypeLoading} />
                        <AlertMessage
                          message={gTypeMessage?.message}
                          failed={gTypeMessage?.failed}
                        />
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
                          name
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
                          onChange={(phone: string) =>
                            SetNewGuardian({
                              ...newGuardian,
                              phone
                            })
                          }
                        />
                      </div>
                      <div className="col-sm-6">
                        {/* Email input */}
                        <IconInput
                          placeholder="Enter email"
                          label="Email"
                          icon="os-icon-ui-09"
                          required={true}
                          type="text"
                          onChange={(email: string) =>
                            SetNewGuardian({
                              ...newGuardian,
                              email
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
                            value: item.value
                          }))}
                          onSelect={(item: any) =>
                            SetNewGuardian({
                              ...newGuardian,
                              gender: item.label
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
                            value: index + ""
                          }))}
                          onSelect={(item: any) => {
                            SetNewGuardian({
                              ...newGuardian,
                              state: item.label
                            });
                            SetLocals(
                              state[item.value].state.locals.map(
                                (item: any) => ({
                                  label: item.name,
                                  value: item.name
                                })
                              )
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
                              lga: item.label
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
                              hometown
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
                          address
                        })
                      }
                    />
                    <label>Passport</label>
                    <ImageUpload
                      title="Browse passport..."
                      onData={(image: string) =>
                        SetNewGuardian({
                          ...newGuardian,
                          image
                        })
                      }
                    />
                    <div className="buttons-w mt-3 mb-5">
                      <button
                        className="btn btn-primary px-5 mt-3"
                        type="submit"
                      >
                        Save Guardian
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewStudent;
