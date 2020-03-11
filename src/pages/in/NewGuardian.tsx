import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";

const NewGuardian: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  return (
    <>
      <Helmet>
        <title>New Guardian | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New Guardian</h5>

            <div className="row justify-content-center element-box">
              <div className="col-lg-8 pt-5">
                <h5 className="element-header">Basic Information</h5>
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
                      SetRecord({
                        ...record,
                        image: path
                      })
                    }
                  />
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
                      Save Guardian
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

export default NewGuardian;
