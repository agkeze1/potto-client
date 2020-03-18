import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import SwitchInput from "../partials/SwitchInput";

const NewTeacher: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  const [isAdmin, SetIsAdmin] = useState(true);

  return (
    <>
      <Helmet>
        <title>New Teacher | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New Teacher</h5>

            <div className="row justify-content-center element-box">
              <div className="col-lg-10 pt-5">
                <h5 className="element-header">Basic Information</h5>
                <form>
                  <div className="row">
                    {/* First Name input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter first name"
                        label="First Name"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="email"
                        onChange={(firstName: string) => {}}
                      />
                    </div>
                    {/* Middle Name input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter middle name"
                        label="Middle Name"
                        icon="os-icon-phone"
                        required={true}
                        type="text"
                        onChange={(middleName: string) => {}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    {/* Last Name input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter last name"
                        label="Last Name"
                        icon="os-icon-phone"
                        required={true}
                        type="text"
                        onChange={(lastName: string) => {}}
                      />
                    </div>
                    {/* Email input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter email"
                        label="Email"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="email"
                        onChange={(email: string) => {}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    {/* Phone input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter phone number"
                        label="Phone Number"
                        icon="os-icon-phone"
                        required={true}
                        type="text"
                        onChange={(phone: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Employment Date input */}
                      <label htmlFor="">Employment Date </label>
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
                    {/* Gender input */}
                    <div className="col-sm-6">
                      <Dropdown
                        items={[
                          { label: "Male", value: "1" },
                          { label: "Female", value: "2" }
                        ]}
                        onSelect={() => {}}
                        label="Gender"
                        icon="phone"
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Date of birth input */}
                      <label htmlFor="">Date of Birth </label>
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
                  <IconInput
                    placeholder="Enter address"
                    label="Address"
                    icon="os-icon-ui-09"
                    required={true}
                    type="text"
                    onChange={(address: string) => {}}
                  />
                  <div className="row">
                    <div className="col-sm-6">
                      {/* Password input */}
                      <IconInput
                        placeholder="Enter password"
                        label="Password"
                        icon="os-icon-ui-09"
                        required={true}
                        type="password"
                        onChange={(password: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Confirm password input */}
                      <IconInput
                        placeholder="Re-enter password"
                        label="Confirm password"
                        icon="os-icon-ui-09"
                        required={true}
                        type="password"
                        onChange={(password: string) => {}}
                      />
                    </div>
                  </div>
                  <label>Passport</label>
                  <ImageUpload
                    title="Browse picture..."
                    onData={(path: string) =>
                      SetRecord({
                        ...record,
                        image: path
                      })
                    }
                  />
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTeacher;
