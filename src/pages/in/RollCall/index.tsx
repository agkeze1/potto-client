import React, { FC, useState, useEffect } from "react";
import { IProps } from "../../../models/IProps";
import { authService } from "../../../services/Auth.Service";
import { GetAppName } from "../../../context/App";
import Helmet from "react-helmet";
import Select from "react-select";
import SwitchInput from "../../partials/SwitchInput";
import LevelClass from "../partials/LevelClass";
import FromToDate from "../partials/FromToDate";
import AttendanceResult from "./AttendanceResult";
import { useLazyQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { ROLL_CALL } from "../../../queries/attendance.query";
import LoadingState from "../../partials/loading";

const ClassAttendance: FC<IProps> = ({ history }) => {
  const [showAttendance, SetShowAttendance] = useState<boolean>();
  const [showDateRange, SetShowDateRange] = useState<boolean>(true);
  const [showAttendanceResult, SetShowAttendanceResult] = useState<boolean>();
  const [showSummary, SetShowSummary] = useState<boolean>(true);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [attendanceInput, SetAttendanceInput] = useState<any>();
  const [attendanceResult, SetAttendanceResult] = useState<any>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }
  // Get  School of logged in user
  const { school } = authService.GetUser();

  const [GetRollCall, { loading }] = useLazyQuery(ROLL_CALL, {
    onError: (err) => toast.error(err.message),
    onCompleted: (data) => {
      if (data) SetAttendanceResult(data.GetClassRollCallAttendances.docs);
      console.log("Attendance Result: ", data.GetClassRollCallAttendances.docs);
    },
  });

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
            <LoadingState loading={loading} />
            {/* Attendance Result */}
            {showAttendance && attendanceInput?.current_class && (
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
                        ) {
                          GetRollCall({
                            variables: {
                              _class: attendanceInput.current_class?.id,
                              start: attendanceInput.fromDate,
                              end: attendanceInput.toDate,
                            },
                          });
                          SetShowAttendanceResult(true);
                        }
                      }}
                    />
                  </div>
                )}
                {showAttendanceResult && (
                  <AttendanceResult
                    activeLevel={activeLevel?.name}
                    activeClass={attendanceInput?.current_class?.name}
                    onChangeClass={() => {
                      SetAttendanceInput(undefined);
                      SetShowAttendance(false);
                      SetShowAttendanceResult(false);
                    }}
                  />
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
