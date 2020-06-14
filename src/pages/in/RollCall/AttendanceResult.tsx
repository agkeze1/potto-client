import React, { FC, useState } from "react";
import Select from "react-select";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CLEAN_DATE } from "../../../context/App";
import { GET_CLASS } from "../../../queries/Class.query";
import LoadingState from "../../partials/loading";

interface IProps {
  record: any;
  onChangeClass: any;
  activeLevel: string;
  activeClass: any;
}

const AttendanceResult: FC<IProps> = ({
  record,
  onChangeClass,
  activeLevel,
  activeClass,
}) => {
  const [showSummary, SetShowSummary] = useState<boolean>(true);
  const [activeAttSort, SetActiveAttSort] = useState<number>();
  const [activeRecord, SetActiveRecord] = useState<any>();

  const { loading, data } = useQuery(GET_CLASS, {
    variables: {
      id: activeClass?.id,
    },
  });

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

  return (
    <>
      {/* Class info */}
      <div className="col-12">
        <div className="element-box bg-azure p-0 pl-3">
          <div className="row">
            <div className="col-sm-4">
              <div className="users-list-w bdr-r">
                <div className="user-w">
                  <div className="user-avatar-w">
                    <LoadingState loading={loading} />
                    <div className="user-avatar">
                      <img
                        alt=""
                        src={data?.GetClass.doc.form_teacher?.image}
                      />
                    </div>
                  </div>
                  <div className="user-name">
                    <h6 className="user-title">
                      {data?.GetClass.doc.form_teacher?.name}
                    </h6>
                    <div className="user-role text-primary">Form Teacher</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-7 mt-3">
              <label htmlFor="">
                Level | <b>{activeLevel || "No Level"}</b>
              </label>
              <br />
              <label htmlFor="">
                Class | <b>{activeClass?.name || "No Class"}</b>
              </label>
            </div>
            <div className="col-sm-1 mt-3">
              <a
                href="javascript:void(0)"
                title="Change Class"
                className="m-3"
                onClick={() => {
                  onChangeClass();
                }}
              >
                <i className="os-icon os-icon-edit"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {record.length > 0 && (
        <>
          {/* Date Section */}
          <div className="col-md-4">
            <div className="element-box bg-white mt-0">
              <h6 className="element-header">Date</h6>
              {record &&
                record.map((rec: any, index: number) => (
                  <a
                    id={`att-${index}`}
                    key={index}
                    className={`el-tablo att-date-crd ${
                      activeRecord?.date === rec.date ? "active-att-date" : ""
                    }`}
                    href="javascript:void(0)"
                    onClick={() => {
                      SetActiveRecord(undefined);
                      setTimeout(() => {
                        SetActiveRecord(rec);
                      }, 0);
                    }}
                  >
                    <div className="row">
                      <div className="col-10">
                        <div className="">{CLEAN_DATE(rec.date)}</div>
                      </div>
                      <div className="col-2 text-center att-stu">
                        <b className="text-primary">42</b>
                      </div>
                    </div>
                  </a>
                ))}
              {console.log("Element: ", document.getElementById("att-0"))}
            </div>
          </div>
          {activeRecord && (
            <>
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
                    style={{
                      marginBottom: showSummary ? "30px" : "0",
                    }}
                  >
                    Summary
                  </h6>
                  {showSummary && (
                    <div className="row">
                      {/* Counts */}
                      <div className="col-4">
                        <a
                          className="element-box el-tablo bg-darkseagreen no-bg"
                          href="#"
                        >
                          <div className="label">Total Students</div>
                          <div className="value">{activeRecord.total}</div>
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          className="element-box el-tablo no-bg bg-azure"
                          href="#"
                        >
                          <div className="label">Total present</div>
                          <div className="value text-primary">
                            {activeRecord.stats?.present}
                          </div>
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          className="element-box el-tablo no-bg bg-bisque mb-0"
                          href="#"
                        >
                          <div className="label">Total absent</div>
                          <div className="value text-danger">
                            {activeRecord.stats?.absent}
                          </div>
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          className="element-box el-tablo no-bg bg-gold mb-0"
                          href="#"
                        >
                          <div className="label">Manual</div>
                          <div className="value">
                            {activeRecord.stats?.manual}
                          </div>
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          className="element-box el-tablo no-bg bg-bisque mb-0"
                          href="#"
                        >
                          <div className="label">Exempted</div>
                          <div className="value text-danger">
                            {activeRecord.stats?.exempted}
                          </div>
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          className="element-box el-tablo no-bg bg-ivory mb-0"
                          href="#"
                        >
                          <div className="label">Device Used</div>
                          <div className="value">
                            {activeRecord.device?.name}
                          </div>
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
                          {activeRecord.attendances.map(
                            (att: any, index: number) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td className="text-left">
                                  {att.student?.full_name}
                                </td>
                                <td>
                                  <label
                                    className={`badge ${
                                      att.present
                                        ? "badge-success-inverted"
                                        : "badge-danger-inverted"
                                    }`}
                                  >
                                    {att.present ? "Present" : "Absent"}
                                  </label>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {record.length === 0 && (
        <div className="col-12 mt-3">
          <h5 className="text-danger text-center fade-in">
            No Class Attendance record found!
          </h5>
        </div>
      )}
    </>
  );
};

export default AttendanceResult;
