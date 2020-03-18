import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";
import Dropdown from "../partials/Dropdown";
import SwitchInput from "../partials/SwitchInput";
import AttAccordion from "../partials/AttAccordion";
import ImageUpload from "../partials/ImageUpload";
import IconInput from "../partials/IconInput";

const StudentList = () => {
  const [imageRecord, SetImageRecord] = useState<any>();

  const [showFilter, SetShowFilter] = useState<boolean>(true);
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [showNewGuardian, SetNewGuardian] = useState<boolean>(false);

  return (
    <>
      <Helmet>
        <title>Student List | {GetAppName()}</title>
      </Helmet>
      {!showProfile && (
        <div className="content-box">
          <div className="element-wrapper">
            <span className="element-actions mt-n2">
              <button
                className="btn btn-primary btn-sm"
                data-target="#exampleModal1"
                id="#newMax"
                data-toggle="modal"
                type="button"
              >
                <i className="os-icon os-icon-ui-22"></i>
                <span>Create New</span>
              </button>
            </span>
            <h5 className="element-header">Student List</h5>
            {showFilter && (
              <div className="element-box">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <span
                      className="element-actions"
                      style={{ marginTop: "-1.5rem" }}
                    >
                      <SwitchInput
                        isOn={showFilter}
                        handleToggle={() => {
                          SetShowFilter(false);
                        }}
                        label="Show Filter"
                      />
                    </span>
                    <h5 className="element-header">Filter Student</h5>
                  </div>
                  <div className="col-lg-4">
                    <label htmlFor="">Search by Reg. no</label>

                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <div className="os-icon os-icon-search"></div>
                        </div>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Enter student reg.no"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <Dropdown
                      items={[
                        { label: "JSS1", value: "1" },
                        { label: "JSS2", value: "2" }
                      ]}
                      onSelect={() => {}}
                      label="Level"
                      icon="phone"
                    />
                  </div>
                  <div className="col-lg-4">
                    <Dropdown
                      items={[
                        { label: "A", value: "1" },
                        { label: "B", value: "2" }
                      ]}
                      onSelect={() => {}}
                      label="Class"
                      icon="phone"
                    />
                  </div>
                  <div className="col-lg-12">
                    <button className="btn btn-primary float-right">
                      Search record
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="row justify-content-center ">
              <div className="col-lg-12 pt-5">
                {!showFilter && (
                  <span
                    className="element-actions mb-5"
                    style={{ marginTop: "-3rem" }}
                  >
                    <SwitchInput
                      isOn={showFilter}
                      handleToggle={() => {
                        SetShowFilter(true);
                      }}
                      label="Show Filter"
                    />
                  </span>
                )}

                <div className="element-box-tp">
                  <div className="table-responsive">
                    <table className="table table-padded">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Fullname</th>
                          <th>Gender</th>
                          <th>Level</th>
                          <th>Class</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                            <div
                              className="user-with-avatar clickable"
                              data-target="#imageModal"
                              data-toggle="modal"
                            >
                              <img src="/logo192.png" alt="" />
                            </div>
                          </td>
                          <td>
                            Douglas Aniekwu
                            <br />
                            <label className="text-info">CIC20/1344</label>
                          </td>
                          <td>Male</td>
                          <td>SS1</td>
                          <td>C</td>
                          <td className="row-actions text-center">
                            <a
                              href="#"
                              title="View more"
                              onClick={() => {
                                SetShowProfile(true);
                              }}
                            >
                              <i className="os-icon os-icon-eye"></i>
                            </a>
                            <a href="#" title="Edit">
                              <i className="os-icon os-icon-edit"></i>
                            </a>
                            <a className="danger" href="#" title="Delete">
                              <i className="os-icon os-icon-ui-15"></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            <div
                              className="user-with-avatar clickable"
                              data-target="#imageModal"
                              data-toggle="modal"
                            >
                              <img src="/logo192.png" alt="" />
                            </div>
                          </td>
                          <td>
                            Odogwu Jakata
                            <br />
                            <label className="text-info">CIC20/2140</label>
                          </td>
                          <td>Female</td>
                          <td>SS2</td>
                          <td>B</td>
                          <td className="row-actions text-center">
                            <a
                              href="#"
                              title="View more"
                              onClick={() => {
                                SetShowProfile(true);
                              }}
                            >
                              <i className="os-icon os-icon-eye"></i>
                            </a>
                            <a href="#" title="Edit">
                              <i className="os-icon os-icon-edit"></i>
                            </a>
                            <a className="danger" href="#" title="Delete">
                              <i className="os-icon os-icon-ui-15"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="text-center pt-5 fade-in">
                    <h2 className="text-danger">No User found!</h2>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        // profile
        <div>
          <div className="content-box">
            <div className="element-wrapper">
              <h5 className="element-header">Student Profile</h5>
              <div className="element-box ">
                <div className="text-left">
                  <NavLink
                    to="#"
                    onClick={() => {
                      SetShowProfile(false);
                    }}
                  >
                    <i
                      className="icon-lg os-icon os-icon-arrow-left6"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </NavLink>
                </div>
                <div className="text-right">
                  <NavLink to="#">
                    <i className="icon-lg os-icon os-icon-edit"></i>
                  </NavLink>
                </div>
                <div className="text-center">
                  <img
                    className="avatar mb-3"
                    alt="Passport"
                    src="/3.jpeg"
                    style={{
                      width: "150px",
                      height: "150px"
                    }}
                  />

                  <h2 className="up-header ">Douglas Elenu</h2>
                  <h6 className="up-sub-header text-uppercase">CIC20/1244</h6>
                </div>

                <div className="os-tabs-w">
                  <div className="os-tabs-controls">
                    <ul className="nav nav-tabs smaller">
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link active"
                          data-toggle="tab"
                          href="#basic-info"
                        >
                          Basic Info
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#subjects"
                        >
                          Subjects
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#guardians"
                        >
                          Guardians
                        </a>
                      </li>
                      <li className="nav-item text-uppercase">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#attendance"
                        >
                          Attendance
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content">
                    {/* Basic Information */}
                    <div className="tab-pane active" id="basic-info">
                      <div className="text-center element-box no-bg no-shadow">
                        <ul className="pro-details">
                          <li>
                            <span>Gender</span> | <b>Male</b>
                          </li>
                          <li>
                            <span>Date of Birth</span> | <b>8th May 2001 </b>
                            <i>(20yrs)</i>
                          </li>
                          <li>
                            <span>Date of Admission</span> |{" "}
                            <b>12th April 2017</b>
                          </li>
                          <li>
                            <span>Level</span> | <b>SS1</b>
                          </li>
                          <li>
                            <span>Class</span> | <b>A</b>
                          </li>
                          <li>
                            <span>State of Origin</span> | <b>Abia</b>
                          </li>
                          <li>
                            <span>LGA</span> | <b>Isikwu-ato</b>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Selected Subject */}
                    <div className="tab-pane" id="subjects">
                      <div className="text-center element-box no-bg no-shadow">
                        <div className="text-right">
                          {/* General subjects */}
                          {/* <label
                              className="btn btn-sm btn-secondary"
                              style={{ padding: "4px 5px" }}
                            >
                              General
                            </label> */}
                          {/* Selected subjects */}
                          <label className="badge badge-success-inverted">
                            Selected
                          </label>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Title</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>INT</td>
                                <td>Intro tech</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>ENG</td>
                                <td>English language</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>MTH</td>
                                <td>Mathematics</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Guardians List*/}
                    <div className="tab-pane" id="guardians">
                      {!showNewGuardian && (
                        <div>
                          <div className="element-actions">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SetNewGuardian(true);
                              }}
                            >
                              <i className="os-icon os-icon-plus-circle mr-2"></i>
                              New
                            </button>
                          </div>
                          <div className="text-center ">
                            <div className="row">
                              <div className="col-sm-3">
                                <div className="element-box no-bg">
                                  <img
                                    className="avatar"
                                    src="/3.jpeg"
                                    alt=""
                                    style={{ width: "80%" }}
                                  />
                                  <hr />
                                  <a
                                    href="#"
                                    data-dismiss="modal"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    Douglas King
                                  </a>
                                </div>
                              </div>
                              <div className="col-sm-3">
                                <div className="element-box no-bg">
                                  <img
                                    className="avatar"
                                    src="/avatar.png"
                                    alt=""
                                    style={{ width: "80%" }}
                                  />
                                  <hr />
                                  <a
                                    href="#"
                                    data-dismiss="modal"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    Mrs Anita Loveth
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* New Guardian  */}
                      {showNewGuardian && (
                        <div className="content-i">
                          <div className="content-box">
                            <div className="element-wrapper">
                              <h5 className="element-header">New Guardian</h5>

                              <div className="row justify-content-center element-box no-bg no-shadow">
                                <div className="col-lg-10 pt-5">
                                  <h5 className="element-header">
                                    Basic Information
                                  </h5>
                                  <form onSubmit={e => {}}>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* Title input */}
                                        <Dropdown
                                          items={[
                                            { label: "Mr", value: "1" },
                                            { label: "Mrs", value: "2" },
                                            { label: "Sergeant", value: "2" }
                                          ]}
                                          onSelect={() => {}}
                                          label="Title"
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* Relationship input */}
                                        <Dropdown
                                          items={[
                                            { label: "Father", value: "1" },
                                            { label: "Mother", value: "2" }
                                          ]}
                                          onSelect={() => {}}
                                          label="Relationship"
                                          icon="phone"
                                        />
                                      </div>
                                    </div>
                                    {/* Full name input */}
                                    <IconInput
                                      placeholder="Enter full name"
                                      label="Full Name"
                                      icon="os-icon-ui-09"
                                      required={true}
                                      type="text"
                                      onChange={(fullname: string) => {}}
                                    />
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* Phone number input */}
                                        <IconInput
                                          placeholder="Enter phone number"
                                          label="Phone Number"
                                          icon="os-icon-ui-09"
                                          required={true}
                                          type="text"
                                          onChange={(phone: string) => {}}
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* Email input */}
                                        <IconInput
                                          placeholder="Enter email"
                                          label="Email"
                                          icon="os-icon-ui-09"
                                          required={true}
                                          type="text"
                                          onChange={(email: string) => {}}
                                        />
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* Gender input */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1"
                                            },
                                            { label: "Oga", value: "2" }
                                          ]}
                                          onSelect={() => {}}
                                          label="Gender"
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* State of Origin input */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1"
                                            },
                                            { label: "Oga", value: "2" }
                                          ]}
                                          onSelect={() => {}}
                                          label="State of Origin"
                                          icon="phone"
                                        />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        {/* LGA */}
                                        <Dropdown
                                          items={[
                                            {
                                              label: "Front Desker",
                                              value: "1"
                                            },
                                            { label: "Oga", value: "2" }
                                          ]}
                                          onSelect={() => {}}
                                          label="LGA"
                                          icon="phone"
                                        />
                                      </div>
                                      <div className="col-sm-6">
                                        {/* Hometown input */}
                                        <IconInput
                                          placeholder="Enter Hometown"
                                          label="Hometown"
                                          icon="os-icon-ui-09"
                                          required={true}
                                          type="text"
                                          onChange={(hometown: string) => {}}
                                        />
                                      </div>
                                    </div>
                                    {/* Address input */}
                                    <IconInput
                                      placeholder="Enter address"
                                      label="Address"
                                      icon="os-icon-ui-09"
                                      required={true}
                                      type="text"
                                      onChange={(address: string) => {}}
                                    />
                                    <label>Passport</label>
                                    <ImageUpload
                                      title="Browse passport..."
                                      onData={(path: string) =>
                                        SetImageRecord({
                                          ...imageRecord,
                                          image: path
                                        })
                                      }
                                    />
                                    <div className="buttons-w mt-3 mb-5">
                                      <button
                                        onClick={() => {
                                          SetNewGuardian(false);
                                        }}
                                        className="btn btn-secondary px-5 mt-3"
                                        type="submit"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="btn btn-primary px-5 mt-3"
                                        type="submit"
                                      >
                                        Save Guardian
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accordion for student attendance */}
                    <div className="tab-pane" id="attendance">
                      <div className="os-tabs-w">
                        <div className="os-tabs-controls">
                          {/* Tab header */}
                          <ul className="nav nav-tabs ">
                            <li className="nav-item">
                              <a
                                className="nav-link active"
                                data-toggle="tab"
                                href="#schoolAtt"
                              >
                                School Att.
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                data-toggle="tab"
                                href="#classAtt"
                              >
                                Class Att.
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                data-toggle="tab"
                                href="#subjectAtt"
                              >
                                Subjects Att.
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div className="tab-content">
                          {/* School Attendance */}
                          <div className="tab-pane active" id="schoolAtt">
                            <div className="text-center element-box no-bg no-shadow">
                              <div className="table-responsive">
                                <table className="table table-striped">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Date</th>
                                      <th>In</th>
                                      <th>Out</th>
                                      <th>Device</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>21st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>29st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-danger-inverted">
                                          Absent
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>6th Feb. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Class Attendance */}
                          <div className="tab-pane" id="classAtt">
                            <div className="text-center element-box no-bg no-shadow">
                              <div className="table-responsive">
                                <table className="table table-striped">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                      <th>Device</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>21st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-success-inverted">
                                          Attended
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>29st Jan. 2020</td>
                                      <td>
                                        <label className="badge badge-danger-inverted">
                                          Absent
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>6th Feb. 2020</td>
                                      <td>
                                        <label className="badge badge-warning-inverted">
                                          Exempted
                                        </label>
                                      </td>
                                      <td>Device Component</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Subject Attendance */}
                          <div className="tab-pane" id="subjectAtt">
                            <h5 className="element-header">Monday</h5>
                            <AttAccordion />

                            <h5 className="element-header">Tuesday</h5>
                            <AttAccordion />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal for Image */}
      <ImageModal />
    </>
  );
};

export default StudentList;
