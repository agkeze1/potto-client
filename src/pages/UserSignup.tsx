import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName } from "../context/App";
import Input from "./partials/Input";
import Dropdown from "./partials/Dropdown";
import { IProps } from "../models/IProps";
import LoadingState from "./partials/loading";
import { NavLink } from "react-router-dom";
// import DepartmentListControl from "../partial/DepartmentListControl";
import ImageUpload from "../pages/partials/ImageUpload";
// import { CREATE_STUDENT } from "../queries/student.query";
// import { useMutation } from "@apollo/react-hooks";
import { IMessage } from "../models/IMessage";
// import { authService } from "../services/Auth.Service";
import AlertMessage from "../pages/partials/AlertMessage";

const UserSignup: React.FC<IProps> = ({ location, history }) => {
  document.body.className = "auth-wrapper";

  const [record, setRecord] = useState<any>();
  const [msg, SetMessage] = useState<IMessage>();

  //   const [newStudent, { loading }] = useMutation(CREATE_STUDENT, {
  //     onError: err =>
  //       SetMessage({
  //         message: err.message,
  //         failed: true
  //       }),
  //     onCompleted: data => {
  //       if (data.CreateStudent) {
  //         SetMessage({
  //           message: data.CreateStudent.message,
  //           failed: false
  //         });

  //         // login here
  //         const { doc, token } = data.CreateStudent;
  //         authService.Login(doc, token);
  //       }
  //     }
  //   });

  return (
    <>
      <Helmet>
        <title>Super Admin Account | {GetAppName()}</title>
      </Helmet>
      <div className="all-wrapper menu-side with-pattern">
        <div className="auth-box-w wider">
          <div className="logo-w">
            <a href="/">
              <img alt="logo" width="80" src="logo192.png" />
            </a>
            <h6 className="mt-2">{GetAppName()}</h6>
          </div>
          <h4 className="auth-header">Create Super Admin </h4>
          <form>
            {/* Fullname input */}
            <Input
              name="fullname"
              placeholder="Enter fullname"
              label="Name"
              onChange={(name: string) =>
                setRecord({
                  ...record,
                  name
                })
              }
              icon="os-icon-user-male-circle"
              required
              type="text"
            />

            <div className="row">
              <div className="col-sm-6">
                {/* Email input */}
                <Input
                  name="phone"
                  placeholder="Enter phone number"
                  label="Phone number "
                  onChange={(phone: string) =>
                    setRecord({
                      ...record,
                      phone
                    })
                  }
                  icon="os-icon-phone"
                  required={true}
                  type="text"
                />
              </div>

              <div className="col-sm-6">
                {/* Phone number input */}
                <Input
                  name="email"
                  placeholder="Enter email"
                  label="Email"
                  onChange={(email: string) =>
                    setRecord({
                      ...record,
                      email
                    })
                  }
                  required={true}
                  type="email"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                {/* password input */}
                <Input
                  name="password"
                  placeholder="Enter password"
                  label="Password"
                  onChange={(password: string) =>
                    setRecord({
                      ...record,
                      password
                    })
                  }
                  icon="os-icon-fingerprint"
                  required={true}
                  type="password"
                />
              </div>
              <div className="col-sm-6">
                {/* confirm password input */}
                <Input
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  label="Confirm Password"
                  onChange={(password: string) =>
                    setRecord({
                      ...record,
                      password
                    })
                  }
                  required={true}
                  type="password"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Passport</label>
              <ImageUpload
                title="Browse Picture..."
                onData={(path: string) =>
                  setRecord({
                    ...record,
                    image: path
                  })
                }
              />
              <div className="pre-icon os-icon os-icon-documents-07"></div>
            </div>
            <div className="row">
              <div className="col-12">
                {/* <LoadingState loading={loading} /> */}
                <AlertMessage message={msg?.message} failed={msg?.failed} />
              </div>
            </div>
            <div className="buttons-w">
              <button className="btn btn-primary px-4">Create</button>
            </div>
          </form>
          <a
            className="text-center footer font-sm pb-3"
            href="http://afari.com"
          >
            <img src="/img/lloydant.png" alt="" className="logo-footer mr-2" />
            Powered by Afari
          </a>
        </div>
      </div>
    </>
  );
};
export default UserSignup;
