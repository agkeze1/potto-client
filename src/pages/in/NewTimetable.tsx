import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import IconInput from "../partials/IconInput";
import SwitchInput from "../partials/SwitchInput";

const NewTimetable = () => {
  const [classSet, SetClassSet] = useState<boolean>(false);
  const [daySet, SetDaySet] = useState<boolean>(false);
  const [timetable, SetTimetable] = useState<boolean>(false);
  const [isBreak, SetIsBreak] = useState<boolean>(false);

  return (
    <>
      <Helmet>
        <title>New Timetable | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New Timetable</h5>

            {/* Section for Selecting Level and Class */}
            {!classSet && (
              <div className="element-box">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <form>
                      <div className="row">
                        <div className="col-md-6">
                          {/* Level input */}
                          <Dropdown
                            items={[
                              { label: "JSS1", value: "1" },
                              { label: "JSS2", value: "2" }
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
                              { label: "B", value: "2" }
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
                                SetClassSet(true);
                              }}
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
                          }}
                        >
                          <i className="os-icon os-icon-edit"></i>
                        </a>
                      </span>
                      <h6 className="element-header">Selected Level & class</h6>
                      <div>
                        <label>Level</label> - <b className="">SSI</b>
                      </div>
                      <div>
                        <label>Class</label> - <b className="">A</b>
                      </div>
                    </div>
                  </div>

                  {/* Day dropdown */}
                  <div className="col-md-8">
                    <div
                      className="element-box"
                      style={{ paddingBottom: "63px" }}
                    >
                      {/* Class Input */}
                      <Dropdown
                        items={[
                          { label: "Monday", value: "1" },
                          { label: "Tuesday", value: "2" },
                          { label: "Wednesday", value: "3" },
                          { label: "Thursday", value: "4" },
                          { label: "Friday", value: "5" }
                        ]}
                        onSelect={(day: any) => {
                          day && SetDaySet(true);
                        }}
                        label="Select day"
                      />
                    </div>
                  </div>
                </div>

                {daySet && (
                  <div className="element-box">
                    <div className="row">
                      <div className="col-md-6">
                        {/* From Time input */}
                        <div>
                          <IconInput
                            placeholder="Enter class name"
                            label="From Time"
                            icon="os-icon-user-male-circle"
                            required={true}
                            type="text"
                            onChange={(fromTime: string) => {}}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        {/* To Time input */}
                        <IconInput
                          placeholder="Enter class name"
                          label="To Time"
                          icon="os-icon-user-male-circle"
                          required={true}
                          type="text"
                          onChange={(toTime: string) => {}}
                        />
                      </div>
                      {!isBreak && (
                        <>
                          <div className="col-md-6">
                            {/* Subject input */}
                            <Dropdown
                              items={[
                                { label: "JSS1", value: "1" },
                                { label: "JSS2", value: "2" }
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
                                { label: "JSS2", value: "2" }
                              ]}
                              onSelect={() => {}}
                              label="Select Teacher"
                            />
                          </div>
                        </>
                      )}

                      <div className="col-6">
                        <SwitchInput
                          isOn={isBreak}
                          handleToggle={() => {
                            SetIsBreak(!isBreak);
                          }}
                          label="Break period?"
                        />
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-primary px-5 mt-5"
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
            {/* Inputed Timetable */}
            {timetable && (
              <div className="row justify-content-center ">
                <div className="col-lg-12 pt-5">
                  <h5 className="element-header">Inputed Timetable</h5>
                  <div className="element-box-tp">
                    <div className="table-responsive">
                      <table className="table table-padded">
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
