import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName } from "../context/App";
import Input from "./partials/Input";
import { IProps } from "../models/IProps";
import LoadingState from "./partials/loading";
import ImageUpload from "../pages/partials/ImageUpload";
import { useQuery } from "@apollo/react-hooks";
import { FIRST_USER, USER_SETUP } from "../queries/User.query";
import { useMutation } from "@apollo/react-hooks";
import { IMessage } from "../models/IMessage";
import { authService } from "../services/Auth.Service";
import AlertMessage from "../pages/partials/AlertMessage";

const UserSignup: React.FC<IProps> = ({ location, history }) => {
  document.body.className = "auth-wrapper";

  const [record, setRecord] = useState<any>();
  const [message, SetMessage] = useState<IMessage>();

  // Checks if first User already exists
  const { data: uData } = useQuery(FIRST_USER, {
    onCompleted: () => {
      if (uData && uData.FirstSetup) history.push("/login");
    }
  });

  const [SaveUser, { loading }] = useMutation(USER_SETUP, {
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data && data.SetUp) {
        SetMessage({
          message: data.SetUp.message,
          failed: false
        });

        // Login user
        const { doc, token } = data.SetUp;
        authService.Login(doc, token);
      }
    }
  });

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
          <form
            onSubmit={async e => {
              e.preventDefault();
              await SaveUser({
                variables: {
                  model: record
                }
              });
              if (authService.IsAuthenticated()) {
                history.push("/in");
              } else {
                SetMessage({
                  message: "Failed to login",
                  failed: true
                });
              }
            }}
          >
            {/* Fullname input */}
            <Input
              name="fullname"
              placeholder="Enter fullname"
              label="Fullname"
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
                {/* Phone input */}
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
                {/* Email number input */}
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
                  onChange={(password: string) => {
                    // setRecord({
                    //   ...record,
                    //   password
                    // });
                  }}
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
                <LoadingState loading={loading} />
                <AlertMessage
                  message={message?.message}
                  failed={message?.failed}
                />
              </div>
            </div>
            <div className="buttons-w">
              <button className="btn btn-primary px-4" type="submit">
                Create
              </button>
            </div>
          </form>
          <a
            className="text-center footer font-sm pb-3"
            href="http://afari.com"
          >
            <img src="/avatar.png" alt="" className="logo-footer mr-2" />
            Powered by Afari
          </a>
        </div>
      </div>
    </>
  );
};
export default UserSignup;
