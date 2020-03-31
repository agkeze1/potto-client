import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import { useMutation } from "@apollo/react-hooks";
import { authService } from "../../services/Auth.Service";
import { NEW_SCHOOL } from "../../queries/School.query";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";

const NewSchool: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  const [message, SetMessage] = useState<IMessage>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const [SaveSchool, { loading }] = useMutation(NEW_SCHOOL, {
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data.NewSchool) {
        SetMessage({
          message: data.NewSchool.message,
          failed: false
        });

        // Redirect to login
        history.push("/school-list");
      }
    }
  });
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
              <div className="col-lg-10 pt-5">
                <h5 className="element-header">Basic Information</h5>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    // Reset message
                    SetMessage(undefined);

                    //Save School
                    await SaveSchool({
                      variables: {
                        model: record
                      }
                    });
                  }}
                >
                  {/* Fullname input */}
                  <IconInput
                    placeholder="Enter school name"
                    label="Full Name"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(name: string) => {
                      SetRecord({
                        ...record,
                        name
                      });
                    }}
                  />

                  {/* Alias input */}
                  <IconInput
                    placeholder="Enter school Alias"
                    label="Alias"
                    icon="os-icon-ui-09"
                    required={true}
                    type="text"
                    onChange={(alias: string) => {
                      SetRecord({
                        ...record,
                        alias
                      });
                    }}
                  />
                  {/* Address input */}
                  <IconInput
                    placeholder="Enter school address"
                    label="Address"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(address: string) => {
                      SetRecord({
                        ...record,
                        address
                      });
                    }}
                  />
                  {/* Contact Address input */}
                  <IconInput
                    placeholder="Enter contact address"
                    label="Contact Address"
                    icon="os-icon-user-male-circle"
                    required={true}
                    type="text"
                    onChange={(contactAddress: string) => {
                      SetRecord({
                        ...record,
                        contactAddress
                      });
                    }}
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
                        onChange={(contactEmail: string) => {
                          SetRecord({
                            ...record,
                            contactEmail
                          });
                        }}
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
                        onChange={(contactPhone: string) => {
                          SetRecord({
                            ...record,
                            contactPhone
                          });
                        }}
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
                        onChange={(primaryColor: string) => {
                          SetRecord({
                            ...record,
                            primaryColor
                          });
                        }}
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
                        onChange={(secondaryColor: string) => {
                          SetRecord({
                            ...record,
                            secondaryColor
                          });
                        }}
                      />
                    </div>
                  </div>
                  <label>Select School Logo</label>
                  <ImageUpload
                    title="Profile Picture"
                    onData={(path: string) =>
                      SetRecord({
                        ...record,
                        logo: path
                      })
                    }
                  />
                  <AlertMessage
                    message={message?.message}
                    failed={message?.failed}
                  />
                  <LoadingState loading={loading} />
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
