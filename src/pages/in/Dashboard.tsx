/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, DayString, cleanDate } from "../../context/App";
import { Doughnut, Bar } from "react-chartjs-2";
import { DASHBOARD } from "../../queries/Dashboard.query";
import { useQuery } from "@apollo/react-hooks";
import LoadingState from "../partials/loading";
import { CountCard } from "./partials/CountCard";
import months from "../../data/month.json";
import TotalSchool from "../partials/Dashboard/TotalSchool";

const Dashboard = () => {
  const [stuGenderRatio, SetStuGenderRatio] = useState<any>();
  const [tchrGenderRatio, SetTchrGenderRatio] = useState<any>();
  const [userGenderRatio, SetUserGenderRatio] = useState<any>();
  const [stuLevelRatio, SetStuLevelRatio] = useState<any>();
  const [stuClassRatio, SetStuClassRatio] = useState<any>();
  const [stuStateRatio, SetStuStateRatio] = useState<any>();
  const [weeklyRollcallStat, SetWeeklyRollcallStat] = useState<any>();

  const { loading: activeTermLoading, data: activeTermData } = useQuery(
    DASHBOARD.ACTIVE_TERM
  );
  const { loading: totalStudentsLoading, data: totalStudentsData } = useQuery(
    DASHBOARD.TOTAL_STUDENTS
  );
  const { loading: totalTeachersLoading, data: totalTeachersData } = useQuery(
    DASHBOARD.TOTAL_TEACHERS
  );
  const { loading: totalUserLoading, data: totalUserData } = useQuery(
    DASHBOARD.TOTAL_USERS
  );
  const { loading: totalSubjectLoading, data: totalSubjectData } = useQuery(
    DASHBOARD.TOTAL_SUBJECTS
  );
  const { loading: totalPeriodLoading, data: totalPeriodData } = useQuery(
    DASHBOARD.TOTAL_PERIODS
  );
  const { loading: totalDevicesLoading, data: totalDevicesData } = useQuery(
    DASHBOARD.TOTAL_DEVICES
  );
  const {
    loading: assignedDevicesLoading,
    data: assignedDevicesData,
  } = useQuery(DASHBOARD.TOTAL_ASSIGNED_DEVICES);
  const {
    loading: unassignedDevicesLoading,
    data: unassignedDevicesData,
  } = useQuery(DASHBOARD.TOTAL_UNASSIGNED_DEVICES);
  const {
    loading: graduatedStudentsLoading,
    data: graduatedStudentsData,
  } = useQuery(DASHBOARD.GRADUATED_STUDENTS);
  const { loading: stuBirthdayLoading, data: stuBirthdayData } = useQuery(
    DASHBOARD.STU_BIRTHDAY
  );
  const { loading: tchrBirthdayLoading, data: tchrBirthdayData } = useQuery(
    DASHBOARD.TCHR_BIRTHDAY
  );
  const { loading: stuClassRatioLoading } = useQuery(
    DASHBOARD.STU_CLASS_RATIO,
    {
      onCompleted: (data) => {
        if (data?.GetStudentClassRatio) {
          SetStuClassRatio({
            labels: data.GetStudentClassRatio?.map(
              (ratio: any) => ratio.class_name
            ),
            datasets: [
              {
                label: "Number of Students",
                backgroundColor: "rgba(104, 156, 107,0.2)",
                borderColor: "rgba(104, 156, 107,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(104, 156, 107,0.5)",
                hoverBorderColor: "rgba(104, 156, 107,1)",
                data: data.GetStudentClassRatio?.map(
                  (ratio: any) => ratio.total
                ),
              },
            ],
          });
        }
      },
    }
  );
  const { loading: stuLevelRatioLoading } = useQuery(
    DASHBOARD.STU_LEVEL_RATIO,
    {
      onCompleted: (data) => {
        if (data?.GetStudentLevelRatio) {
          SetStuLevelRatio({
            labels: data.GetStudentLevelRatio.map(
              (ratio: any) => ratio.level_name
            ),
            datasets: [
              {
                label: "Number of Students",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: data.GetStudentLevelRatio.map(
                  (ratio: any) => ratio.total
                ),
              },
            ],
          });
        }
      },
    }
  );
  const { loading: stuGenderRatioLoading } = useQuery(
    DASHBOARD.STU_GENDER_RATIO,
    {
      onCompleted: (data) => {
        if (data?.CountStudentByGender) {
          SetStuGenderRatio({
            datasets: [
              {
                data: data.CountStudentByGender?.map(
                  (ratio: any) => ratio.total
                ),
                backgroundColor: ["#6cafbd", "#aed1be"],
                hoverBackgroundColor: ["#4ca0d9", "#80a691"],
              },
            ],
            labels: data?.CountStudentByGender?.map(
              (ratio: any) => ratio.gender
            ),
          });
        }
      },
    }
  );
  const { loading: stuStateRatioLoading } = useQuery(
    DASHBOARD.STU_STATE_RATIO,
    {
      onCompleted: (data) => {
        if (data?.GetStudentStateRatio) {
          SetStuStateRatio({
            labels: data.GetStudentStateRatio?.map((ratio: any) => ratio.state),
            datasets: [
              {
                label: "Number of Students",
                backgroundColor: "rgba(0,99,132,0.2)",
                borderColor: "rgba(0,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(0,99,132,0.4)",
                hoverBorderColor: "rgba(0,99,132,1)",
                data: data.GetStudentStateRatio?.map(
                  (ratio: any) => ratio.total
                ),
              },
            ],
          });
        }
      },
    }
  );
  const { loading: tchrGenderRatioLoading } = useQuery(
    DASHBOARD.TCHR_GENDER_RATIO,
    {
      onCompleted: (data) => {
        if (data?.GetTeacherGenderRatio) {
          SetTchrGenderRatio({
            datasets: [
              {
                data: data.GetTeacherGenderRatio?.map(
                  (ratio: any) => ratio.total
                ),
                backgroundColor: ["#3e4b5b", "lightcoral"],
                hoverBackgroundColor: ["#19191a", "#d94e2b"],
              },
            ],
            labels: data?.GetTeacherGenderRatio?.map(
              (ratio: any) => ratio.gender
            ),
          });
        }
      },
    }
  );
  const { loading: userGenderRatioLoading } = useQuery(
    DASHBOARD.USER_GENDER_RATIO,
    {
      onCompleted: (data) => {
        if (data?.GetUsersGenderRatio) {
          SetUserGenderRatio({
            datasets: [
              {
                data: data.GetUsersGenderRatio?.map(
                  (ratio: any) => ratio.total
                ),
                backgroundColor: ["#dbcd88", "#3e4b5b"],
                hoverBackgroundColor: ["#968638", "#19191a"],
              },
            ],
            labels: data?.GetUsersGenderRatio?.map(
              (ratio: any) => ratio.gender
            ),
          });
        }
      },
    }
  );
  const { loading: weeklyRollcallLoading } = useQuery(
    DASHBOARD.WEEKLY_ROLLCAL_SUMMARY,
    {
      onCompleted: (data) => {
        if (data) SetWeeklyRollcallStat(data.GetWeeklyRollCallAttendanceRatio);
      },
    }
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">Dashboard</h5>

            {/* Counts Section */}
            <div className="row">
              {/* Students */}
              <div className="col-md-3">
                <CountCard
                  title="Total Students"
                  loading={totalStudentsLoading}
                  value={totalStudentsData?.TotalStudents}
                  cssClass="bg-darkseagreen"
                />
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header mb-2">STUDENTS GENDER RATIO</h6>
                  <LoadingState loading={stuGenderRatioLoading} />
                  {stuGenderRatio && (
                    <Doughnut
                      data={stuGenderRatio}
                      height={100}
                      width={100}
                      options={{
                        cutoutPercentage: 80,
                      }}
                    />
                  )}
                </div>
              </div>
              {/* Teachers */}
              <div className="col-md-3">
                <CountCard
                  title="Total Teachers"
                  loading={totalTeachersLoading}
                  value={totalTeachersData?.TotalTeachers}
                  cssClass="bg-lightcoral"
                />
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header mb-2">TEACHERS GENDER RATIO</h6>
                  <LoadingState loading={tchrGenderRatioLoading} />
                  {tchrGenderRatio && (
                    <Doughnut
                      data={tchrGenderRatio}
                      height={100}
                      width={100}
                      options={{
                        cutoutPercentage: 80,
                      }}
                    />
                  )}
                </div>
              </div>
              {/* User */}
              <div className="col-md-3">
                <CountCard
                  title="Total Users"
                  loading={totalUserLoading}
                  value={totalUserData?.TotalUsers}
                  cssClass="bg-white bg-gold"
                />
                <div className=" element-box bg-white mt-0">
                  <h6 className="element-header mb-2">USERS GENDER RATIO</h6>
                  <LoadingState loading={userGenderRatioLoading} />
                  <Doughnut
                    data={userGenderRatio}
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
                <TotalSchool />
                <CountCard
                  title="Active Term"
                  loading={activeTermLoading}
                  value={activeTermData?.GetActiveTerm?.doc?.term?.name}
                  cssClass="bg-white bg-azure"
                />

                <CountCard
                  title="Total Period"
                  loading={totalPeriodLoading}
                  value={totalPeriodData?.TotalPeriod}
                />

                <CountCard
                  title="Total Subjects"
                  loading={totalSubjectLoading}
                  value={totalSubjectData?.TotalSubjects}
                />
              </div>
            </div>

            {/* Upcoming Birthdays Section */}
            <div className="row mt-5">
              {/* Students Birthday */}
              <div className="col-md-6">
                <h6 className="element-header">Upcoming Students Birthdays</h6>
                <div className="text-center element-box p-0 no-bg bg-white">
                  <div className="table-responsive">
                    <LoadingState loading={stuBirthdayLoading} />
                    {stuBirthdayData?.UpcomingStudentsBirthday && (
                      <table className="table table-striped">
                        {stuBirthdayData?.UpcomingStudentsBirthday?.length >
                          0 && (
                          <thead>
                            <tr>
                              <th>#</th>

                              <th className="text-left">Student</th>
                              <th className="text-left">Date</th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {stuBirthdayData?.UpcomingStudentsBirthday?.map(
                            (item: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td className="text-left">
                                  {item.student?.full_name}
                                </td>
                                <td className="text-left">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: DayString(item.day),
                                    }}
                                  ></span>
                                  <strong>
                                    {" " + months[item.month - 1].name}
                                  </strong>
                                </td>
                              </tr>
                            )
                          )}
                          {stuBirthdayData?.UpcomingStudentsBirthday?.length ===
                            0 && (
                            <tr>
                              <td className="text-danger" colSpan={5}>
                                No Upcoming Students birthday
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
              {/* Teachers Birthday */}
              <div className="col-md-6">
                <h6 className="element-header">Upcoming Teachers Birthdays</h6>
                <div className="text-center element-box p-0 no-bg bg-white">
                  <div className="table-responsive">
                    <LoadingState loading={tchrBirthdayLoading} />
                    {tchrBirthdayData?.UpcomingTeachersBirthday && (
                      <table className="table table-striped">
                        {tchrBirthdayData?.UpcomingTeachersBirthday?.length >
                          0 && (
                          <thead>
                            <tr>
                              <th>#</th>
                              <th className="text-left">Teacher</th>
                              <th className="text-left">Date</th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {tchrBirthdayData?.UpcomingTeachersBirthday?.map(
                            (item: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-left">
                                  {item.teacher?.name}
                                </td>
                                <td className="text-left">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: DayString(item.day),
                                    }}
                                  ></span>
                                  <strong>
                                    {" " + months[item.month - 1].name}
                                  </strong>
                                </td>
                              </tr>
                            )
                          )}
                          {tchrBirthdayData?.UpcomingTeachersBirthday
                            ?.length === 0 && (
                            <tr>
                              <td className="text-danger" colSpan={4}>
                                No Upcoming Teachers birthday
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
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
                    <CountCard
                      title="Total Devices"
                      loading={totalDevicesLoading}
                      value={totalDevicesData?.TotalDevices}
                      cssClass="bg-gainsboro"
                    />
                  </div>
                  <div className="col-md-6">
                    <CountCard
                      title="Total Assigned Devices"
                      loading={assignedDevicesLoading}
                      value={assignedDevicesData?.TotalAssignedDevices}
                      cssClass="bg-darkseagreen"
                    />
                  </div>
                  <div className="col-md-6">
                    <CountCard
                      title="Total Unassigned Devices"
                      loading={unassignedDevicesLoading}
                      value={unassignedDevicesData?.TotalUnassignedDevices}
                      cssClass="bg-lightcoral"
                    />
                  </div>
                  <div className="col-md-6">
                    <CountCard
                      title="Total Graduated Students"
                      loading={graduatedStudentsLoading}
                      value={graduatedStudentsData?.GraduatedStudentCount}
                      cssClass="bg-azure"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="element-box bg-white mt-0">
                  <h6 className="element-header">STUDENTS TO LEVEL RATIO</h6>
                  <LoadingState loading={stuLevelRatioLoading} />
                  {stuLevelRatio && (
                    <Bar data={stuLevelRatio} width={100} height={50} />
                  )}
                </div>
              </div>

              {/* Students to Class ratio */}
              <div className="col-12 mt-3">
                <div className="element-box">
                  <h6 className="element-header">STUDENTS TO CLASS RATIO</h6>
                  <LoadingState loading={stuClassRatioLoading} />
                  {stuClassRatio && (
                    <Bar data={stuClassRatio} width={100} height={30} />
                  )}
                </div>
              </div>

              {/* Students to state ratio */}
              <div className="col-12 mt-3">
                <div className="element-box">
                  <h6 className="element-header">STUDENTS TO STATE RATIO</h6>
                  <LoadingState loading={stuStateRatioLoading} />
                  {stuStateRatio && (
                    <Bar data={stuStateRatio} width={100} height={30} />
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Section */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="element-box no-bg bg-white">
                  <h6 className="element-header">
                    DAILY ROLL CALL ATTENDANCE SUMMARY ( IN ONE WEEK )
                  </h6>
                  <LoadingState loading={weeklyRollcallLoading} />
                  {weeklyRollcallStat?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="text-left">Date</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Present</th>
                            <th className="text-center">Absent</th>
                            <th className="text-center">Exempted</th>
                            <th className="text-center">Manual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weeklyRollcallStat?.map((stat: any, idx: number) => (
                            <tr>
                              <td>{idx + 1}</td>
                              <td className="text-left">
                                {cleanDate(stat?.date)}
                              </td>
                              <td className="text-center">
                                <span className="badge badge-dark">
                                  {stat?.total}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-success">
                                  {stat?.present}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-danger">
                                  {stat?.absent}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-info">
                                  {stat?.exempted || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-warning">
                                  {stat?.manual}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {weeklyRollcallStat?.length === 0 && (
                    <div className="text-center">
                      <h5 className="text-danger">
                        No Rollcall Stat. available in the past week!
                      </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
