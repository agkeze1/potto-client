import React, { FC, useState, useEffect } from "react";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { GetAppName } from "../../context/App";
import Helmet from "react-helmet";
import Select from "react-select";
import { IMessage } from "../../models/IMessage";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import DatePicker from "react-datepicker";
import { PieChart } from "react-minimal-pie-chart";
import { Doughnut } from "react-chartjs-2";

const ClassAttendance: FC<IProps> = ({ history }) => {
  const [showAttendance, SetShowAttendance] = useState<boolean>(false);
  const [showClassInfo, SetShowClassInfo] = useState<boolean>(true);
  const [showSummary, SetShowSummary] = useState<boolean>(true);
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [attendanceInput, SetAttendanceInput] = useState<any>();
  const [activeDate, SetActiveDate] = useState<any>();
  const [activeAttSort, SetActiveAttSort] = useState<number>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }
  // Get  School of logged in user
  const { school } = authService.GetUser();

  // Get Levels for level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
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
  });

  // Get Levels on Reload level button click
  const [GetLevels, { loading: llLoading }] = useLazyQuery(GET_LEVELS, {
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

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (activeLevel?.id) {
      SetClasses(undefined);
      GetClasses({ variables: { level: activeLevel?.id } });
    }
  }, [activeLevel?.id]);

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
        <title>Class Attendance | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">Class Attendance Report</h5>
            {/* Filter */}
            {!showAttendance && (
              <div className="element-box">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        SetShowAttendance(true);
                      }}
                    >
                      <div className="row">
                        <div className="col-md-6">
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
                              SetAttendanceInput({
                                ...attendanceInput,
                                current_class: undefined,
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
                        <div className="col-md-6">
                          {/* Class Input */}
                          <label>
                            Class <br />
                          </label>
                          <Select
                            options={classes}
                            value={{
                              label: attendanceInput?.current_class?.name || (
                                <span className="text-gray">Select...</span>
                              ),
                              value: attendanceInput?.current_class?.id,
                            }}
                            onChange={(item: any) => {
                              SetAttendanceInput({
                                ...attendanceInput,
                                current_class: {
                                  name: item.label,
                                  id: item.value,
                                },
                              });
                            }}
                          />
                          <LoadingState loading={cLoading} />
                          <AlertMessage
                            message={cMessage?.message}
                            failed={cMessage?.failed}
                          />
                        </div>
                        <div className="col-12 mt-3">
                          <div className="buttons-w">
                            <button
                              className="btn btn-primary px-3"
                              type="submit"
                            >
                              View Attendance
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            {/* Attendance Result */}
            {showAttendance && (
              <div className="row">
                {/* Class Info and Date Section */}
                <div className="col-md-4">
                  {/* Class Info */}
                  <div className="element-box bg-azure">
                    <span className="element-actions">
                      <a
                        href="#"
                        title="Change Class"
                        className="m-3"
                        onClick={() => SetShowAttendance(false)}
                      >
                        <i className="os-icon os-icon-edit"></i>
                      </a>
                      <a
                        href="#"
                        title="toggle collapse"
                        onClick={() => {
                          SetShowClassInfo(!showClassInfo);
                        }}
                      >
                        <i
                          className={`os-icon os-icon-chevron-${
                            showClassInfo ? "down" : "up"
                          } icon-lg`}
                        ></i>
                      </a>
                    </span>
                    <h6
                      className="element-header"
                      style={{ marginBottom: showClassInfo ? "30px" : "0" }}
                    >
                      Class Info
                    </h6>

                    {showClassInfo && (
                      <div className="text-center" title="Form teacher">
                        <img
                          src="/avatar.png"
                          alt=""
                          className="mb-2"
                          style={{
                            borderRadius: "50%",
                            width: "100px",
                            height: "100px",
                          }}
                        />
                        <h5>John Mayers</h5>
                        <label
                          style={{
                            display: "block",
                            marginTop: "-5px",
                            color: "#16a820",
                            fontSize: "12px",
                          }}
                        >
                          Form teacher
                        </label>
                        <hr />
                        <label htmlFor="">
                          Level | <b>JSS1</b>
                        </label>
                        <br />
                        <label htmlFor="">
                          Class | <b>Gold</b>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Date Section */}
                  <div className="element-box bg-white mt-0">
                    <h6 className="element-header">Date</h6>
                    {/* Date input for filter */}
                    <label>Filter Date</label>
                    <br />
                    <DatePicker
                      placeholderText="day, month year"
                      selected={activeDate}
                      onChange={(date) => SetActiveDate(date)}
                      className="form-control"
                      dateFormat="d, MMMM yyyy"
                    />
                    <hr />

                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">42</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">38</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">40</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">40</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">40</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">40</span>
                        </div>
                      </div>
                    </a>
                    <a className="el-tablo att-time-crd" href="#">
                      <div className="row">
                        <div className="col-10">
                          <div className="">Tue, 27th May</div>
                          <div className="label">
                            <b>Device - </b> Products Sold
                          </div>
                        </div>
                        <div className="col-2 att-stu">
                          <span className="text-center">40</span>
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
                        href="#"
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
                        href="#"
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
                        {/* Pie Chart */}
                        <div className="col-4 element-box bg-white bdr mb-0 p-2">
                          <div>
                            <Doughnut
                              data={data}
                              height={100}
                              width={100}
                              options={{
                                cutoutPercentage: 10,
                              }}
                            />
                          </div>
                        </div>

                        {/* Counts */}
                        <div className="col-8">
                          <div className="row">
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
                          </div>
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
                              <td className="text-left">Janeth C. Ogbodo</td>
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
                              <td className="text-left">Loveth Nkem Grace</td>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassAttendance;
