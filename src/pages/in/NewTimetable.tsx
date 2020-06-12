/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, getTimetable } from "../../context/App";
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
  REMOVE_TIMETABLE,
} from "../../queries/Timetable.query";
import LevelClass from "./partials/LevelClass";

const NewTimetable: FC<IProps> = ({ history }) => {
  const [classSet, SetClassSet] = useState<boolean>(false);
  const [daySet, SetDaySet] = useState<boolean>(false);
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

  // Fetch List of Periods under a class
  const [
    GetPeriods,
    { loading: pLoading, refetch: refetchPeriods },
  ] = useLazyQuery(GET_DAY_PERIODS, {
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
        GetTimetable({
          variables: {
            _class: timetableInput?.current_class?.id,
          },
        });
      }
    },
  });

  // Gets list of timetable
  const [
    GetTimetable,
    { loading: tTLoading, data: tTData, refetch: refetchTimetable },
  ] = useLazyQuery(GET_CLASS_TIMETABLE, {
    fetchPolicy: "network-only",
    onError: (err) =>
      SetTTMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Delete a particular timetable
  const [RemoveTimetable, { loading: rTLoading }] = useMutation(
    REMOVE_TIMETABLE,
    {
      onCompleted: () => {
        refetchPeriods();
        refetchTimetable({
          variables: {
            _class: timetableInput?.current_class?.id,
          },
        });
      },
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
                        <LevelClass
                          schoolId={school.id}
                          onLevelChange={(level: any) => {
                            SetActiveLevel({
                              name: level?.label,
                              id: level?.value,
                            });
                            SetTimetableInput({
                              ...timetableInput,
                              current_class: undefined,
                            });
                            GetSubjects();
                          }}
                          onClassChange={(_class: any) => {
                            SetTimetableInput({
                              ...timetableInput,
                              current_class: {
                                name: _class.label,
                                id: _class.value,
                              },
                            });
                          }}
                          onSubmit={() => {
                            if (timetableInput?.current_class)
                              SetClassSet(true);
                          }}
                        />
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
                                                {getTimetable(
                                                  timetableInput.day.value,
                                                  prd,
                                                  tTData
                                                    ? tTData.GetClassTimetable
                                                        .docs
                                                    : [],
                                                  function (item: any) {
                                                    return item ? (
                                                      <span>
                                                        ({item.subject.code})
                                                      </span>
                                                    ) : (
                                                      "No Subject"
                                                    );
                                                  }
                                                )}
                                              </b>
                                            </span>
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
            {tTData?.GetClassTimetable.docs &&
              tTData.GetClassTimetable.docs.find(
                (item: any) => item.day === timetableInput?.day?.value
              ) && (
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box">
                      <h5 className="element-header">Inputed Timetable</h5>
                      <div className="table-responsive">
                        <AlertMessage
                          message={tTMessage?.message}
                          failed={tTMessage?.failed}
                        />
                        <LoadingState loading={tTLoading || rTLoading} />
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Period</th>
                              <th>Subject</th>
                              <th>Teacher</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tTData.GetClassTimetable.docs
                              .find(
                                (item: any) =>
                                  item.day === timetableInput?.day?.value
                              )
                              .timetable_list.map(
                                (tTable: any, idx: number) => (
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                      <strong>
                                        {new Date(
                                          tTable.period?.from
                                        ).toLocaleTimeString() +
                                          " - " +
                                          new Date(
                                            tTable.period?.to
                                          ).toLocaleTimeString()}
                                      </strong>
                                      <span className="badge badge-primary ml-2">
                                        {tTable.period?.total}
                                      </span>
                                    </td>
                                    <td>
                                      {tTable.subject?.title + " "} (
                                      {tTable.subject?.code})
                                    </td>
                                    <td>{tTable.teacher?.name}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        href="javascript:void(0)"
                                        title="Remove"
                                        onClick={() => {
                                          RemoveTimetable({
                                            variables: {
                                              id: tTable.id,
                                            },
                                          });
                                        }}
                                      >
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
