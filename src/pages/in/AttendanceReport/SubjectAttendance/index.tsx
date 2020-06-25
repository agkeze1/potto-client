/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import { authService } from "../../../../services/Auth.Service";
import { IProps } from "../../../../models/IProps";
import Helmet from "react-helmet";
import { GetAppName } from "../../../../context/App";
import LevelClass from "../../partials/LevelClass";
import SwitchInput from "../../../partials/SwitchInput";
import DayTimetable from "./DayTimetable";
import { GET_CLASS } from "../../../../queries/Class.query";
import { useLazyQuery } from "@apollo/react-hooks";
import { ToggleExpansion } from "../../../../context/App";
import LoadingState from "../../../partials/loading";

const SubjectAttendance: FC<IProps> = ({ history }) => {
  const [showFilter, SetShowFilter] = useState<boolean>(true);
  const [attInput, SetAttInput] = useState<any>();

  // Get  School of logged in user
  const { school } = authService.GetUser();

  // Get Class Object
  const [GetClass, { loading: cLoading, data: cData }] = useLazyQuery(
    GET_CLASS
  );

  return (
    <>
      <Helmet>
        <title>Subject Attendance | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            {!showFilter && (
              <div
                className="element-actions"
                style={{
                  marginTop: "-20px",
                }}
              >
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
                          GetClass({
                            variables: {
                              id: attInput?.current_class?.value,
                            },
                          });
                          SetShowFilter(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {!showFilter && (
                <>
                  <div className="col-12">
                    <div className="element-box bg-azure p-0 pl-3">
                      <div className="row">
                        <div className="col-sm-4">
                          <LoadingState loading={cLoading} />
                          <div className="users-list-w bdr-r">
                            {cData?.GetClass.doc.form_teacher && (
                              <div className="user-w">
                                <div className="user-avatar-w">
                                  <div className="user-avatar">
                                    <img
                                      alt=""
                                      src={
                                        cData?.GetClass.doc.form_teacher?.image
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="user-name">
                                  <h6 className="user-title">
                                    {cData?.GetClass.doc.form_teacher?.name}
                                  </h6>
                                  <div className="user-role text-primary">
                                    Form Teacher
                                  </div>
                                </div>
                              </div>
                            )}
                            {!cData?.GetClass.doc.form_teacher && (
                              <h6 className="text-danger mt-3">
                                No Form teacher
                              </h6>
                            )}
                          </div>
                        </div>
                        <div className="col-sm-6 mt-3">
                          <label htmlFor="">
                            Level |{" "}
                            <b>{attInput?.level?.label || "No Level"}</b>
                          </label>
                          <br />
                          <label htmlFor="">
                            Class |{" "}
                            <b>
                              {attInput?.current_class?.label || "No Class"}
                            </b>
                          </label>
                        </div>
                        <div className="col-sm-2 mt-1 ml-n2">
                          <a
                            href="javascript:void(0)"
                            title="Expand / Collapse"
                            className="icon-lg m-3 float-right"
                            onClick={() => {
                              ToggleExpansion();
                            }}
                          >
                            <i className="os-icon os-icon-maximize"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <DayTimetable
                      level={attInput?.level}
                      _class={attInput?.current_class}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SubjectAttendance;
