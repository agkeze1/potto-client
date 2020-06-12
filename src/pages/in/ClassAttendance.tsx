import React, { FC, useState, useEffect } from "react";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { GetAppName } from "../../context/App";
import Helmet from "react-helmet";
import Select from "react-select";
import { Doughnut } from "react-chartjs-2";
import SwitchInput from "../partials/SwitchInput";
import LevelClass from "./partials/LevelClass";
import FromToDate from "./partials/FromToDate";

const ClassAttendance: FC<IProps> = ({ history }) => {
  const [showAttendance, SetShowAttendance] = useState<boolean>();
  const [showDateRange, SetShowDateRange] = useState<boolean>(true);
  const [showAttendanceResult, SetShowAttendanceResult] = useState<boolean>();
  const [showSummary, SetShowSummary] = useState<boolean>(true);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [attendanceInput, SetAttendanceInput] = useState<any>();
  const [activeAttSort, SetActiveAttSort] = useState<number>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }
  // Get  School of logged in user
  const { school } = authService.GetUser();

  // Toggle Attendance Expansion
  const ExpandAttendanced = () => {
    const sideNav = document.getElementById("sideNav");
    const header = document.getElementById("header");

    //Toggle sideNav visibility
    if (sideNav) {
      if (sideNav.style.display === "none") {
        sideNav.style.display = "block";
      } else {
        sideNav.style.display = "none";
      }
    }

    // Toggle header visibility
    if (header) {
      if (header.style.display === "none") {
        header.style.display = "block";
      } else {
        header.style.display = "none";
      }
    }
  };

  // Attendance Sort criteria
  const attSort = [
    {
      label: "All",
      value: 1,
    },
    {
      label: "Present",
      value: 2,
    },
    {
      label: "Absent",
      value: 3,
    },
  ];

  const data = {
    datasets: [
      {
        data: [800, 345],
        backgroundColor: ["darkseagreen", "#FF6384"],
        hoverBackgroundColor: ["#16a820", "#3e4b5b"],
      },
    ],
    labels: ["Present", "Absent"],
  };

  return (
    <>
      <Helmet>
        <title>Roll Call | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            {showAttendance && (
              <div className="element-actions" style={{ marginTop: "-20px" }}>
                {/* New Class and Level Filter switch */}
                <SwitchInput
                  isOn={showDateRange}
                  handleToggle={() => {
                    SetShowDateRange(!showDateRange);
                  }}
                  label="Date Filter"
                />
              </div>
            )}
            <h5 className="element-header">Roll Call Report</h5>
            {/* Filter */}
            {!showAttendance && (
              <div className="element-box">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <LevelClass
                      schoolId={school.id}
                      onLevelChange={(level: any) => {
                        SetActiveLevel({
                          name: level?.label,
                          id: level?.value,
                        });
                        SetAttendanceInput({
                          ...attendanceInput,
                          current_class: undefined,
                        });
                      }}
                      onClassChange={(_class: any) => {
                        SetAttendanceInput({
                          ...attendanceInput,
                          current_class: {
                            name: _class.label,
                            id: _class.value,
                          },
                        });
                      }}
                      onSubmit={() => {
                        if (attendanceInput?.current_class)
                          SetShowAttendance(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Result */}
            {showAttendance &&
              attendanceInput?.current_class(
                <div className="row">
                  {/* Date Range selection */}
                  {showDateRange && (
                    <div className="col-lg-12">
                      <FromToDate
                        onFromChange={(date: any) => {
                          SetAttendanceInput({
                            ...attendanceInput,
                            fromDate: date,
                          });
                        }}
                        onToChange={(date: any) => {
                          SetAttendanceInput({
                            ...attendanceInput,
                            toDate: date,
                          });
                        }}
                        onSubmit={() => {
                          if (
                            attendanceInput.fromDate &&
                            attendanceInput.toDate
                          )
                            SetShowAttendanceResult(true);
                        }}
                      />
                    </div>
                  )}
                  {showAttendanceResult && (
                    <>
                      {/* Class info */}
                      <div className="col-12">
                        <div className="element-box bg-azure p-0 pl-3">
                          <div className="row">
                            <div className="col-sm-4">
                              <div className="users-list-w bdr-r">
                                <div className="user-w">
                                  <div className="user-avatar-w">
                                    <div className="user-avatar">
                                      <img alt="" src="/avatar.png" />
                                    </div>
                                  </div>
                                  <div className="user-name">
                                    <h6 className="user-title">
                                      John Kelvin Mayers
                                    </h6>
                                    <div className="user-role text-primary">
                                      Form Teacher
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-7 mt-3">
                              <label htmlFor="">
                                Level | <b>JSS1</b>
                              </label>
                              <br />
                              <label htmlFor="">
                                Class | <b>Gold</b>
                              </label>
                            </div>
                            <div className="col-sm-1 mt-3">
                              <a
                                href="javascript:void(0)"
                                title="Change Class"
                                className="m-3"
                                onClick={() => {
                                  SetShowAttendance(false);
                                  SetShowAttendanceResult(false);
                                }}
                              >
                                <i className="os-icon os-icon-edit"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date Section */}
                      <div className="col-md-4">
                        <div className="element-box bg-white mt-0">
                          <h6 className="element-header">Date</h6>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">42</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">38</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">40</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">42</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">42</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">42</b>
                              </div>
                            </div>
                          </a>
                          <a className="el-tablo att-time-crd" href="#">
                            <div className="row">
                              <div className="col-10">
                                <div className="">Tue, 27th May</div>
                              </div>
                              <div className="col-2 text-center att-stu">
                                <b className="text-primary">42</b>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>

                      <div className="col-md-8">
                        {/* Summary Section */}
                        <div className="element-box bg-white">
                          <span className="element-actions">
                            <a
                              href="javascript:void(0)"
                              title="toggle collapse"
                              onClick={() => {
                                SetShowSummary(!showSummary);
                              }}
                            >
                              <i
                                className={`os-icon os-icon-chevron-${
                                  showSummary ? "down" : "up"
                                } icon-lg`}
                              ></i>
                            </a>
                            <a
                              href="javascript:void(0)"
                              title="Expand / Collapse"
                              className="m-3"
                              onClick={() => {
                                ExpandAttendanced();
                              }}
                            >
                              <i className="os-icon os-icon-maximize"></i>
                            </a>
                          </span>
                          <h6
                            className="element-header"
                            style={{ marginBottom: showSummary ? "30px" : "0" }}
                          >
                            Summary
                          </h6>
                          {showSummary && (
                            <div className="row">
                              {/* Counts */}
                              <div className="col-6">
                                <a
                                  className="element-box el-tablo bg-darkseagreen no-bg bdr"
                                  href="#"
                                >
                                  <div className="label">Total Students</div>
                                  <div className="value">43</div>
                                </a>
                              </div>
                              <div className="col-6">
                                <a
                                  className="element-box el-tablo no-bg bg-azure bdr"
                                  href="#"
                                >
                                  <div className="label">Total present</div>
                                  <div className="value text-primary">34</div>
                                  <div className="trending">
                                    <span>( 92% )</span>
                                  </div>
                                </a>
                              </div>
                              <div className="col-6">
                                <a
                                  className="element-box el-tablo no-bg bg-bisque bdr mb-0"
                                  href="#"
                                >
                                  <div className="label">Total absent</div>
                                  <div className="value text-danger">9</div>
                                  <div className="trending">
                                    <span>( 8% )</span>
                                  </div>
                                </a>
                              </div>
                              <div className="col-6">
                                <a
                                  className="element-box el-tablo no-bg bg-lightcoral bdr mb-0"
                                  href="#"
                                >
                                  <div className="label">Device Used</div>
                                  <div className="value">Device-006</div>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Student attendance list Section */}
                        <div className="element-box mt-0">
                          <h6 className="element-header">Students</h6>
                          <div className="text-center element-box no-bg no-shadow no-padding">
                            <div className="col-md-4 float-right">
                              {/* Sort by Present/Absent input */}
                              <Select
                                options={attSort}
                                onChange={(item: any) => {
                                  SetActiveAttSort(item?.value || 1);
                                }}
                              />
                            </div>

                            <div className="table-responsive">
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th className="text-left">Student</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td className="text-left">
                                      Janeth C. Ogbodo
                                    </td>
                                    <td>
                                      <label className="badge badge-success-inverted">
                                        Present
                                      </label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>2</td>
                                    <td className="text-left">
                                      James Ikechukwu Agbo
                                    </td>
                                    <td>
                                      <label className="badge badge-danger-inverted">
                                        Absent
                                      </label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>3</td>
                                    <td className="text-left">
                                      Loveth Nkem Grace
                                    </td>
                                    <td>
                                      <label className="badge badge-success-inverted">
                                        Present
                                      </label>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassAttendance;
