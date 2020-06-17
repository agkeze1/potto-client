import React, { FC, useState } from "react";
import { authService } from "../../../services/Auth.Service";
import { IProps } from "../../../models/IProps";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import LevelClass from "../partials/LevelClass";
import SwitchInput from "../../partials/SwitchInput";
import DayTimetable from "./DayTimetable";

const SubjectAttendance: FC<IProps> = ({ history }) => {
  const [showFilter, SetShowFilter] = useState<boolean>(true);
  const [attInput, SetAttInput] = useState<any>();

  // Get  School of logged in user
  const { school } = authService.GetUser();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  return (
    <>
      <Helmet>
        <title>Subject Attendance | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            {!showFilter && (
              <div className="element-actions" style={{ marginTop: "-20px" }}>
                {/* Date Range Filter switch */}
                <SwitchInput
                  isOn={showFilter}
                  handleToggle={() => {
                    SetAttInput(undefined);
                    SetShowFilter(!showFilter);
                  }}
                  label="Change Class"
                />
              </div>
            )}

            <h5 className="element-header">Subject Attendance</h5>
            <div className="row justify-content-center">
              {showFilter && (
                <div className="col-12">
                  <div className="element-box">
                    <LevelClass
                      schoolId={school?.id}
                      onLevelChange={(level: any) =>
                        SetAttInput({
                          ...attInput,
                          level: level,
                          current_class: undefined,
                        })
                      }
                      onClassChange={(_class: any) =>
                        SetAttInput({
                          ...attInput,
                          current_class: _class,
                        })
                      }
                      onSubmit={() => {
                        if (attInput?.current_class) {
                          SetShowFilter(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {!showFilter && (
                <div className="col-12">
                  <DayTimetable
                    level={attInput?.level}
                    _class={attInput?.current_class}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SubjectAttendance;
