import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName } from "../context/App";
import Input from "./partials/Input";
import { IProps } from "../models/IProps";
import LoadingState from "./partials/loading";
import ImageUpload from "../pages/partials/ImageUpload";
import { useQuery } from "@apollo/react-hooks";
import { NEW_SCHOOL } from "../queries/School.query";
import { useMutation } from "@apollo/react-hooks";
import { IMessage } from "../models/IMessage";
import AlertMessage from "../pages/partials/AlertMessage";

const FirstSchool: React.FC<IProps> = ({ history }) => {
  document.body.className = "auth-wrapper";

  const [record, setRecord] = useState<any>();
  const [message, SetMessage] = useState<IMessage>();

  //   Save First School record
  const [SaveSchool, { loading }] = useMutation(NEW_SCHOOL, {
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      if (data && data.NewSchool) {
        SetMessage({
          message: data.NewSchool.message,
          failed: false
        });
        history.push("/signup");
      } else {
        SetMessage({
          message: "Could not Save School",
          failed: true
        });
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Default School | {GetAppName()}</title>
      </Helmet>
      <div className="all-wrapper menu-side with-pattern">
        <div className="auth-box-w wider">
          <div className="logo-w">
            <a href="/">
              <img alt="logo" width="80" src="logo192.png" />
            </a>
            <h6 className="mt-2">{GetAppName()}</h6>
          </div>
          <h4 className="auth-header">Create School </h4>
          <form
            onSubmit={async e => {
              e.preventDefault();
              await SaveSchool({
                variables: {
                  model: record
                }
              });
            }}
          >
            {/* Fullname input */}
            <Input
              name="fullname"
              placeholder="Enter school fullname"
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
            {/* Alias input */}
            <Input
              name="alias"
              placeholder="Enter alias"
              label="Alias"
              onChange={(alias: string) =>
                setRecord({
                  ...record,
                  alias
                })
              }
              icon="os-icon-phone"
              required={true}
              type="text"
            />

            <div className="row">
              <div className="col-sm-6">
                {/* Contact Email input */}
                <Input
                  name="email"
                  placeholder="Enter contact email"
                  label="Contact Email"
                  onChange={(contact_email: string) =>
                    setRecord({
                      ...record,
                      contact_email
                    })
                  }
                  icon="os-icon-phone"
                  required={true}
                  type="email"
                />
              </div>

              <div className="col-sm-6">
                {/* Contact Phone input */}
                <Input
                  name="phone"
                  placeholder="Enter contact"
                  label="Contact Phone number "
                  onChange={(contact_phone: string) =>
                    setRecord({
                      ...record,
                      contact_phone
                    })
                  }
                  required={true}
                  type="text"
                />
              </div>
            </div>

            {/* Contact Address */}
            <Input
              name="contact_address"
              placeholder="Enter contact address"
              label="Contact Address"
              onChange={(contact_address: string) =>
                setRecord({
                  ...record,
                  contact_address
                })
              }
              icon="os-icon-fingerprint"
              required={true}
              type="text"
            />

            {/* Address input */}
            <Input
              name="address"
              placeholder="Enter address"
              label="Address"
              onChange={(address: string) =>
                setRecord({
                  ...record,
                  address
                })
              }
              icon="os-icon-fingerprint"
              required={true}
              type="text"
            />

            <div className="row">
              <div className="col-sm-6">
                {/* Primary colour input */}
                <Input
                  name="primary_colour"
                  placeholder="Enter primary colour"
                  label="Primary Colour"
                  onChange={(primary_colour: string) =>
                    setRecord({
                      ...record,
                      primary_colour
                    })
                  }
                  icon="os-icon-fingerprint"
                  required={true}
                  type="text"
                />
              </div>
              <div className="col-sm-6">
                {/* Secondary Colour input */}
                <Input
                  name="secondary_colour"
                  placeholder="Enter secondary colour"
                  label="Secondary Colour"
                  onChange={(secondary_colour: string) =>
                    setRecord({
                      ...record,
                      secondary_colour
                    })
                  }
                  required={true}
                  type="text"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Logo</label>
              <ImageUpload
                title="Browse Logo..."
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
            <img src="/img/lloydant.png" alt="" className="logo-footer mr-2" />
            Powered by Afari
          </a>
        </div>
      </div>
    </>
  );
};
export default FirstSchool;
