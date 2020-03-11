import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import { borderRadius } from "react-select/src/theme";

const NewStudent: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  const [showGuardian, SetShowGuardian] = useState<boolean>();
  return (
    <>
      <Helmet>
        <title>New Student | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New Student</h5>
            <div className="row justify-content-center element-box">
              {/* Student info */}
              {!showGuardian && (
                <div className="col-lg-10 pt-5">
                  <h5 className="element-header">Basic Information</h5>
                  {/* <form
                    onSubmit={e => {
                      e.preventDefault();
                      SetShowGuardian(true);
                    }}
                  > */}
                  <div className="row">
                    <div className="col-sm-6">
                      {/* Reg.no input */}
                      <IconInput
                        placeholder="Enter reg. number"
                        label="Registration Number"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(regNo: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* First name input */}
                      <IconInput
                        placeholder="Enter first name"
                        label="First Name"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(firstName: string) => {}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* Middle name input */}
                      <IconInput
                        placeholder="Enter middle name"
                        label="Middle Name"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(middleName: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Last name input */}
                      <IconInput
                        placeholder="Enter last name"
                        label="Last Name"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(lastName: string) => {}}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      {/* Date of Birth input */}
                      <label htmlFor="">Date of Birth</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <div className="os-icon os-icon-calendar"></div>
                          </div>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          required
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      {/* Admission Date */}
                      <label htmlFor="">Date of Adminssion</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <div className="os-icon os-icon-calendar"></div>
                          </div>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          required
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* Gender input */}
                      <Dropdown
                        items={[
                          { label: "Front Desker", value: "1" },
                          { label: "Oga", value: "2" }
                        ]}
                        onSelect={() => {}}
                        label="Gender"
                        icon="phone"
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Current Class input */}
                      <Dropdown
                        items={[
                          { label: "Front Desker", value: "1" },
                          { label: "Oga", value: "2" }
                        ]}
                        onSelect={() => {}}
                        label="Current Class"
                        icon="phone"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* State of Origin input */}
                      <Dropdown
                        items={[
                          { label: "Front Desker", value: "1" },
                          { label: "Oga", value: "2" }
                        ]}
                        onSelect={() => {}}
                        label="State of Origin"
                        icon="phone"
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* LGA input */}
                      <Dropdown
                        items={[
                          { label: "Front Desker", value: "1" },
                          { label: "Oga", value: "2" }
                        ]}
                        onSelect={() => {}}
                        label="LGA"
                        icon="phone"
                      />
                    </div>
                  </div>

                  <label>Passport</label>
                  <ImageUpload
                    title="Browse passport..."
                    onData={(path: string) =>
                      SetRecord({
                        ...record,
                        image: path
                      })
                    }
                  />
                  <div className="buttons-w mt-3 mb-5">
                    <button
                      className="btn btn-primary px-5 mt-3"
                      type="submit"
                      onClick={() => {
                        SetShowGuardian(true);
                      }}
                    >
                      Next
                      <i className="os-icon os-icon-arrow-right7 ml-2"></i>
                    </button>
                  </div>
                  {/* </form> */}
                </div>
              )}

              {/* Guardian info */}
              {showGuardian && (
                <div className="col-lg-10 pt-5">
                  <div className="row pb-4">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        SetShowGuardian(false);
                      }}
                    >
                      <i className="os-icon os-icon-arrow-left6 mr-2"></i>
                      Previous
                    </button>
                    <div className="col-12 text-center">
                      <img
                        src="/avatar.png"
                        alt=""
                        className="text-center"
                        style={{
                          borderRadius: "50%",
                          width: "100px"
                        }}
                      />
                      <h5>Douglas Elenu</h5>
                      <label>CIC20/1338</label>
                    </div>
                  </div>

                  <h5 className="element-header">Guardian Information</h5>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      history.push("/in/student-guardian");
                    }}
                  >
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
                            { label: "Front Desker", value: "1" },
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
                            { label: "Front Desker", value: "1" },
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
                            { label: "Front Desker", value: "1" },
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
                          onChange={(email: string) => {}}
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
                      onChange={(email: string) => {}}
                    />
                    <label>Passport</label>
                    <ImageUpload
                      title="Browse passport..."
                      onData={(path: string) =>
                        SetRecord({
                          ...record,
                          image: path
                        })
                      }
                    />
                    <div className="buttons-w mt-3 mb-5">
                      <button
                        className="btn btn-sm btn-secondary mt-3"
                        onClick={() => {
                          SetShowGuardian(false);
                        }}
                      >
                        <i className="os-icon os-icon-arrow-left6 mr-2"></i>
                        Previous
                      </button>
                      <button
                        className="btn btn-primary px-5 mt-3"
                        type="submit"
                      >
                        Save Student
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewStudent;
