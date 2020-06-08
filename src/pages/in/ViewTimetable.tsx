import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import { IMessage } from "../../models/IMessage";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import Select from "react-select";

const ViewTimetable: FC<IProps> = ({ history }) => {
  const [ShowTimetable, SetShowTimetable] = useState<boolean>(false);
  const [showFilter, SetShowFilter] = useState<boolean>(true);

  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
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
  }, [activeLevel?.id]);

  // Toggle Timetable Expansion
  const ExpandTimetable = () => {
    SetShowFilter(!showFilter);

    const sideNav = document.getElementById("sideNav");
    const header = document.getElementById("header");

    //Toggle sideNav visibility
    if (sideNav) {
      if (sideNav.style.display === "none") {
        sideNav.style.display = "block";
      } else {
        sideNav.style.display = "none";
      }
    }

    // Toggle header visibility
    if (header) {
      if (header.style.display === "none") {
        header.style.display = "block";
      } else {
        header.style.display = "none";
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>View Timetable | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            {showFilter && (
              <>
                <h5 className="element-header">View Timetable</h5>
                {/* Select Level and Class Section */}
                <div className="element-box">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
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
                                label: timetableInput?.current_class?.name || (
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
                                onClick={() => {
                                  SetShowTimetable(true);
                                }}
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
              </>
            )}

            {/* Selected Level and class timetable */}
            {ShowTimetable && (
              <div className="element-box">
                <span className="element-actions">
                  <a
                    href="#"
                    title="Change Class"
                    className="m-3"
                    onClick={() => {}}
                  >
                    <i className="os-icon os-icon-edit"></i>
                  </a>
                  <a
                    href="#"
                    title="Toggle expasion"
                    onClick={() => {
                      ExpandTimetable();
                    }}
                  >
                    <i className="os-icon os-icon-maximize"></i>
                  </a>
                </span>
                <h6 className="element-header">JSS2 - A Timetable</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-lg table-v2 table-striped">
                    <thead>
                      <tr>
                        <th className="text-center"></th>
                        <th>8:00AM - 8:40AM</th>
                        <th>8:40AM - 9:20AM</th>
                        <th>9:20AM - 10:00AM</th>
                        <th>10:00AM - 11:40AM</th>
                        <th>11:40AM - 12Noon</th>
                        <th>12Noon - 12:40PM</th>
                        <th>12:40PM - 1:20PM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">
                          <b>MON</b>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mrs. Jane Agbo</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>mth</b>
                          </span>
                          <div className="smaller">Stanley Eze</div>
                        </td>
                        <td className="text-right">
                          <span className="text-uppercase text-primary">
                            <b>bio</b>
                          </span>
                          <div className="smaller">Mrs. Anthonia Aka</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mr. Lazarus Ani</div>
                        </td>
                        <td className="text-center">
                          <span className="text-uppercase text-primary">
                            <b>Break</b>
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>chem</b>
                          </span>
                          <div className="smaller">Douglas Elenu</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Int. Sc.</b>
                          </span>
                          <div className="smaller">Mr. Obieze Anthony</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <b>TUE</b>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mrs. Jane Agbo</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>mth</b>
                          </span>
                          <div className="smaller">Stanley Eze</div>
                        </td>
                        <td className="text-right">
                          <span className="text-uppercase text-primary">
                            <b>bio</b>
                          </span>
                          <div className="smaller">Mrs. Anthonia Aka</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mr. Lazarus Ani</div>
                        </td>
                        <td className="text-center">
                          <span className="text-uppercase text-primary">
                            <b>Break</b>
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>chem</b>
                          </span>
                          <div className="smaller">Douglas Elenu</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Int. Sc.</b>
                          </span>
                          <div className="smaller">Mr. Obieze Anthony</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <b>WED</b>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mrs. Jane Agbo</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>mth</b>
                          </span>
                          <div className="smaller">Stanley Eze</div>
                        </td>
                        <td className="text-right">
                          <span className="text-uppercase text-primary">
                            <b>bio</b>
                          </span>
                          <div className="smaller">Mrs. Anthonia Aka</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mr. Lazarus Ani</div>
                        </td>
                        <td className="text-center">
                          <span className="text-uppercase text-primary">
                            <b>Break</b>
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>chem</b>
                          </span>
                          <div className="smaller">Douglas Elenu</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Int. Sc.</b>
                          </span>
                          <div className="smaller">Mr. Obieze Anthony</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <b>THU</b>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mrs. Jane Agbo</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>mth</b>
                          </span>
                          <div className="smaller">Stanley Eze</div>
                        </td>
                        <td className="text-right">
                          <span className="text-uppercase text-primary">
                            <b>bio</b>
                          </span>
                          <div className="smaller">Mrs. Anthonia Aka</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mr. Lazarus Ani</div>
                        </td>
                        <td className="text-center">
                          <span className="text-uppercase text-primary">
                            <b>Break</b>
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>chem</b>
                          </span>
                          <div className="smaller">Douglas Elenu</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Int. Sc.</b>
                          </span>
                          <div className="smaller">Mr. Obieze Anthony</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          <b>FRI</b>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mrs. Jane Agbo</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>mth</b>
                          </span>
                          <div className="smaller">Stanley Eze</div>
                        </td>
                        <td className="text-right">
                          <span className="text-uppercase text-primary">
                            <b>bio</b>
                          </span>
                          <div className="smaller">Mrs. Anthonia Aka</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Eng</b>
                          </span>
                          <div className="smaller">Mr. Lazarus Ani</div>
                        </td>
                        <td className="text-center">
                          <span className="text-uppercase text-primary">
                            <b>Break</b>
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>chem</b>
                          </span>
                          <div className="smaller">Douglas Elenu</div>
                        </td>
                        <td>
                          <span className="text-uppercase text-primary">
                            <b>Int. Sc.</b>
                          </span>
                          <div className="smaller">Mr. Obieze Anthony</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTimetable;
