import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import {
  GetAppName,
  ToggleExpansion,
  CleanMessage,
} from "../../../../context/App";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_STUDENT } from "../../../../queries/Student.query";
import { toast } from "react-toastify";
import { IProps } from "../../../../models/IProps";
import Subjects from "./Subjects";
import { GET_SUB_BY_LEVEL } from "../../../../queries/Subject.query";
import LoadingState from "../../../partials/loading";
import BasicInfo from "./BasicInfo";
import Guardian from "./Guardian";
import SubjectAttendance from "./Attendance/SubjectAttendance";

const StudentProfile: FC<IProps> = ({ match }) => {
  const [activeStudent, SetActiveStudent] = useState<any>();

  //   Student Id from location object passed
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
  const [GetSubByLevel, { loading: sLoading, data: sData }] = useLazyQuery(
    GET_SUB_BY_LEVEL,
    {
      onError: (err) => toast.error(CleanMessage(err.message)),
    }
  );

  return (
    <>
      <Helmet>
        <title> Student Profile {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div>
              <h5 className="element-header tracking-in-contract">
                Student Profile
              </h5>
              <LoadingState loading={loading} />
              {activeStudent && (
                <div className="element-box ">
                  <div>
                    <a
                      href="javascript:void(0)"
                      title="Expand / Collapse"
                      className="icon-lg m-3 float-right"
                      onClick={() => {
                        ToggleExpansion();
                      }}
                    >
                      <i className="os-icon os-icon-maximize"></i>
                    </a>
                    <a
                      href="javascript:void(0)"
                      title="Back"
                      className="icon-lg m-3 float-left"
                      onClick={() => {}}
                    >
                      <i className="os-icon os-icon-arrow-left6"></i>
                    </a>
                  </div>
                  <div className="text-center mb-5 mt-3">
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
                        <BasicInfo student={activeStudent} />
                      </div>

                      {/* Selected Subject */}
                      <div className="tab-pane" id="subjects">
                        <Subjects
                          subjects={
                            activeStudent.selected_subjects.length > 0
                              ? activeStudent.selected_subjects
                              : sData?.GetSubjectsForRegistration.docs
                          }
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
                                  Roll Call Att.
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
                              <SubjectAttendance
                                studentId={activeStudent?.id}
                              />
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
    </>
  );
};

export default StudentProfile;
