import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Select from "react-select";
import IconInput from "../partials/IconInput";
import { authService } from "../../services/Auth.Service";
import { NEW_ROLE, GET_ROLES } from "../../queries/Role.query";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import { IProps } from "../../models/IProps";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";

const Role: FC<IProps> = ({ history }) => {
  const [newRole, SetNewRole] = useState<any>({});
  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Create New Role
  const [NewRole, { loading }] = useMutation(NEW_ROLE, {
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetMessage({
        message: data.NewRole.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_ROLES,
      });

      q.GetRoles.docs.unshift(data.NewRole.doc);

      //update
      cache.writeQuery({
        query: GET_ROLES,
        data: { GetRoles: q.GetRoles },
      });
    },
  });

  const { loading: lLoading, data: lData } = useQuery(GET_ROLES, {
    onError: (err) =>
      SetLMessage({
        message: err.message,
        failed: true,
      }),
  });

  return (
    <>
      <Helmet>
        <title>Role | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <h5 className="element-header">Role</h5>
                <div className="element-box">
                  <div className="row justify-content-center">
                    <div className="col-lg-12"></div>
                    <div className="col-lg-12">
                      <AlertMessage
                        message={message?.message}
                        failed={message?.failed}
                      />
                      <LoadingState loading={loading} />
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          SetMessage(undefined);
                          await NewRole({
                            variables: {
                              name: newRole?.name,
                              desc: newRole?.desc,
                            },
                          });
                        }}
                      >
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <IconInput
                              placeholder="Enter Role name"
                              label="Name"
                              icon="os-icon-phone"
                              required={true}
                              type="text"
                              onChange={(name: string) => {
                                SetNewRole({
                                  ...newRole,
                                  name,
                                });
                              }}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label> Description </label>
                              <textarea
                                className="form-control"
                                placeholder="Enter description"
                                onChange={({ currentTarget }) => {
                                  SetNewRole({
                                    ...newRole,
                                    desc: currentTarget.value,
                                  });
                                }}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-primary" type="submit">
                          Save New
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Role List */}
                <div className="row justify-content-center ">
                  <div className="col-lg-12 mt-5">
                    <LoadingState loading={lLoading} />
                    <AlertMessage
                      message={lMessage?.message}
                      failed={lMessage?.failed}
                    />
                    {lData && (
                      <div className="element-box-tp">
                        <div className="table-responsive">
                          <table className="table table-padded">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lData.GetRoles.docs.map(
                                (role: any, index: number) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>
                                    <td>{role.desc}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        className="danger"
                                        href="#"
                                        title="Delete"
                                      >
                                        <i className="os-icon os-icon-ui-15"></i>
                                      </a>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Navigation Group found!</h2>
                      </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Role;
