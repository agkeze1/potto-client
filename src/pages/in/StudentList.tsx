/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";
import SwitchInput from "../partials/SwitchInput";
import AttAccordion from "../partials/AttAccordion";
import ImageUpload from "../partials/ImageUpload";
import IconInput from "../partials/IconInput";
import { IImageProp } from "../../models/IImageProp";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { GET_LEVELS } from "../../queries/Level.query";
import gender from "../../data/gender.json";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import { GET_CLASSES } from "../../queries/Class.query";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import state from "../../data/state.json";
import title from "../../data/title.json";
import Select from "react-select";
import Pagination from "../partials/Pagination";
import DatePicker from "react-datepicker";
import {
  GET_GUARDIAN_TYPES,
  GET_GUARDIAN_BY_MOBILE,
} from "../../queries/Guardian.query";
import {
  SEARCH_STUDENTS,
  REMOVE_STUDENT,
  UPDATE_STUDENT,
  ADD_GUARDIAN,
} from "../../queries/Student.query";
import { NEW_GUARDIAN } from "../../queries/Guardian.query";
import { GET_SUB_BY_LEVEL } from "../../queries/Subject.query";
import { SubjectList } from "./partials/SubjectList";

const StudentList: FC<IProps> = ({ history }) => {
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });

  const [showFilter, SetShowFilter] = useState<boolean>(true);
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [showNewGuardian, SetShowNewGuardian] = useState<boolean>(false);

  // For lga under a state
  const [locals, SetLocals] = useState<any>([]);

  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();
  const [nGMessage, SetNGMessage] = useState<IMessage>();
  const [subMessage, SetSubMessage] = useState<IMessage>();

  const [activeStudentId, SetActiveStudentId] = useState<string>();
  const [activeStudent, SetActiveStudent] = useState<any>({});
  const [editStudent, SetEditStudent] = useState<any>({});

  // Guardian Type refresh
  const [showGTRefresh, SetShowGTRefresh] = useState<boolean>(false);
  const [newGuardian, SetNewGuardian] = useState<any>({});

  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showClassesRefresh, SetShowClassesRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [classes, SetClasses] = useState<any>([]);

  // For New Guardian of Student
  const [guardByPhoneMsg, SetGuardByPhoneMsg] = useState<IMessage>();
  const [newGuardMsg, SetNewGuardMsg] = useState<IMessage>();
  const [guardianExists, SetGuardianExists] = useState<boolean>(false);
  const [guardianPhone, SetGuardianPhone] = useState<string>();
  const [returnedGuard, SetReturnedGuard] = useState<any>({});

  //Filters
  const [searchInput, SetSearchInput] = useState<any>();
  const [searchMsg, SetSearchMsg] = useState<IMessage>();

  const [guardType, SetGuardType] = useState<any>([]);
  const [gTMessage, SetGTMessage] = useState<IMessage>();

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(25);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Get School of logged in user
  const { school } = authService.GetUser();

  // Get Levels for level input
  const { loading: lLoading, data: lData } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: (err) => {
      SetLMessage({
        message: err.message,
        failed: true,
      });
      SetShowLevelsRefresh(true);
    },
    onCompleted: () => {
      if (lData && lData.GetLevels) {
        SetLevel(
          lData.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
        SetShowLevelsRefresh(false);
      }
    },
  });

  // Get Levels on Reload level button click
  const [GetLevels, { loading: llLoading }] = useLazyQuery(GET_LEVELS, {
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
  });

  // Get classes for class input
  const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
    onError: (err) => {
      SetCMessage({
        message: err.message,
        failed: true,
      });
      SetShowClassesRefresh(true);
    },
    onCompleted: (data) => {
      if (data)
        SetClasses(
          data.GetClasses.docs.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      SetShowClassesRefresh(false);
    },
  });

  // Get Students
  const [SearchStudents, { loading, data, fetchMore }] = useLazyQuery(
    SEARCH_STUDENTS,
    {
      onError: (err) =>
        SetMessage({
          message: err.message,
          failed: true,
        }),
    }
  );

  // Get Guardian Types for input
  const [GetGuardianTypes, { loading: gTLoading }] = useLazyQuery(
    GET_GUARDIAN_TYPES,
    {
      onError: (err) => {
        SetGTMessage({
          message: err.message,
          failed: true,
        });
        SetShowGTRefresh(true);
      },
      onCompleted: (data) => {
        if (data) {
          SetGuardType(
            data.GetGuardianTypes.docs.map((type: any) => ({
              label: type.name,
              value: type.id,
            }))
          );
        }
      },
    }
  );

  // Fetch More students on Page change
  useEffect(() => {
    if (fetchMore)
      fetchMore({
        variables: { page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            SearchStudents: fetchMoreResult.SearchStudents,
          };
        },
      });
  }, [page]);

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (searchInput?.level?.id) {
      SetClasses(undefined);
      GetClasses({ variables: { level: searchInput?.level?.id } });
    }
  }, [searchInput?.level?.id]);

  // Remove Student
  const [RemoveStudent, { loading: rLoading }] = useMutation(REMOVE_STUDENT, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: SEARCH_STUDENTS,
        variables: {
          variables: {
            regNo: searchInput?.regNo,
            level: searchInput?.level?.id,
            _class: searchInput?._class?.id,
            page,
            limit,
          },
        },
      });

      const index = q.SearchStudents.docs.findIndex(
        (i: any) => i.id === data.RemoveStudent.doc.id
      );

      q.SearchStudents.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
        data: { SearchStudents: q.SearchStudents },
      });
    },
  });

  // Update Student
  const [UpdateStudent, { loading: uLoading }] = useMutation(UPDATE_STUDENT, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateStudent.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
      });

      const index = q.SearchStudents.docs.findIndex(
        (i: any) => i.id === data.UpdateStudent.doc.id
      );

      q.SearchStudents.docs.splice(index, 1);
      q.SearchStudents.docs.unshift(data.UpdateStudent.doc);

      //update
      cache.writeQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
        data: { SearchStudents: q.SearchStudents },
      });
    },
  });

  // Create New Guardian
  const [NewGuardian, { loading: nGLoading }] = useMutation(NEW_GUARDIAN, {
    onError: (err) => {
      SetNGMessage({
        message: err.message,
        failed: true,
      });
      SetShowClassesRefresh(true);
    },
    onCompleted: (data) => {
      if (data && activeStudent) {
        const guardians = activeStudent?.guardians;
        guardians.unshift(data.NewGuardian.doc);
        SetActiveStudent({
          ...activeStudent,
          guardians,
        });
        SetShowNewGuardian(false);
      }
    },
  });

  // Get Guardian by Phone number
  const [GetGuardByPhone, { loading: gLoading }] = useLazyQuery(
    GET_GUARDIAN_BY_MOBILE,
    {
      onError: (err) => {
        if (err.message.includes("Guardian not found.")) {
          document.getElementById("btnGuardModal")?.click();
          SetGuardianExists(false);
          SetShowNewGuardian(true);
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
    }
  );

  // Add Existing Guardian to Student
  const [AddNewGuardian, { loading: aGLoading }] = useMutation(ADD_GUARDIAN, {
    onError: (err) =>
      SetNewGuardMsg({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      if (data && activeStudent) {
        SetActiveStudent({
          ...activeStudent,
          guardians: data.AddStudentGuardian.doc.guardians,
        });
        SetNewGuardMsg({
          message: data.AddStudentGuardian.message,
          failed: false,
        });
        setTimeout(() => {
          document.getElementById("btnGuardModal")?.click();
        }, 1000);
      }
    },
  });

  // Get List of subjects of Student level
  const [GetSubByLevel, { loading: sLoading, data: sData }] = useLazyQuery(
    GET_SUB_BY_LEVEL,
    {
      onError: (err) => {
        SetSubMessage({
          message: err.message,
          failed: true,
        });
      },
    }
  );

  return (
    <>
      <Helmet>
        <title>Student List | {GetAppName()}</title>
      </Helmet>
      {!showProfile && (
        <div className="content-box">
          <div className="element-wrapper">
            <span className="element-actions mt-n2">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => {
                  history.push("/in/new-student");
                }}
              >
                <i className="os-icon os-icon-ui-22"></i>
                <span>Create New</span>
              </button>
            </span>
            <h5 className="element-header">Student List</h5>
            <div className="element-box">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <AlertMessage
                    message={searchMsg?.message}
                    failed={searchMsg?.failed}
                  />
                  <span
                    className="element-actions"
                    style={{ marginTop: "-1.5rem" }}
                  >
                    <SwitchInput
                      isOn={showFilter}
                      handleToggle={() => {
                        SetShowFilter(!showFilter);
                      }}
                      label="Show Filter"
                    />
                  </span>
                  <h5 className="element-header">Filter Student</h5>
                </div>
                {showFilter && (
                  <>
                    <div className="col-lg-4">
                      {/* Reg No input */}
                      <IconInput
                        placeholder="Enter student reg.no"
                        label="Search by Reg. no"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        initVal={searchInput?.regNo}
                        onChange={(regNo: string) => {
                          SetActiveLevel(undefined);
                          SetClasses(undefined);
                          SetSearchInput({
                            ...searchInput,
                            level: undefined,
                            _class: undefined,
                            regNo,
                          });
                        }}
                      />
                    </div>
                    <div className="col-lg-4">
                      {/* Level input */}
                      <label>
                        Level <br />
                      </label>
                      <Select
                        options={levels}
                        value={{
                          label: activeLevel?.name || (
                            <span className="text-gray">Select...</span>
                          ),
                          value: activeLevel?.id,
                        }}
                        onChange={(item: any) => {
                          SetActiveLevel({
                            name: item?.label,
                            id: item?.value,
                          });
                          SetSearchInput({
                            ...searchInput,
                            regNo: "",
                            _class: undefined,
                            level: {
                              name: item.label,
                              id: item.value,
                            },
                          });
                        }}
                      />
                      {showLevelsRefresh && (
                        <button
                          onClick={() => {
                            SetShowLevelsRefresh(false);
                            SetLMessage(undefined);
                            GetLevels({
                              variables: {
                                school: school.id,
                              },
                            });
                          }}
                          className="btn btn-primary btn-sm px-1 my-2"
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
                    <div className="col-lg-4">
                      {/* Current Class input */}
                      <label>
                        Class <br />
                      </label>
                      <Select
                        options={classes}
                        value={{
                          label: searchInput?._class?.name || (
                            <span className="text-gray">Select...</span>
                          ),
                          value: searchInput?._class?.id,
                        }}
                        onChange={(item: any) => {
                          SetSearchInput({
                            ...searchInput,
                            regNo: "",
                            level: undefined,
                            _class: {
                              name: item.label,
                              id: item.value,
                            },
                          });
                        }}
                      />
                      {showClassesRefresh && (
                        <button
                          onClick={() => {
                            SetShowClassesRefresh(false);
                            SetCMessage(undefined);
                            SetMessage(undefined);
                            GetClasses({
                              variables: { level: searchInput?._class?.id },
                            });
                          }}
                          className="btn btn-primary btn-sm px-1 my-2"
                          type="submit"
                        >
                          Reload Classes
                        </button>
                      )}
                      <LoadingState loading={cLoading} />
                      <AlertMessage
                        message={cMessage?.message}
                        failed={cMessage?.failed}
                      />
                    </div>
                    <div className="col-lg-12">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (searchInput) {
                            SetSearchMsg(undefined);
                            SetMessage(undefined);
                            SetRMessage(undefined);
                            SearchStudents({
                              variables: {
                                regNo: searchInput?.regNo,
                                level: searchInput?.level?.id,
                                _class: searchInput?._class?.id,
                                page,
                                limit,
                              },
                            });
                          } else {
                            SetSearchMsg({
                              message: "No search field enetered!",
                              failed: true,
                            });
                          }
                        }}
                      >
                        Search record
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Students list */}
            <div className="row justify-content-center ">
              <div className="col-12">
                <LoadingState loading={loading || rLoading} />
                <AlertMessage
                  message={message?.message}
                  failed={message?.failed}
                />
                <AlertMessage
                  message={rMessage?.message}
                  failed={rMessage?.failed}
                />
              </div>

              {data && data.SearchStudents.docs.length > 0 && (
                <>
                  <div className="col-lg-12">
                    <div className="element-box no-bg bg-white">
                      <div className="table-responsive">
                        <h6 className="element-header">
                          Returned Students of{" "}
                          <b className="text-primary">
                            ({" "}
                            {
                              data?.SearchStudents?.docs[0]?.current_class
                                ?.level?.name
                            }{" "}
                            )
                          </b>
                        </h6>
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Image</th>
                              <th>Fullname</th>
                              <th>Reg. No</th>
                              <th>Class</th>
                              <th>Gender</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.SearchStudents?.docs.map(
                              (stu: any, index: number) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div
                                      onClick={() => {
                                        SetActiveImg({
                                          image: stu.passport,
                                          name: stu.full_name,
                                        });
                                      }}
                                      className="user-with-avatar clickable"
                                      data-target="#imageModal"
                                      data-toggle="modal"
                                    >
                                      <img
                                        src={stu.passport || "/avatar.png"}
                                        alt=""
                                      />
                                    </div>
                                  </td>
                                  <td>{stu.full_name}</td>
                                  <td>{stu.reg_no}</td>
                                  <td>{stu.current_class?.name}</td>
                                  <td>{stu.gender}</td>
                                  <td className="row-actions text-center">
                                    <a
                                      href="#"
                                      title="View profile"
                                      onClick={() => {
                                        SetShowProfile(true);
                                        SetActiveStudent(stu);
                                        GetGuardianTypes();
                                        GetSubByLevel({
                                          variables: {
                                            level: stu.current_class?.level?.id,
                                          },
                                        });
                                      }}
                                    >
                                      <i className="os-icon os-icon-eye"></i>
                                    </a>
                                    <a
                                      href="#"
                                      title="Edit"
                                      onClick={() => {
                                        SetUMessage(undefined);
                                        SetActiveStudentId(stu.id);
                                        SetEditStudent({
                                          firstname: stu.first_name,
                                          middlename: stu.middle_name,
                                          surname: stu.surname,
                                          regNo: stu.reg_no,
                                          gender: stu.gender,
                                          address: stu.address,
                                          dob: stu.dob,
                                          state: stu.state,
                                          lga: stu.lga,
                                        });
                                        if (editStudent) {
                                          setTimeout(() => {
                                            document
                                              .getElementById("btnModal")
                                              ?.click();
                                          }, 0);
                                        }
                                      }}
                                    >
                                      <i className="os-icon os-icon-edit"></i>
                                    </a>
                                    <a
                                      className="danger"
                                      href="#"
                                      title="Delete"
                                      onClick={async () => {
                                        let del = window.confirm(
                                          `Are you sure you want to delete "${
                                            stu.firstname +
                                            " " +
                                            stu.middlename +
                                            " " +
                                            stu.surname
                                          }"?`
                                        );
                                        if (del) {
                                          await RemoveStudent({
                                            variables: {
                                              id: stu.id,
                                            },
                                          });
                                        }
                                      }}
                                    >
                                      <i className="os-icon os-icon-ui-15"></i>
                                    </a>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Hidden button to lunch edit modal */}
                      <button
                        type="button"
                        id="btnModal"
                        data-target="#editModal"
                        data-toggle="modal"
                        style={{ display: "none" }}
                      ></button>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="col-12 fade-in">
                    <div className="element-box">
                      <Pagination
                        length={data?.SearchStudents?.totalDocs}
                        {...data?.SearchStudents}
                        onPageClicked={(page: number) => {
                          setPage(page);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {data && data?.SearchStudents?.docs.length === 0 && (
                <div className="text-center pt-5 fade-in">
                  <h3 className="text-danger"> No Student record found!</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student profile */}
      {showProfile && activeStudent && (
        <div>
          <div className="content-box">
            <div className="element-wrapper">
              <h5 className="element-header">Student Profile</h5>
              <div className="element-box ">
                <div className="text-left">
                  <NavLink
                    to="#"
                    onClick={() => {
                      SetShowNewGuardian(false);
                      SetShowProfile(false);
                    }}
                  >
                    <i
                      className="icon-lg os-icon os-icon-arrow-left6"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </NavLink>
                </div>
                <div className="text-center mb-5">
                  <img
                    className="avatar mb-3"
                    alt="Passport"
                    src={activeStudent.passport}
                    style={{
                      width: "150px",
                      height: "150px",
                    }}
                  />

                  <h2 className="up-header ">
                    {activeStudent.first_name +
                      " " +
                      activeStudent.middle_name +
                      " " +
                      activeStudent.surname}
                  </h2>
                  <h6 className="up-sub-header text-uppercase">
                    {activeStudent.reg_no}
                  </h6>
                </div>

                <div className="os-tabs-w">
                  <div className="os-tabs-controls">
                    <ul className="nav nav-tabs smaller">
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link active"
                          data-toggle="tab"
                          href="#basic-info"
                        >
                          Basic Info
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#subjects"
                        >
                          Subjects
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#guardians"
                        >
                          Guardians
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#attendance"
                        >
                          Attendance
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content">
                    {/* Basic Information */}
                    <div className="tab-pane active" id="basic-info">
                      <div className="text-center element-box no-bg no-shadow">
                        <ul className="pro-details">
                          <li>
                            <span>Gender</span> | <b>{activeStudent.gender}</b>
                          </li>
                          <li>
                            <span>Date of Birth</span> |{" "}
                            <b>{CLEAN_DATE(activeStudent.dob)}</b>
                            <i> ( 20yrs )</i>
                          </li>
                          <li>
                            <span>Date Created</span> |{" "}
                            <b>{CLEAN_DATE(activeStudent.created_at)}</b>
                          </li>
                          <li>
                            <span>Level</span> |{" "}
                            <b>{activeStudent.current_class?.level?.name}</b>
                          </li>
                          <li>
                            <span>Class</span> |{" "}
                            <b>{activeStudent.current_class?.name}</b>
                          </li>
                          <li>
                            <span>State of Origin</span> |{" "}
                            <b>{activeStudent.state}</b>
                          </li>
                          <li>
                            <span>LGA</span> | <b>{activeStudent.lga}</b>
                          </li>
                          <li>
                            <span>Address</span> |{" "}
                            <b>{activeStudent.address}</b>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Selected Subject */}
                    <div className="tab-pane" id="subjects">
                      <div className="text-center element-box no-bg no-shadow">
                        <div className="text-right">
                          {/* Subjects */}
                          <label
                            className={
                              activeStudent?.selected_subjects.length === 0
                                ? "btn btn-sm btn-secondary"
                                : "badge badge-success-inverted"
                            }
                            style={{ padding: "4px 5px" }}
                          >
                            {activeStudent?.selected_subjects.length === 0
                              ? "General"
                              : "Selected"}
                          </label>
                        </div>
                        <SubjectList
                          subjects={
                            activeStudent?.selected_subjects.length > 0
                              ? activeStudent.selected_subjects
                              : sData?.GetSubjectsForRegistration.docs
                          }
                        />
                        <LoadingState loading={sLoading} />
                        <AlertMessage
                          message={subMessage?.message}
                          failed={subMessage?.failed}
                        />
                      </div>
                    </div>

                    {/* Guardians List*/}
                    <div className="tab-pane" id="guardians">
                      {!showNewGuardian && (
                        <div>
                          <div className="text-center ">
                            <div className="row">
                              <div className="col-12">
                                <button
                                  className="btn btn-primary float-right"
                                  id="btnGuardModal"
                                  data-target="#guardianPhoneModal"
                                  data-toggle="modal"
                                  onClick={() => {
                                    SetNewGuardMsg(undefined);
                                    SetGuardianExists(false);
                                  }}
                                >
                                  <i className="os-icon os-icon-plus-circle mr-2"></i>
                                  New
                                </button>
                              </div>
                              {activeStudent.guardians.length > 0 && (
                                <>
                                  {activeStudent.guardians.map((guard: any) => (
                                    <div className="col-sm-3">
                                      <div className="element-box no-bg">
                                        <img
                                          className="avatar"
                                          src={guard?.image || "/avatar.png"}
                                          alt=""
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                          }}
                                        />
                                        <hr />
                                        <a
                                          href="#"
                                          data-dismiss="modal"
                                          data-target="#imageModal"
                                          data-toggle="modal"
                                        >
                                          {guard?.full_name}
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                              {activeStudent.guardians.length === 0 && (
                                <div className="col-12 mb-5">
                                  <label className="text-danger">
                                    No guardian record found!
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* New Guardian  */}
                      {showNewGuardian && (
                        <div className="content-i">
                          <div className="content-box">
                            <div className="element-wrapper">
                              <h5 className="element-header">New Guardian</h5>

                              <div className="row justify-content-center element-box no-bg no-shadow">
                                <div className="col-lg-10 pt-5">
                                  <h5 className="element-header">
                                    Basic Information
                                  </h5>
                                  <form
                                    onSubmit={async (e) => {
                                      e.preventDefault();
                                      NewGuardian({
                                        variables: {
                                          student: activeStudent.id,
                                          model: {
                                            ...newGuardian,
                                            phone: guardianPhone,
                                          },
                                        },
                                      });
                                    }}
                                  >
                                    <div className="row mb-3">
                                      <div className="col-sm-6">
                                        {/* Title input */}
                                        <label>Title</label>
                                        <Select
                                          options={title.titles}
                                          onChange={(title: any) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              title: title.label,
                                            });
                                          }}
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* Relationship input */}
                                        <label>Relationship</label>
                                        <Select
                                          options={guardType}
                                          onChange={(type: any) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              type: type.value,
                                            });
                                          }}
                                          icon="phone"
                                        />
                                        {showGTRefresh && (
                                          <button
                                            onClick={() => {
                                              SetShowGTRefresh(false);
                                              SetGTMessage(undefined);
                                              GetGuardianTypes();
                                            }}
                                            className="btn btn-primary btn-sm px-2 my-2"
                                            type="button"
                                          >
                                            Reload Relationships
                                          </button>
                                        )}
                                        <AlertMessage
                                          message={gTMessage?.message}
                                          failed={gTMessage?.failed}
                                        />
                                        <LoadingState loading={gTLoading} />
                                      </div>
                                    </div>
                                    {/* Full name input */}
                                    <IconInput
                                      placeholder="Enter full name"
                                      label="Full Name"
                                      icon="os-icon-ui-09"
                                      required={true}
                                      type="text"
                                      onChange={(name: string) => {
                                        SetNewGuardian({
                                          ...newGuardian,
                                          name,
                                        });
                                      }}
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
                                          initVal={guardianPhone}
                                          disabled={true}
                                          onChange={(phone: string) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              phone,
                                            });
                                          }}
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
                                          onChange={(email: string) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              email,
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <div className="col-sm-6">
                                        {/* Gender input */}
                                        <label>Gender</label>
                                        <Select
                                          options={gender.gender}
                                          onChange={(gender: any) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              gender: gender.label,
                                            });
                                          }}
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* State of Origin input */}
                                        <label>State of Origin</label>
                                        <Select
                                          options={state.map(
                                            (item: any, index: number) => ({
                                              label: item.state.name,
                                              value: index + "",
                                            })
                                          )}
                                          onChange={(item: any) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              state: item.label,
                                            });
                                            SetLocals(
                                              state[
                                                item.value
                                              ].state.locals.map(
                                                (item: any) => ({
                                                  value: item.name,
                                                  label: item.name,
                                                })
                                              )
                                            );
                                          }}
                                          icon="phone"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* LGA */}
                                        <label>LGA</label>
                                        <Select
                                          options={locals}
                                          onChange={(item: any) =>
                                            SetNewGuardian({
                                              ...newGuardian,
                                              lga: item.value,
                                            })
                                          }
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
                                          onChange={(hometown: string) => {
                                            SetNewGuardian({
                                              ...newGuardian,
                                              hometown,
                                            });
                                          }}
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
                                      onChange={(address: string) => {
                                        SetNewGuardian({
                                          ...newGuardian,
                                          address,
                                        });
                                      }}
                                    />
                                    <label>Passport</label>
                                    <ImageUpload
                                      title="Browse passport..."
                                      onData={(image: string) => {
                                        SetNewGuardian({
                                          ...newGuardian,
                                          image,
                                        });
                                      }}
                                    />
                                    <LoadingState loading={nGLoading} />
                                    <AlertMessage
                                      message={nGMessage?.message}
                                      failed={nGMessage?.failed}
                                    />
                                    <div className="buttons-w mt-3 mb-5">
                                      <button
                                        onClick={() => {
                                          SetShowNewGuardian(false);
                                        }}
                                        className="btn btn-secondary px-5 mt-3"
                                        type="submit"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="btn btn-primary px-5 mt-3"
                                        type="submit"
                                      >
                                        Save Guardian
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Student attendance */}
                    <div className="tab-pane" id="attendance">
                      <div className="os-tabs-w">
                        <div className="os-tabs-controls">
                          {/* Tab header */}
                          <ul className="nav nav-tabs ">
                            <li className="nav-item">
                              <a
                                className="nav-link active"
                                data-toggle="tab"
                                href="#schoolAtt"
                              >
                                School Att.
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                data-toggle="tab"
                                href="#classAtt"
                              >
                                Class Att.
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                data-toggle="tab"
                                href="#subjectAtt"
                              >
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
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>29st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-danger-inverted">
                                          Absent
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>6th Feb. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Class Attendance */}
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
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>29st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-danger-inverted">
                                          Absent
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>6th Feb. 2020</td>
                                      <td>
                                        <label className="badge badge-warning-inverted">
                                          Exempted
                                        </label>
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
                            <h5 className="element-header">Monday</h5>
                            <AttAccordion />

                            <h5 className="element-header">Tuesday</h5>
                            <AttAccordion />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Image */}
      <ImageModal image={activeImg?.image} name={activeImg?.name} />

      {/* Edit Student Modal */}
      {editStudent.dob && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="editModal"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Student's Info <hr />
                </h5>
                <button className="close" data-dismiss="modal" type="button">
                  <span aria-hidden="true"> &times;</span>
                </button>
              </div>
              <div className="modal-body element-box pb-2">
                <LoadingState loading={uLoading} />
                <AlertMessage
                  message={uMessage?.message}
                  failed={uMessage?.failed}
                />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Scroll to top of page
                    scrollTop();
                    UpdateStudent({
                      variables: {
                        id: activeStudentId,
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
                              state[item.value].state.locals.map(
                                (item: any) => ({
                                  value: item.name,
                                  label: item.name,
                                })
                              )
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
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
                      Update Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guardian Phone Modal */}
      {showProfile && activeStudent && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="guardianPhoneModal"
          role="dialog"
        >
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Student's Guardian <hr />
                </h5>
                <button className="close" data-dismiss="modal" type="button">
                  <span aria-hidden="true"> &times;</span>
                </button>
              </div>
              <div className="modal-body pb-2">
                {!guardianExists && (
                  <div className="element-box no-shadow">
                    <div className="row pb-4">
                      <div className="col-12 text-center">
                        <img
                          src={activeStudent.passport || "/avatar.png"}
                          alt=""
                          className="mb-2"
                          style={{
                            borderRadius: "50%",
                            width: "150px",
                            height: "150px",
                          }}
                        />
                        <h5>{activeStudent.full_name}</h5>
                        <label>{activeStudent.reg_no}</label>
                        <hr />
                      </div>
                    </div>
                    <LoadingState loading={gLoading} />
                    <AlertMessage
                      message={guardByPhoneMsg?.message}
                      failed={guardByPhoneMsg?.failed}
                    />
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
                          <button
                            className="btn btn-primary px-5"
                            type="submit"
                          >
                            Continue
                          </button>
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
                        <AlertMessage
                          message={newGuardMsg?.message}
                          failed={newGuardMsg?.failed}
                        />
                        <LoadingState loading={aGLoading} />
                        <b>
                          Guardian with entered phone number already exists.
                        </b>
                        <label htmlFor="">
                          Do you want to use this Guardian?
                        </label>

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
                              // console.log(
                              //   `Active Student: ${JSON.stringify(
                              //     activeStudent
                              //   )}\n Guardian: ${JSON.stringify(returnedGuard)}`
                              // );
                              AddNewGuardian({
                                variables: {
                                  id: activeStudent.id,
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

export default StudentList;
