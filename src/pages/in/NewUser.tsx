import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import SwitchInput from "../partials/SwitchInput";

const NewUser: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  const [isAdmin, SetIsAdmin] = useState(true);

  return (
    <>
      <Helmet>
        <title>New User | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">New User</h5>

            <div className="row justify-content-center element-box">
              <div className="col-lg-8 pt-5">
                <h5 className="element-header">Basic Information</h5>
                <form>
                  {/* Fullname input */}
                  <IconInput
                    placeholder="Enter fullname"
                    label="Full Name"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(name: string) => {}}
                  />

                  <div className="row">
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
                  </div>
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
                  <div className="row">
                    <div className="col-sm-6">
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
                    </div>
                    {!isAdmin && (
                      <div className="col-sm-6">
                        <Dropdown
                          items={[
                            { label: "Front Desker", value: "1" },
                            { label: "Oga", value: "2" }
                          ]}
                          onSelect={() => {}}
                          label="Role"
                          icon="phone"
                        />
                      </div>
                    )}

                    <div className="col-sm-6">
                      <SwitchInput
                        isOn={isAdmin}
                        handleToggle={() => {
                          SetIsAdmin(!isAdmin);
                        }}
                        label="Is Admin?"
                      />
                    </div>
                  </div>
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
                      Create
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

export default NewUser;
