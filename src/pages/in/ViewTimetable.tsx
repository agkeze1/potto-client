import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import { IMessage } from "../../models/IMessage";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import Select from "react-select";
import { GET_CLASS_TIMETABLE } from "../../queries/Timetable.query";
import TimetableList from "./partials/TimetableList";
import { ToggleExpansion } from "../../context/App";

const ViewTimetable: FC<IProps> = ({ history }) => {
  const [ShowTimetable, SetShowTimetable] = useState<boolean>(false);
  const [showFilter, SetShowFilter] = useState<boolean>(true);

  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [tTMessage, SetTTMessage] = useState<IMessage>();
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [timetableInput, SetTimetableInput] = useState<any>();

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
  }, [activeLevel, GetClasses]);

  const [GetTimetable, { loading: tTLoading, data: tTData }] = useLazyQuery(
    GET_CLASS_TIMETABLE,
    {
      onError: (err) =>
        SetTTMessage({
          message: err.message,
          failed: true,
        }),
    }
  );

  return (
    <>
      <Helmet>
        <title>View Timetable | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">View Timetable</h5>
            <div className="row">
              {showFilter && (
                <>
                  <div className="col-12">
                    {/* Select Level and Class Section */}
                    <div className="element-box">
                      <div className="row justify-content-center">
                        <div className="col-lg-12">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (timetableInput?.current_class) {
                                SetShowTimetable(true);
                                SetShowFilter(false);
                                GetTimetable({
                                  variables: {
                                    _class: timetableInput.current_class?.id,
                                  },
                                });
                              }
                            }}
                          >
                            <div className="row">
                              <div className="col-md-6">
                                {/* Level input */}
                                <label>
                                  Level <br />
                                </label>
                                <Select
                                  isLoading={llLoading}
                                  options={levels}
                                  value={{
                                    label: activeLevel?.name || (
                                      <span className="text-gray">
                                        Select...
                                      </span>
                                    ),
                                    value: activeLevel?.id,
                                  }}
                                  onChange={(item: any) => {
                                    SetActiveLevel({
                                      name: item?.label,
                                      id: item?.value,
                                    });
                                    SetTimetableInput({
                                      ...timetableInput,
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
                                    label: timetableInput?.current_class
                                      ?.name || (
                                      <span className="text-gray">
                                        Select...
                                      </span>
                                    ),
                                    value: timetableInput?.current_class?.id,
                                  }}
                                  onChange={(item: any) => {
                                    SetTimetableInput({
                                      ...timetableInput,
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
                                    View Timetable
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <AlertMessage
                message={tTMessage?.message}
                failed={tTMessage?.failed}
              />
              <LoadingState loading={tTLoading} />

              {/* Selected Level and class timetable */}
              {ShowTimetable && tTData?.GetClassTimetable && (
                <div className="col-12">
                  <div className="element-box">
                    <span className="element-actions">
                      <a
                        href="#"
                        title="Change Class"
                        className="m-3"
                        onClick={() => {
                          SetShowFilter(true);
                          SetShowTimetable(false);
                        }}
                      >
                        <i className="os-icon os-icon-edit"></i>
                      </a>
                      <a
                        href="#"
                        title="Toggle expasion"
                        onClick={() => {
                          ToggleExpansion();
                        }}
                      >
                        <i className="os-icon os-icon-maximize"></i>
                      </a>
                    </span>
                    <h6 className="element-header">
                      <b className="text-primary mr-2">
                        {" "}
                        {activeLevel?.name} -{" "}
                        {timetableInput?.current_class?.name}
                      </b>
                      Timetable
                    </h6>
                    <div className="table-responsive">
                      <TimetableList
                        classId={timetableInput.current_class?.id}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTimetable;
