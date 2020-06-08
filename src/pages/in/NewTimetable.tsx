/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import SwitchInput from "../partials/SwitchInput";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { IMessage } from "../../models/IMessage";
import { GET_CLASSES } from "../../queries/Class.query";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import Select from "react-select";
import days from "../../data/days.json";
import { GET_DAY_PERIODS } from "../../queries/Period.query";
import { GET_LEVEL_SUBJECTS } from "../../queries/Subject.query";
import { GET_ALL_TEACHER } from "../../queries/Teacher.query";
import {
  NEW_TIMETABLE,
  GET_CLASS_TIMETABLE,
} from "../../queries/Timetable.query";

const NewTimetable: FC<IProps> = ({ history }) => {
  const [classSet, SetClassSet] = useState<boolean>(false);
  const [daySet, SetDaySet] = useState<boolean>(false);
  const [timetable, SetTimetable] = useState<boolean>(false);
  const [hideFilter, SetHideFilter] = useState<boolean>(false);
  const [showDay, SetShowDay] = useState<boolean>(true);
  const [showPeriod, SetShowPeriod] = useState<boolean>(true);

  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [sMessage, SetSMessage] = useState<IMessage>();
  const [tMessage, SetTMessage] = useState<IMessage>();
  const [nTTMessage, SetNTTMessage] = useState<IMessage>();
  const [tTMessage, SetTTMessage] = useState<IMessage>();
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [subjects, SetSubjects] = useState<any>([]);
  const [teachers, SetTeachers] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [timetableInput, SetTimetableInput] = useState<any>();

  // Period
  const [periods, SetPeriods] = useState<any>([]);
  const [selectedPeriods, SetSelectedPeriods] = useState<any>([]);
  const [pMessage, SetPMessage] = useState<IMessage>();

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
  }, [activeLevel?.id]);

  // Fetch List of Periods under a class
  const [GetPeriods, { loading: pLoading }] = useLazyQuery(GET_DAY_PERIODS, {
    variables: {
      _class: timetableInput?.current_class?.id,
      day: timetableInput?.day?.value,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // Clear selected Periods
      SetSelectedPeriods([]);

      SetPeriods(data.GetPeriodList.docs);
      SetShowPeriod(true);
    },
    onError: (err) =>
      SetPMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Get list of Subjects for Subject dropdown input
  const [GetSubjects, { loading: sLoading }] = useLazyQuery(
    GET_LEVEL_SUBJECTS,
    {
      variables: {
        level: activeLevel?.id,
      },
      fetchPolicy: "network-only",
      onError: (err) => {
        SetSMessage({
          message: err.message,
          failed: true,
        });
      },
      onCompleted: (data) => {
        if (data.GetSubjectsForRegistration.docs) {
          let subList = [...subjects];
          data.GetSubjectsForRegistration.docs.map((sub: any) => {
            subList.push({
              label: sub.title,
              value: sub.id,
            });
          });
          SetSubjects(subList);
        }
      },
    }
  );

  // Get list of Teacher for Teacher dropdown input
  const { loading: tLoading } = useQuery(GET_ALL_TEACHER, {
    onError: (err) => {
      SetTMessage({
        message: err.message,
        failed: true,
      });
    },
    onCompleted: (data) => {
      if (data.GetAllTeachers.docs) {
        const tchrList = [...teachers];
        data.GetAllTeachers.docs.map((tchr: any) => {
          tchrList.push({
            label: tchr.name,
            value: tchr.id,
          });
        });
        SetTeachers(tchrList);
      }
    },
  });

  // Create New Timetable
  const [NewTimetable, { loading: nTTLoading }] = useMutation(NEW_TIMETABLE, {
    onError: (err) => {
      SetNTTMessage({
        message: err.message,
        failed: true,
      });
    },
    onCompleted: (data) => {
      if (data && data.NewTimetable.status === 200) {
        SetNTTMessage({
          message: data.NewTimetable.message,
          failed: false,
        });
        GetPeriods();
        GetTimetable();
      }
    },
  });

  // Gets list of timetable
  const [GetTimetable, { loading: tTLoading, data: tTData }] = useLazyQuery(
    GET_CLASS_TIMETABLE,
    {
      fetchPolicy: "network-only",
      onError: (err) =>
        SetTTMessage({
          message: err.message,
          failed: true,
        }),
    }
  );

  // Check if Period is selected
  const PeriodSelected = (id: string) => {
    const prdSelected = selectedPeriods.findIndex((x: any) => x.id === id);
    return prdSelected !== -1;
  };

  return (
    <>
      <Helmet>
        <title>New Timetable | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div className="element-actions" style={{ marginTop: "-20px" }}>
              {/* New Class and Level Filter switch */}
              <SwitchInput
                isOn={hideFilter}
                handleToggle={() => {
                  SetHideFilter(!hideFilter);
                }}
                label="Hide Filter"
              />
            </div>
            <h5 className="element-header">New Timetable</h5>
            {!hideFilter && (
              <>
                {/* Section for Selecting Level and Class */}
                {!classSet && (
                  <div className="element-box">
                    <div className="row justify-content-center">
                      <div className="col-lg-12">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (timetableInput?.current_class)
                              SetClassSet(true);
                          }}
                        >
                          <div className="row">
                            <div className="col-md-6">
                              {/* Level input */}
                              <label>
                                Level <br />
                              </label>
                              <Select
                                options={levels}
                                value={{
                                  label: activeLevel?.name || (
                                    <span className="text-gray">Select...</span>
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
                                  GetSubjects();
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
                                    <span className="text-gray">Select...</span>
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
                                  Start Timetable
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section for selecting day, Periods, Subject and Teacher */}
                {classSet && (
                  <>
                    <div className="row">
                      {/* Selected Level and Class */}
                      <div className="col-md-4">
                        <div className="element-box">
                          <span className="element-actions">
                            <a
                              href="#"
                              title="Change Info"
                              onClick={() => {
                                SetClassSet(false);
                                SetDaySet(false);
                                SetTimetable(false);
                                SetTimetableInput(undefined);
                              }}
                            >
                              <i className="os-icon os-icon-edit"></i>
                            </a>
                          </span>
                          <h6
                            className={`element-header ${
                              !showDay ? "mb-0" : ""
                            }`}
                          >
                            Selected Level & class
                          </h6>
                          {showDay && (
                            <>
                              <div>
                                <label>Level</label> -{" "}
                                <b className="">{activeLevel?.name}</b>
                              </div>
                              <div>
                                <label>Class</label> -{" "}
                                <b className="">
                                  {timetableInput?.current_class?.name}
                                </b>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Day dropdown */}
                      <div className="col-md-8">
                        <div
                          className="element-box"
                          style={{ paddingBottom: showDay ? "37px" : "" }}
                        >
                          <span className="element-actions">
                            <a
                              href="#"
                              title="toggle collapse"
                              onClick={() => {
                                SetShowDay(!showDay);
                              }}
                            >
                              <i
                                className={`os-icon os-icon-chevron-${
                                  showDay ? "down" : "up"
                                } icon-lg`}
                              ></i>
                            </a>
                          </span>
                          <h6
                            className={`element-header ${
                              !showDay ? "mb-0" : ""
                            }`}
                          >
                            Day Selection
                          </h6>
                          {showDay && (
                            // Day Input
                            <Select
                              options={days.days}
                              value={{
                                label: timetableInput?.day?.label || (
                                  <span className="text-gray">Select...</span>
                                ),
                                value: timetableInput?.day?.value,
                              }}
                              onChange={(day: any) => {
                                if (timetableInput?.day?.value !== day?.value) {
                                  SetPeriods(undefined);

                                  SetPMessage(undefined);
                                  SetTimetableInput({
                                    ...timetableInput,
                                    day: day,
                                  });
                                  GetPeriods();
                                  SetDaySet(true);
                                  GetTimetable({
                                    variables: {
                                      _class: timetableInput?.current_class?.id,
                                    },
                                  });
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {daySet && (
                      <>
                        {/* Period list by selected day */}
                        <div className="element-box">
                          <span className="element-actions">
                            <a
                              href="#"
                              title="toggle collapse"
                              onClick={() => {
                                SetShowPeriod(!showPeriod);
                              }}
                            >
                              <i
                                className={`os-icon os-icon-chevron-${
                                  showPeriod ? "down" : "up"
                                } icon-lg`}
                              ></i>
                            </a>
                          </span>
                          <h6>
                            Period Selection
                            <hr className={` ${!showPeriod ? "mb-0" : ""}`} />
                          </h6>
                          <AlertMessage
                            message={pMessage?.message}
                            failed={pMessage?.failed}
                          />
                          <LoadingState loading={pLoading} />

                          {showPeriod && periods && (
                            <>
                              <div className="row">
                                {periods.map((prd: any, index: number) => (
                                  <>
                                    {!prd.break && !prd.taken && (
                                      <div
                                        key={index}
                                        className={`col-sm-3 p-3 text-center ${
                                          PeriodSelected(prd.id)
                                            ? "std-period"
                                            : "period"
                                        }`}
                                        onClick={() => {
                                          const returnedPrd = selectedPeriods.findIndex(
                                            (i: any) => i.id === prd.id
                                          );
                                          if (returnedPrd !== -1) {
                                            const newPrds = [
                                              ...selectedPeriods,
                                            ];
                                            newPrds.splice(returnedPrd, 1);
                                            SetSelectedPeriods(newPrds);
                                          } else {
                                            const newPrds = [
                                              ...selectedPeriods,
                                            ];
                                            newPrds.unshift(prd);
                                            SetSelectedPeriods(newPrds);
                                          }
                                        }}
                                      >
                                        <label className="mb-0">
                                          {prd.from + " - " + prd.to}
                                        </label>
                                        <br />
                                        <label
                                          className={`${
                                            PeriodSelected(prd.id)
                                              ? "text-danger"
                                              : "text-primary"
                                          }`}
                                        >
                                          {PeriodSelected(prd.id)
                                            ? "Selected"
                                            : "Available"}
                                        </label>
                                      </div>
                                    )}

                                    {(prd.break || prd.taken) && (
                                      <div
                                        className={`col-sm-3 p-3 text-center ${
                                          prd.break
                                            ? "brk-period"
                                            : "tkn-period"
                                        }`}
                                        style={{
                                          border: "1px solid lightgray",
                                        }}
                                      >
                                        <label className="mb-0">
                                          {prd.from + " - " + prd.to}
                                        </label>
                                        {prd.break ? (
                                          <h5 className="text-primary">
                                            Break
                                          </h5>
                                        ) : (
                                          <>
                                            <span className="text-danger">
                                              <br />
                                              Taken{" "}
                                              <b className="text-primary">
                                                ( ENG )
                                              </b>
                                            </span>
                                            <a
                                              href="#"
                                              className="icon-hdn"
                                              title="Remove"
                                              onClick={() => {}}
                                            >
                                              <i className="os-icon os-icon-trash-2 text-danger"></i>
                                            </a>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Subject and Teacher  */}
                        {showPeriod && (
                          <div className="element-box mt-0">
                            <LoadingState loading={nTTLoading} />
                            <AlertMessage
                              message={nTTMessage?.message}
                              failed={nTTMessage?.failed}
                            />
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();

                                await NewTimetable({
                                  variables: {
                                    model: {
                                      subject: timetableInput?.subject,
                                      current_class:
                                        timetableInput?.current_class?.id,
                                      teacher: timetableInput?.teacher,
                                      day: timetableInput?.day?.value,
                                      period: selectedPeriods.map(
                                        (sp: any) => ({
                                          id: sp.id,
                                          from: sp.from,
                                          to: sp.to,
                                        })
                                      ),
                                    },
                                  },
                                });
                                SetTimetable(true);
                              }}
                            >
                              <div className="row">
                                <div className="col-md-6">
                                  {/* Subject input */}
                                  <label>Subject</label>
                                  <Select
                                    options={subjects}
                                    onChange={(sub: any) => {
                                      SetTimetableInput({
                                        ...timetableInput,
                                        subject: sub.value,
                                      });
                                    }}
                                  />
                                  <LoadingState loading={sLoading} />
                                  <AlertMessage
                                    message={sMessage?.message}
                                    failed={sMessage?.failed}
                                  />
                                </div>
                                <div className="col-md-6">
                                  {/* Teacher input */}
                                  <label>Teacher</label>
                                  <Select
                                    options={teachers}
                                    onChange={(tchr: any) => {
                                      SetTimetableInput({
                                        ...timetableInput,
                                        teacher: tchr.value,
                                      });
                                    }}
                                  />
                                  <LoadingState loading={tLoading} />
                                  <AlertMessage
                                    message={tMessage?.message}
                                    failed={tMessage?.failed}
                                  />
                                </div>
                                <div className="col-12 mt-3">
                                  {selectedPeriods?.length > 0 && (
                                    <button
                                      className="btn btn-primary px-3"
                                      type="submit"
                                    >
                                      Set Timetable
                                    </button>
                                  )}
                                </div>
                              </div>
                            </form>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* Inputed Timetable */}
            {tTData && tTData.GetClassTimetable.docs.lenght > 0 && (
              <div className="row justify-content-center ">
                <div className="col-lg-12">
                  <div className="element-box">
                    <h5 className="element-header">Inputed Timetable</h5>
                    <div className="table-responsive">
                      <AlertMessage
                        message={tTMessage?.message}
                        failed={tTMessage?.failed}
                      />
                      <LoadingState loading={tTLoading} />
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Subject</th>
                            <th>Teacher</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tTData.GetClassTimetable.docs.map(
                            (tTable: any, index: number) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  {tTable.timetable_list?.period?.from +
                                    " - " +
                                    tTable.timetable_list?.period?.to}
                                </td>
                                <td>English Language (ENG)</td>
                                <td>Teacher Component</td>
                                <td className="row-actions text-center">
                                  <a href="#" title="Remove">
                                    <i className="os-icon os-icon-x text-danger"></i>
                                  </a>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTimetable;
