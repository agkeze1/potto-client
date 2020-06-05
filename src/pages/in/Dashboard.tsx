import React, { FC } from "react";
import { IProps } from "../../models/IProps";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { PieChart } from "react-minimal-pie-chart";
import { Doughnut, Polar, Bar } from "react-chartjs-2";

const Dashboard: FC<IProps> = ({ history }) => {
  const stuGenderRatio = {
    datasets: [
      {
        data: [800, 345],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#3e4b5b", "#36A2EB"],
      },
    ],
    labels: ["Male", "Female"],
  };

  const data = {
    labels: ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"],
    datasets: [
      {
        label: "Number of Students",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55],
      },
    ],
  };

  const stuStateRatio = {
    labels: [
      "ABIA",
      "UMUAHIA",
      "ADAMAWA",
      "YOLA",
      "AKWA IBOM",
      "UYO",
      "ANAMBRA",
      "AWKA",
      "BAUCHI",
      "BENUE",
      "TARABA",
      "LAGOS",
      "ENUG",
      "ABIA",
      "UMUAHIA",
      "ADAMAWA",
      "YOLA",
      "AKWA IBOM",
      "UYO",
      "ANAMBRA",
      "AWKA",
      "BAUCHI",
      "BENUE",
      "TARABA",
      "LAGOS",
      "ENUG",
      "YOLA",
      "AKWA IBOM",
      "UYO",
      "ANAMBRA",
      "AWKA",
      "BAUCHI",
      "BENUE",
      "TARABA",
      "LAGOS",
      "ENUG",
    ],
    datasets: [
      {
        label: "Number of Students",
        backgroundColor: "rgba(0,99,132,0.2)",
        borderColor: "rgba(0,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0,99,132,0.4)",
        hoverBorderColor: "rgba(0,99,132,1)",
        data: [
          65,
          59,
          80,
          81,
          56,
          55,
          85,
          25,
          50,
          66,
          95,
          33,
          48,
          65,
          59,
          80,
          81,
          56,
          55,
          85,
          25,
          50,
          66,
          95,
          33,
          48,
          81,
          56,
          55,
          85,
          25,
          50,
          66,
          95,
          33,
          48,
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Class Attendance | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">Dashboard</h5>

            {/* Counts Section */}
            <div className="row">
              {/* Students */}
              <div className="col-md-3">
                <a
                  className="element-box el-tablo no-bg bg-darkseagreen total_std mt-0"
                  href="#"
                >
                  <div className="label">Total Students</div>
                  <div className="value">1,043</div>
                </a>
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header">STUDENTS GENDER RATIO</h6>
                  <Doughnut
                    data={stuGenderRatio}
                    height={100}
                    width={100}
                    options={{
                      cutoutPercentage: 80,
                    }}
                  />
                </div>
              </div>
              {/* Teachers */}
              <div className="col-md-3">
                <a
                  className="element-box el-tablo bg-white bg-lightcoral mt-0"
                  href="#"
                >
                  <div className="label">Total Teachers</div>
                  <div className="value">43</div>
                </a>
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header">TEACHERS GENDER RATIO</h6>
                  <Doughnut
                    data={stuGenderRatio}
                    height={100}
                    width={100}
                    options={{
                      cutoutPercentage: 80,
                    }}
                  />
                </div>
              </div>
              {/* User */}
              <div className="col-md-3">
                <a
                  className="element-box el-tablo bg-white bg-bisque mt-0"
                  href="#"
                >
                  <div className="label">Total Users</div>
                  <div className="value">51</div>
                </a>
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header">USERS GENDER RATIO</h6>
                  <Doughnut
                    data={stuGenderRatio}
                    height={100}
                    width={100}
                    options={{
                      cutoutPercentage: 80,
                    }}
                  />
                </div>
              </div>
              {/* Other Counts */}
              <div className="col-md-3">
                <a
                  className="element-box el-tablo bg-white bg-azure mt-0"
                  href="#"
                >
                  <div className="label">Active Term </div>
                  <div className="value">First Term</div>
                </a>
                <a className="element-box el-tablo bg-white mt-0" href="#">
                  <div className="label">Total Classes</div>
                  <div className="value">24</div>
                </a>
                <a className="element-box el-tablo bg-white mt-0" href="#">
                  <div className="label">Total Subjects</div>
                  <div className="value">38</div>
                </a>
                <a className="element-box el-tablo bg-white mt-0" href="#">
                  <div className="label">Total Periods</div>
                  <div className="value">9</div>
                </a>
              </div>
            </div>

            {/* Upcoming Birthdays Section */}
            <div className="row mt-5">
              <div className="col-md-6">
                <h6 className="element-header">Upcoming Students Birthdays</h6>
                <div className="text-center element-box-tp">
                  <div className="table-responsive">
                    <table className="table table-padded">
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
                          <td className="text-left">James Ikechukwu Agbo</td>
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
              <div className="col-md-6">
                <h6 className="element-header">Upcoming Teachers Birthdays</h6>
                <div className="text-center element-box-tp">
                  <div className="table-responsive">
                    <table className="table table-padded">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="text-left">Teacher</th>
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
                          <td className="text-left">James Ikechukwu Agbo</td>
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

            {/* Ratio Section */}
            <div className="row mt-5">
              <div className="col-12">
                <h6 className="element-header">Ratios</h6>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <a
                      className="element-box el-tablo no-bg bg-ivory mt-0"
                      href="#"
                    >
                      <div className="label">Avr Students per class</div>
                      <div className="value">43</div>
                    </a>
                  </div>
                  <div className="col-md-6">
                    <a
                      className="element-box el-tablo no-bg bg-gainsboro mt-0"
                      href="#"
                    >
                      <div className="label">Total Devices</div>
                      <div className="value">35</div>
                    </a>
                  </div>
                  <div className="col-md-6">
                    <a
                      className="element-box el-tablo no-bg bg-darkseagreen mt-0"
                      href="#"
                    >
                      <div className="label">Total Assigned Devices</div>
                      <div className="value">32</div>
                    </a>
                  </div>
                  <div className="col-md-6">
                    <a
                      className="element-box el-tablo no-bg bg-lightcoral total_std mt-0"
                      href="#"
                    >
                      <div className="label">Total Unassigned Devices</div>
                      <div className="value">3</div>
                    </a>
                  </div>
                  <div className="col-md-6">
                    <a
                      className="element-box el-tablo no-bg bg-azure total_std mt-0"
                      href="#"
                    >
                      <div className="label">Total Graduated Students</div>
                      <div className="value">2,390</div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="element-box bg-white mt-0">
                  <h6 className="element-header">STUDENTS TO LEVEL RATIO</h6>
                  <Bar data={data} width={100} height={50} />
                </div>
              </div>

              {/* Attendance Section */}
              <div className="col-12 mt-3">
                <div className="element-box">
                  <h6 className="element-header">STUDENTS TO STATE RATIO</h6>
                  <Bar data={stuStateRatio} width={100} height={20} />
                </div>
              </div>
            </div>

            {/* Attendance Section */}
            <div className="row mt-5">
              <div className="col-12">
                <h6 className="element-header">Attendance</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
