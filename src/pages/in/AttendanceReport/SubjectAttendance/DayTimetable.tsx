/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { FC, useState } from "react";
import days from "../../../../data/days.json";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_CLASS_TIMETABLE } from "../../../../queries/Timetable.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../../context/App";
import LoadingState from "../../../partials/loading";
import { TIMETABLE_ATTENDANCE } from "../../../../queries/attendance.query";
import AttendanceDetails from "./AttendanceDetails";
import { OrderTimetableByDay } from "../../../../context/App";

interface IProps {
  level: any;
  _class: any;
}

const DayTimetable: FC<IProps> = ({ level, _class }) => {
  const [activeRecord, SetActiveRecord] = useState<any>();
  const [activeAttDetails, SetActiveAttDetails] = useState<any>();
  const [showAttDetails, SetShowAttDetails] = useState<any>();
  const [clickedTimetablee, SetClickedTimetable] = useState<any>();

  // Get Class timetable
  const { loading, data } = useQuery(GET_CLASS_TIMETABLE, {
    variables: { _class: _class?.value },
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      const orderedRec = OrderTimetableByDay(data.GetClassTimetable.docs);
      if (orderedRec) SetActiveRecord(orderedRec[0]);
    },
    fetchPolicy: "network-only",
  });

  const [GetTimetableAttendance, { loading: ttALoading }] = useLazyQuery(
    TIMETABLE_ATTENDANCE,
    {
      onError: (err) => toast.error(CleanMessage(err.message)),
      onCompleted: (data) => {
        SetActiveAttDetails(data.GetAttendanceByTimetable.docs);
        SetShowAttDetails(true);
      },
      fetchPolicy: "network-only",
    }
  );

  return (
    <div className="row">
      <LoadingState loading={loading} />
      {data && (
        <>
          {data.GetClassTimetable.docs.length > 0 && (
            <>
              {!showAttDetails && (
                <>
                  {/* Day Section */}
                  <div className="col-md-4">
                    <div className="element-box no-bg bg-white">
                      <h6 className="element-header">Days</h6>
                      {OrderTimetableByDay(data.GetClassTimetable.docs)?.map(
                        (item: any, idx: number) => (
                          <a
                            key={idx}
                            className={`el-tablo att-date-crd ${
                              activeRecord?.day === item?.day
                                ? "active-att-date"
                                : ""
                            }`}
                            href="javascript:void(0)"
                            onClick={() => {
                              SetActiveRecord(undefined);
                              setTimeout(() => {
                                SetActiveRecord(item);
                              }, 0);
                            }}
                          >
                            <div className="row">
                              <div className="col-10">
                                <div className="text-primary">
                                  {days.days
                                    .find((i: any) => i.value === item?.day)
                                    ?.label.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  {/* Timetable section */}
                  {activeRecord && (
                    <div className="col-md-8">
                      <div className="element-box no-bg bg-white">
                        <h6 className="element-header">
                          Timetable{" "}
                          <b className="text-primary">
                            ({" "}
                            {days.days
                              .find((i: any) => i.value === activeRecord.day)
                              ?.label.toUpperCase()}{" "}
                            )
                          </b>
                        </h6>
                        {activeRecord.timetable_list.length > 0 && (
                          <div className="row">
                            {activeRecord.timetable_list?.map(
                              (tt: any, index: number) => (
                                <div className="col-4">
                                  <a
                                    key={index}
                                    className="element-box el-tablo bg-azure no-bg bdr p-3"
                                    href="javascript:void(0)"
                                    onClick={() => {
                                      SetClickedTimetable(tt);
                                      GetTimetableAttendance({
                                        variables: {
                                          timetable: tt.id,
                                        },
                                      });
                                    }}
                                  >
                                    <h6 className="label element-header">
                                      {tt.period?.from_time} -{" "}
                                      {tt.period?.to_time}
                                      {clickedTimetablee?.id === tt.id && (
                                        <LoadingState loading={ttALoading} />
                                      )}
                                    </h6>

                                    <label
                                      className="label"
                                      style={{ marginTop: "-20px" }}
                                    >
                                      {tt.teacher?.name}
                                    </label>
                                    <div className="value text-primary">
                                      {tt.subject?.code}
                                    </div>
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {activeRecord.timetable_list.length === 0 && (
                          <div className="col-12">
                            <h6 className="text-danger text-center">
                              No Timetable record found!
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {data.GetClassTimetable.docs.length === 0 && (
            <>
              <div className="col-12">
                <h5 className="text-danger text-center mt-5">
                  No Timetable record found for selected class!
                </h5>
              </div>
            </>
          )}

          {showAttDetails && (
            <>
              <div className="col-12">
                <AttendanceDetails
                  attData={activeAttDetails}
                  onBackClick={() => {
                    SetShowAttDetails(false);
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DayTimetable;
