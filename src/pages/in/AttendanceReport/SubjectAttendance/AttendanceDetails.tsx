/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { FC, useState } from "react";
import Select from "react-select";
import { CLEAN_DATE } from "../../../../context/App";
import SmallImage from "../../partials/SmallImage";
import { IImageProp } from "../../../../models/IImageProp";
import ImageModal from "../../../partials/ImageModal";

interface IProps {
  attData: any;
  onBackClick: any;
}

const AttendanceDetails: FC<IProps> = ({ attData, onBackClick }) => {
  const [activeAtt, SetActiveAtt] = useState<any>(attData[0]);
  const [showSummary, SetShowSummary] = useState<boolean>(true);
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });
  // const [activeAttSort, SetActiveAttSort] = useState<number>();

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
    <div className="row">
      {attData.length > 0 && (
        <>
          {/* Date Section */}
          <div className="col-md-4">
            <div className="element-box">
              <div className="element-actions">
                {/* Back to Timetable button */}
                <button
                  className="btn btn-primary mt-n2"
                  onClick={() => {
                    onBackClick();
                  }}
                >
                  Back
                </button>
              </div>
              <h6 className="element-header">Date</h6>
              {attData?.map((rec: any, idx: number) => (
                <a
                  key={idx}
                  className={`el-tablo att-date-crd ${
                    activeAtt?.date === rec.date ? "active-att-date" : ""
                  }`}
                  href="javascript:void(0)"
                  onClick={() => {
                    SetActiveAtt(undefined);
                    setTimeout(() => {
                      SetActiveAtt(rec);
                    }, 0);
                  }}
                >
                  <div className="row">
                    <div className="col-10">
                      <div className="text-primary">
                        {CLEAN_DATE(rec.date).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {activeAtt && (
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
                </span>
                <h6
                  className="element-header"
                  style={{
                    marginBottom: showSummary ? "30px" : "0",
                  }}
                >
                  Summary ({" "}
                  <b className="text-primary">{CLEAN_DATE(activeAtt.date)}</b> )
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
                        <div className="value">
                          {activeAtt.stats?.present + activeAtt.stats?.absent}
                        </div>
                      </a>
                    </div>
                    <div className="col-4">
                      <a
                        className="element-box el-tablo no-bg bg-azure"
                        href="#"
                      >
                        <div className="label">Total present</div>
                        <div className="value text-primary">
                          {activeAtt.stats?.present}
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
                          {activeAtt.stats?.absent}
                        </div>
                      </a>
                    </div>
                    <div className="col-4">
                      <a
                        className="element-box el-tablo no-bg bg-gold mb-0"
                        href="#"
                      >
                        <div className="label">Manual</div>
                        <div className="value">{activeAtt.stats?.manual}</div>
                      </a>
                    </div>
                    <div className="col-4">
                      <a
                        className="element-box el-tablo no-bg bg-bisque mb-0"
                        href="#"
                      >
                        <div className="label">Exempted</div>
                        <div className="value text-danger">
                          {activeAtt.stats?.exempted}
                        </div>
                      </a>
                    </div>
                    <div className="col-4">
                      <a
                        className="element-box el-tablo no-bg bg-ivory mb-0"
                        href="#"
                      >
                        <div className="label">Device Used</div>
                        <div className="value">{activeAtt.device?.name}</div>
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
                        // SetActiveAttSort(item?.value || 1);
                      }}
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="text-left">Student</th>
                          <th className="text-left">Gender</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeAtt.students.map((stu: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-left">
                              <SmallImage
                                imgPath={stu.student?.passport}
                                onClick={() =>
                                  SetActiveImg({
                                    image: stu.student?.passport,
                                    name: stu.student?.full_name,
                                  })
                                }
                              />{" "}
                              &nbsp;
                              {stu.student?.full_name}
                            </td>
                            <td className="text-left">{stu.student?.gender}</td>
                            <td>
                              <label
                                className={`badge ${
                                  stu.present
                                    ? "badge-success-inverted"
                                    : "badge-danger-inverted"
                                }`}
                              >
                                {stu.present ? "Present" : "Absent"}
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {attData.length === 0 && (
        <>
          <div className="col-12 text-center">
            <h5 className="text-danger text-center mt-5">
              {" "}
              No Attendance record found!
            </h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                onBackClick();
              }}
            >
              <i className="os-icon os-icon-arrow-left6"></i>
              Back
            </button>
          </div>
        </>
      )}

      {/* Modal for Image */}
      <ImageModal image={activeImg.image} name={activeImg.name} />
    </div>
  );
};

export default AttendanceDetails;
