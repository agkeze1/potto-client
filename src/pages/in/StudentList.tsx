import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";
import Dropdown from "../partials/Dropdown";
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
import Select from "react-select";
import Pagination from "../partials/Pagination";
import DatePicker from "react-datepicker";
import {
  GET_STUDENTS_BY_LEVEL,
  GET_STUDENTS_BY_CLASS,
  GET_STUDENT_BY_REG_NO,
  REMOVE_STUDENT,
  UPDATE_STUDENT,
} from "../../queries/Student.query";

const StudentList: FC<IProps> = ({ history }) => {
  const [active, SetActive] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });

  const [showFilter, SetShowFilter] = useState<boolean>(true);
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [showNewGuardian, SetNewGuardian] = useState<boolean>(false);
  const [locals, SetLocals] = useState<any>([]);

  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  const [activeStudentId, SetActiveStudentId] = useState<string>();
  const [editStudent, SetEditStudent] = useState<any>({});

  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showClassesRefresh, SetShowClassesRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);

  //Fileters
  const [searchByRegNo, SetSearchByRegNo] = useState<string>();
  const [searchByLevel, SetSearchByLevel] = useState<any>();
  const [searchByClass, SetSearchByClass] = useState<any>();
  const [searchMsg, SetSearchMsg] = useState<IMessage>();

  // Pagination
  const [pageResult, SetPageResult] = useState<any>({
    docs: [],
    totalDocs: 0,
    totalPages: 0,
    limit: 25,
    page: 1,
    nextPage: null,
    prevPage: null,
  });
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

  // Get a single Students By Reg. number
  const [GetStuByRegNo, { loading: regNoLoading }] = useLazyQuery(
    GET_STUDENT_BY_REG_NO,
    {
      onError: (err) =>
        SetMessage({
          message: err.message,
          failed: true,
        }),
      onCompleted: (regNoData: any) => {
        if (regNoData.GetStudentByRegNo) {
          let docs = [];
          docs.push(regNoData.GetStudentByRegNo.doc);
          let newStu = {
            ...pageResult,
            docs,
            page: 1,
            limit,
            nextPage: null,
            prevPage: null,
            totalPages: 1,
            totalDocs: 1,
          };
          SetPageResult(newStu);
        }
      },
    }
  );

  // Get List of Students By Level
  const [
    GetStuByLevel,
    { loading: levelLoading, fetchMore: levelFetchMore },
  ] = useLazyQuery(GET_STUDENTS_BY_LEVEL, {
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (levelData) => {
      if (levelData.GetStudentsOfSameLevel) {
        SetPageResult({
          ...levelData.GetStudentsOfSameLevel,
        });
      }
    },
  });

  // Get List of Students By Class
  const [GetStuByClass, { loading: classLoading }] = useLazyQuery(
    GET_STUDENTS_BY_CLASS,
    {
      onError: (err) =>
        SetMessage({
          message: err.message,
          failed: true,
        }),
      onCompleted: (classData) => {
        if (classData.GetStudentOfSameClass) {
          SetPageResult({
            ...classData.GetStudentOfSameClass,
          });
        }
      },
    }
  );

  // Fetch More students of same Level on Page change
  useEffect(() => {
    if (levelFetchMore)
      levelFetchMore({
        variables: { page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            GetStudentsOfSameLevel: fetchMoreResult.GetStudentsOfSameLevel,
          };
        },
      });
  }, [page]);

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (searchByLevel) {
      SetClasses(undefined);
      GetClasses({ variables: { level: searchByLevel.id } });
    }
  }, [searchByLevel]);

  // Makes API call for records
  const SerchRecord = () => {
    SetMessage(undefined);
    SetSearchMsg(undefined);
    if (searchByRegNo) {
      GetStuByRegNo({ variables: { id: searchByRegNo } });
    } else if (searchByClass) {
      GetStuByClass({ variables: { classId: searchByClass?.id, page, limit } });
    } else if (searchByLevel) {
      GetStuByLevel({ variables: { level: searchByLevel?.id, page, limit } });
    } else {
      SetSearchMsg({
        message: "No Search field selected!",
        failed: true,
      });
    }
  };

  // Remove Student
  const [RemoveStudent, { loading: rLoading }] = useMutation(REMOVE_STUDENT, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      if (data) {
        const result = { ...pageResult };
        if (result?.docs) {
          const index = result.docs.findIndex(
            (i: any) => i.id === data.RemoveStudent.doc.id
          );
          result.docs.splice(index, 1);
          SetPageResult(result);
        }
      }
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
      if (data) {
        const result = { ...pageResult };
        if (result?.docs) {
          const index = result.docs.findIndex(
            (i: any) => i.id === data.UpdateStudent.doc.id
          );
          result.docs.splice(index, 1);
          result.docs.unshift(data.UpdateStudent.doc);
          SetPageResult(result);
        }
        SetUMessage({
          message: data.UpdateStudent.message,
          failed: false,
        });
      }
    },
  });

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
            {showFilter && (
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
                          SetShowFilter(false);
                        }}
                        label="Show Filter"
                      />
                    </span>
                    <h5 className="element-header">Filter Student</h5>
                  </div>
                  <div className="col-lg-4">
                    {/* Reg No input */}
                    <IconInput
                      placeholder="Enter student reg.no"
                      label="Search by Reg. no"
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      onChange={(reg_no: string) => {
                        SetSearchByRegNo(reg_no);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    {/* Level input */}
                    <Dropdown
                      items={levels}
                      onSelect={(item: any) => {
                        SetCMessage(undefined);
                        SetSearchByLevel({ name: item.label, id: item.value });
                      }}
                      disabled={searchByRegNo ? true : false}
                      label="Level"
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
                  <div className="col-lg-4">
                    {/* Current Class input */}
                    <Dropdown
                      items={classes}
                      onSelect={(item: any) => {
                        SetSearchByClass({ name: item.label, id: item.value });
                      }}
                      disabled={searchByRegNo ? true : false}
                      label="Class"
                    />
                    {showClassesRefresh && (
                      <button
                        onClick={() => {
                          SetShowClassesRefresh(false);
                          SetCMessage(undefined);
                          SetMessage(undefined);
                          GetClasses({
                            variables: { level: searchByLevel.id },
                          });
                        }}
                        className="btn btn-primary btn-sm px-1 mb-2"
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
                        SerchRecord();
                      }}
                    >
                      Search record
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="row justify-content-center ">
              <div className="col-lg-12 pt-5">
                {!showFilter && (
                  <span
                    className="element-actions mb-5"
                    style={{ marginTop: "-3rem" }}
                  >
                    <SwitchInput
                      isOn={showFilter}
                      handleToggle={() => {
                        SetShowFilter(true);
                      }}
                      label="Show Filter"
                    />
                  </span>
                )}
                <LoadingState
                  loading={
                    levelLoading || classLoading || regNoLoading || rLoading
                  }
                />
                <AlertMessage
                  message={message?.message}
                  failed={message?.failed}
                />
                <AlertMessage
                  message={rMessage?.message}
                  failed={rMessage?.failed}
                />
                {pageResult.docs.length > 0 && (
                  <div className="element-box-tp">
                    <div className="table-responsive">
                      <h6 className="element-header">Student List</h6>
                      <table className="table table-padded">
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
                          {pageResult.docs.map((stu: any, index: number) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div
                                  className="user-with-avatar clickable"
                                  data-target="#imageModal"
                                  data-toggle="modal"
                                >
                                  <img src={stu.passport} alt="" />
                                </div>
                              </td>
                              <td>
                                {stu.first_name +
                                  " " +
                                  stu.middle_name +
                                  " " +
                                  stu.surname}
                              </td>
                              <td>{stu.reg_no}</td>
                              <td>{stu.current_class?.name}</td>
                              <td>{stu.gender}</td>
                              <td className="row-actions text-center">
                                <a
                                  href="#"
                                  title="View more"
                                  onClick={() => {
                                    SetShowProfile(true);
                                  }}
                                >
                                  <i className="os-icon os-icon-eye"></i>
                                </a>
                                <a
                                  href="#"
                                  title="Edit"
                                  onClick={() => {
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
                          ))}
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
                    {/* <div className="text-center pt-5 fade-in">
                    <h2 className="text-danger">No Student found!</h2>
                  </div> */}
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="col-lg fade-in">
                <div className="element-box">
                  <Pagination
                    length={pageResult.totalDocs}
                    {...pageResult}
                    onPageClicked={(page: number) => {
                      setPage(page);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        // profile
        <div>
          <div className="content-box">
            <div className="element-wrapper">
              <h5 className="element-header">Student Profile</h5>
              <div className="element-box ">
                <div className="text-left">
                  <NavLink
                    to="#"
                    onClick={() => {
                      SetShowProfile(false);
                    }}
                  >
                    <i
                      className="icon-lg os-icon os-icon-arrow-left6"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </NavLink>
                </div>
                <div className="text-right">
                  <NavLink to="#">
                    <i className="icon-lg os-icon os-icon-edit"></i>
                  </NavLink>
                </div>
                <div className="text-center">
                  <img
                    className="avatar mb-3"
                    alt="Passport"
                    src="/3.jpeg"
                    style={{
                      width: "150px",
                      height: "150px",
                    }}
                  />

                  <h2 className="up-header ">Douglas Elenu</h2>
                  <h6 className="up-sub-header text-uppercase">CIC20/1244</h6>
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
                            <span>Gender</span> | <b>Male</b>
                          </li>
                          <li>
                            <span>Date of Birth</span> | <b>8th May 2001 </b>
                            <i>(20yrs)</i>
                          </li>
                          <li>
                            <span>Date of Admission</span> |{" "}
                            <b>12th April 2017</b>
                          </li>
                          <li>
                            <span>Level</span> | <b>SS1</b>
                          </li>
                          <li>
                            <span>Class</span> | <b>A</b>
                          </li>
                          <li>
                            <span>State of Origin</span> | <b>Abia</b>
                          </li>
                          <li>
                            <span>LGA</span> | <b>Isikwu-ato</b>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Selected Subject */}
                    <div className="tab-pane" id="subjects">
                      <div className="text-center element-box no-bg no-shadow">
                        <div className="text-right">
                          {/* General subjects */}
                          {/* <label
                              className="btn btn-sm btn-secondary"
                              style={{ padding: "4px 5px" }}
                            >
                              General
                            </label> */}
                          {/* Selected subjects */}
                          <label className="badge badge-success-inverted">
                            Selected
                          </label>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Title</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>INT</td>
                                <td>Intro tech</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>ENG</td>
                                <td>English language</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>MTH</td>
                                <td>Mathematics</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Guardians List*/}
                    <div className="tab-pane" id="guardians">
                      {!showNewGuardian && (
                        <div>
                          <div className="element-actions">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SetNewGuardian(true);
                              }}
                            >
                              <i className="os-icon os-icon-plus-circle mr-2"></i>
                              New
                            </button>
                          </div>
                          <div className="text-center ">
                            <div className="row">
                              <div className="col-sm-3">
                                <div className="element-box no-bg">
                                  <img
                                    className="avatar"
                                    src="/3.jpeg"
                                    alt=""
                                    style={{ width: "80%" }}
                                  />
                                  <hr />
                                  <a
                                    href="#"
                                    data-dismiss="modal"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    Douglas King
                                  </a>
                                </div>
                              </div>
                              <div className="col-sm-3">
                                <div className="element-box no-bg">
                                  <img
                                    className="avatar"
                                    src="/avatar.png"
                                    alt=""
                                    style={{ width: "80%" }}
                                  />
                                  <hr />
                                  <a
                                    href="#"
                                    data-dismiss="modal"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    Mrs Anita Loveth
                                  </a>
                                </div>
                              </div>
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
                                  <form onSubmit={(e) => {}}>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* Title input */}
                                        <Dropdown
                                          items={[
                                            { label: "Mr", value: "1" },
                                            { label: "Mrs", value: "2" },
                                            { label: "Sergeant", value: "2" },
                                          ]}
                                          onSelect={() => {}}
                                          label="Title"
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* Relationship input */}
                                        <Dropdown
                                          items={[
                                            { label: "Father", value: "1" },
                                            { label: "Mother", value: "2" },
                                          ]}
                                          onSelect={() => {}}
                                          label="Relationship"
                                          icon="phone"
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
                                      onChange={(fullname: string) => {}}
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
                                          onChange={(phone: string) => {}}
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
                                          onChange={(email: string) => {}}
                                        />
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* Gender input */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1",
                                            },
                                            { label: "Oga", value: "2" },
                                          ]}
                                          onSelect={() => {}}
                                          label="Gender"
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* State of Origin input */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1",
                                            },
                                            { label: "Oga", value: "2" },
                                          ]}
                                          onSelect={() => {}}
                                          label="State of Origin"
                                          icon="phone"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* LGA */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1",
                                            },
                                            { label: "Oga", value: "2" },
                                          ]}
                                          onSelect={() => {}}
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
                                          onChange={(hometown: string) => {}}
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
                                      onChange={(address: string) => {}}
                                    />
                                    <label>Passport</label>
                                    <ImageUpload
                                      title="Browse passport..."
                                      onData={(path: string) => {
                                        // SetImageRecord({
                                        //   ...imageRecord,
                                        //   image: path
                                        // })
                                      }}
                                    />
                                    <div className="buttons-w mt-3 mb-5">
                                      <button
                                        onClick={() => {
                                          SetNewGuardian(false);
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

                    {/* Accordion for student attendance */}
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
      <ImageModal image={active?.image} name={active?.name} />

      {/* Edit Teacher Modal */}
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
              <div className="modal-body pb-2">
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
                        dateFormat="MMMM d, yyyy"
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
    </>
  );
};

export default StudentList;
