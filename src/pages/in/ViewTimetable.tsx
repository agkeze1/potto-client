import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";

const ViewTimetable: FC<IProps> = ({ history }) => {
  const [ShowTimetable, SetShowTimetable] = useState<boolean>(false);
  const [showFilter, SetShowFilter] = useState<boolean>(true);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

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
                            <Dropdown
                              items={[
                                { label: "JSS1", value: "1" },
                                { label: "JSS2", value: "2" },
                              ]}
                              onSelect={() => {}}
                              label="Select Level"
                            />
                          </div>
                          <div className="col-md-6">
                            {/* Class Input */}
                            <Dropdown
                              items={[
                                { label: "A", value: "1" },
                                { label: "B", value: "2" },
                              ]}
                              onSelect={() => {}}
                              label="Select Class"
                            />
                          </div>
                          <div className="col-12 ">
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
                <a
                  href="#"
                  className="element-actions"
                  onClick={() => {
                    ExpandTimetable();
                  }}
                >
                  <i className="os-icon os-icon-maximize"></i>
                </a>
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
