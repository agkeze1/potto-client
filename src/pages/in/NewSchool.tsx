import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";

const NewSchool: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  return (
    <>
      <Helmet>
        <title>New School | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New School</h5>

            <div className="row justify-content-center element-box">
              <div className="col-lg-8 pt-5">
                <h5 className="element-header">Basic Information</h5>
                <form>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* 
                      Ref. No input */}
                      <IconInput
                        placeholder="Enter Ref. number"
                        label="Ref. Number"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(refNo: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Alias input */}
                      <IconInput
                        placeholder="Enter school Alias"
                        label="Alias"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(alias: string) => {}}
                      />
                    </div>
                  </div>
                  {/* Fullname input */}
                  <IconInput
                    placeholder="Enter school name"
                    label="Full Name"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(name: string) => {}}
                  />
                  {/* Address input */}
                  <IconInput
                    placeholder="Enter school address"
                    label="Address"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(address: string) => {}}
                  />

                  <div className="row">
                    {/* Email input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter email"
                        label="Contact Email"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="email"
                        onChange={(email: string) => {}}
                      />
                    </div>
                    {/* Phone input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter phone number"
                        label="Contact Phone"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        onChange={(phone: string) => {}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* Primary colour picker */}
                      <IconInput
                        placeholder="Enter primary Colour"
                        label="Primary Colour"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(password: string) => {}}
                      />
                    </div>
                    <div className="col-sm-6">
                      {/* Secondary colour picker */}
                      <IconInput
                        placeholder="Enter secondary colour"
                        label="Secondary Colour"
                        icon="os-icon-ui-09"
                        required={true}
                        type="text"
                        onChange={(password: string) => {}}
                      />
                    </div>
                  </div>
                  <label>Select School Logo</label>
                  <ImageUpload
                    title="Profile Picture"
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

export default NewSchool;
