import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import IconInput from "../partials/IconInput";
import SwitchInput from "../partials/SwitchInput";
import { IProps } from "../../models/IProps";
import DatePicker from "react-datepicker";
import { authService } from "../../services/Auth.Service";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { IMessage } from "../../models/IMessage";
import { GET_CLASSES } from "../../queries/Class.query";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import Select from "react-select";
import days from "../../data/days.json";
import { GET_PERIODS } from "../../queries/Period.query";

const NewTimetable: FC<IProps> = ({ history }) => {
  const [classSet, SetClassSet] = useState<boolean>(false);
  const [daySet, SetDaySet] = useState<boolean>(false);
  const [timetable, SetTimetable] = useState<boolean>(false);
  const [hideFilter, SetHideFilter] = useState<boolean>(false);
  const [showDay, SetShowDay] = useState<boolean>(true);
  const [showPeriod, SetShowPeriod] = useState<boolean>(true);

  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [timetableInput, SetTimetableInput] = useState<any>();

  // Period
  const [periods, SetPeriods] = useState<Array<string>>([]);
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
    if (timetableInput?.level?.id) {
      SetClasses(undefined);
      GetClasses({ variables: { level: timetableInput?.level?.id } });
    }
  }, [timetableInput?.level?.id]);

  // Fetch List of Periods
  const { loading: pLoading, data: pData } = useQuery(GET_PERIODS, {
    onError: (err) =>
      SetPMessage({
        message: err.message,
        failed: true,
      }),
  });

  const PeriodSelected = (id: string) => {
    return periods.includes(id);
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
                            if (timetableInput?._class) SetClassSet(true);
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
                                    _class: undefined,
                                    level: {
                                      name: item.label,
                                      id: item.value,
                                    },
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
                                  label: timetableInput?._class?.name || (
                                    <span className="text-gray">Select...</span>
                                  ),
                                  value: timetableInput?._class?.id,
                                }}
                                onChange={(item: any) => {
                                  SetTimetableInput({
                                    ...timetableInput,
                                    level: undefined,
                                    _class: {
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

                {/* Section for selecting day and displaying selected Level and Class */}
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
                                  {timetableInput?._class?.name}
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
                                label: timetableInput?.day || (
                                  <span className="text-gray">Select...</span>
                                ),
                                value: timetableInput?.day,
                              }}
                              onChange={(day: any) => {
                                SetTimetableInput({
                                  ...timetableInput,
                                  day: day.label,
                                });
                                SetDaySet(true);
                              }}
                              label="Select day"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {daySet && (
                      <>
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
                          <h6
                            className={`element-header ${
                              !showPeriod ? "mb-0" : ""
                            }`}
                          >
                            Period Selection
                          </h6>
                          <AlertMessage
                            message={pMessage?.message}
                            failed={pMessage?.failed}
                          />
                          <LoadingState loading={pLoading} />
                          {showPeriod &&
                            pData &&
                            pData.GetSchoolPeriodList.docs && (
                              <>
                                <div className="row">
                                  {pData.GetSchoolPeriodList.docs.map(
                                    (prd: any, index: number) => (
                                      <>
                                        <div
                                          className={`col-sm-3 p-3 text-center ${
                                            PeriodSelected(prd.id)
                                              ? "std-period"
                                              : "period"
                                          }`}
                                          style={{
                                            border: "1px solid lightgray",
                                          }}
                                          onClick={() => {
                                            const index = periods.findIndex(
                                              (i: any) => i === prd.id
                                            );
                                            if (index !== -1) {
                                              const newPrds = [...periods];
                                              newPrds.splice(index, 1);
                                              SetPeriods(newPrds);
                                            } else {
                                              const newPrds = [...periods];
                                              newPrds.unshift(prd.id);
                                              SetPeriods(newPrds);
                                            }
                                          }}
                                        >
                                          <label className="mb-0">
                                            8:00AM - 8:40AM
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
                                        {(prd.break || prd.taken) && (
                                          <div
                                            className="col-sm-3 p-3 text-center tkn-period"
                                            style={{
                                              border: "1px solid lightgray",
                                            }}
                                          >
                                            <label className="mb-0">
                                              8:00AM - 8:40AM
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
                                    )
                                  )}

                                  {/* Remove this div */}
                                  <div
                                    className="col-sm-3 p-3 text-center tkn-period"
                                    style={{
                                      border: "1px solid lightgray",
                                    }}
                                  >
                                    <label className="mb-0">
                                      8:00AM - 8:40AM
                                    </label>
                                    <span className="text-danger">
                                      <br />
                                      Taken{" "}
                                      <b className="text-primary">( ENG )</b>
                                    </span>
                                    <a
                                      href="#"
                                      className="icon-hdn"
                                      title="Remove"
                                      onClick={() => {}}
                                    >
                                      <i className="os-icon os-icon-trash-2 text-danger"></i>
                                    </a>
                                  </div>
                                </div>
                              </>
                            )}
                        </div>

                        {/* Subject and Teacher  */}
                        {showPeriod && (
                          <div className="element-box mt-0">
                            <div className="row">
                              <div className="col-md-6">
                                {/* Subject input */}
                                <Dropdown
                                  items={[
                                    { label: "JSS1", value: "1" },
                                    { label: "JSS2", value: "2" },
                                  ]}
                                  onSelect={() => {}}
                                  label="Select Subject"
                                />
                              </div>
                              <div className="col-md-6">
                                {/* Teacher input */}
                                <Dropdown
                                  items={[
                                    { label: "JSS1", value: "1" },
                                    { label: "JSS2", value: "2" },
                                  ]}
                                  onSelect={() => {}}
                                  label="Select Teacher"
                                />
                              </div>

                              <div className="col-12">
                                <button
                                  className="btn btn-primary px-5"
                                  onClick={() => {
                                    SetTimetable(true);
                                  }}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* Inputed Timetable */}
            {timetable && (
              <div className="row justify-content-center ">
                <div className="col-lg-12">
                  <div className="element-box">
                    <h5 className="element-header">Inputed Timetable</h5>
                    <div className="table-responsive">
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
                          <tr>
                            <td>1</td>
                            <td>8:30AM - 9:20AM</td>
                            <td>English Language (ENG)</td>
                            <td>Teacher Component</td>
                            <td className="row-actions text-center">
                              <a href="#" title="Remove">
                                <i className="os-icon os-icon-x text-danger"></i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>9:20AM - 10:00AM</td>
                            <td>Mathematics (MTH)</td>
                            <td>Teacher Component</td>
                            <td className="row-actions text-center">
                              <a href="#" title="Remove">
                                <i className="os-icon os-icon-x text-danger"></i>
                              </a>
                            </td>
                          </tr>
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
