import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import { IMessage } from "../../models/IMessage";
import { authService } from "../../services/Auth.Service";
import { useMutation } from "@apollo/react-hooks";
import { NEW_TEACHER } from "../../queries/Teacher.query";
import gender from "../../data/gender.json";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import DatePicker from "react-datepicker";

const NewTeacher: FC<IProps> = ({ history }) => {
  const [record, SetRecord] = useState<any>();
  const [message, SetMessage] = useState<IMessage>();

  // For comfirm password
  const [bdrClass, SetBdrClass] = useState<string>();
  const [cPassword, SetCPassword] = useState<string>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // New Teacher Mutation
  const [NewTeacher, { loading }] = useMutation(NEW_TEACHER, {
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: () => {
      history.push("/in/teacher-list");
    },
  });

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
                <AlertMessage
                  message={message?.message}
                  failed={message?.failed}
                />
                <LoadingState loading={loading} />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    //Check password match before submitting form
                    if (cPassword && cPassword !== record?.password) {
                      SetBdrClass("bdr-danger");
                    } else {
                      // Scroll to top of page
                      scrollTop();
                      // Save New Teacher
                      NewTeacher({
                        variables: {
                          model: record,
                        },
                      });
                    }
                  }}
                >
                  <div className="row">
                    {/* First Name input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter first name"
                        label="First Name"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        onChange={(firstname: string) => {
                          SetRecord({
                            ...record,
                            firstname,
                          });
                        }}
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
                        onChange={(middlename: string) => {
                          SetRecord({
                            ...record,
                            middlename,
                          });
                        }}
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
                        onChange={(lastname: string) => {
                          SetRecord({
                            ...record,
                            lastname,
                          });
                        }}
                      />
                    </div>
                    {/* Email input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter email"
                        label="Email"
                        icon="os-icon-email-2-at2"
                        required={false}
                        type="email"
                        onChange={(email: string) => {
                          SetRecord({
                            ...record,
                            email,
                          });
                        }}
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
                        onChange={(phone: string) => {
                          SetRecord({
                            ...record,
                            phone,
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      {/* Employment Date input */}
                      <label htmlFor="">Employment Date </label>
                      <br />
                      <DatePicker
                        placeholderText="day, month year"
                        selected={record?.employmentDate}
                        onChange={(date) =>
                          SetRecord({
                            ...record,
                            employmentDate: date,
                          })
                        }
                        className="form-control"
                        dateFormat="d, MMMM yyyy"
                      />
                    </div>
                  </div>
                  <div className="row">
                    {/* Gender input */}
                    <div className="col-sm-6">
                      <Dropdown
                        items={gender.gender}
                        onSelect={(item: any) => {
                          SetRecord({
                            ...record,
                            gender: item.label,
                          });
                        }}
                        label="Gender"
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      {/* Date of Birth input */}
                      <label htmlFor="">Date of Birth </label>
                      <br />
                      <DatePicker
                        placeholderText="Sday, month year"
                        selected={record?.dob}
                        onChange={(date) =>
                          SetRecord({
                            ...record,
                            dob: date,
                          })
                        }
                        className="form-control"
                        dateFormat="d, MMMM yyyy"
                      />
                    </div>
                  </div>
                  {/* Address Input */}
                  <IconInput
                    placeholder="Enter address"
                    label="Address"
                    icon="os-icon-ui-09"
                    required={true}
                    type="text"
                    onChange={(address: string) => {
                      SetRecord({
                        ...record,
                        address,
                      });
                    }}
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
                        onChange={(password: string) => {
                          SetRecord({
                            ...record,
                            password,
                          });
                        }}
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
                        classStyle={bdrClass}
                        onChange={(cPass: string) => {
                          SetCPassword(cPass);
                          if (cPass !== record?.password) {
                            SetBdrClass("bdr-danger");
                          } else {
                            SetBdrClass("");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <label>Passport</label>
                  <ImageUpload
                    title="Browse picture..."
                    onData={(path: string) =>
                      SetRecord({
                        ...record,
                        image: path,
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
