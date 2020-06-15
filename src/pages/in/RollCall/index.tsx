import React, { FC, useState, useEffect } from "react";
import { IProps } from "../../../models/IProps";
import { authService } from "../../../services/Auth.Service";
import { GetAppName } from "../../../context/App";
import Helmet from "react-helmet";
import SwitchInput from "../../partials/SwitchInput";
import AttendanceResult from "./AttendanceResult";

const ClassAttendance: FC<IProps> = ({ history }) => {
  const [showFilter, SetShowFilter] = useState<boolean>(true);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  return (
    <>
      <Helmet>
        <title>Roll Call | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div className="element-actions" style={{ marginTop: "-20px" }}>
              {/* Date Range Filter switch */}
              <SwitchInput
                isOn={showFilter}
                handleToggle={() => {
                  SetShowFilter(!showFilter);
                }}
                label="Date Filter"
              />
            </div>
            <h5 className="element-header">Roll Call Report</h5>

            {/* Attendance Result */}
            <div className="row justify-content-center">
              <AttendanceResult showFilter={showFilter} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassAttendance;
