import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { GET_LEVELS, NEW_LEVEL } from "../../queries/Level.query";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";

const Level: FC<IProps> = ({ history }) => {
  const [level, SetLevel] = useState<any>();
  const [message, SetMessage] = useState<IMessage>();
  const [nMessage, SetNMessage] = useState<IMessage>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School ID from logged in user
  const { school } = authService.GetUser();

  // Get list of Levels
  const { data, loading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      })
  });

  // Save New Level
  const [NewLevel, { loading: nLoading }] = useMutation(NEW_LEVEL, {
    onError: err =>
      SetNMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data =>
      SetNMessage({
        message: data.NewLevel.message,
        failed: false
      })
  });

  return (
    <>
      <Helmet>
        <title>Level | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <h5 className="element-header">Level</h5>
                <div className="element-box">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <label htmlFor="">New Level</label>
                    </div>
                    <div className="col-lg-12">
                      <form
                        onSubmit={async e => {
                          e.preventDefault();
                          await NewLevel({
                            variables: {
                              name: level,
                              school: school.id
                            }
                          });
                        }}
                      >
                        <div className="row">
                          <div className="col-sm-12 col-md-8 col-lg-10">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <div className="os-icon os-icon-plus"></div>
                                </div>
                              </div>
                              <input
                                onChange={({ currentTarget }) => {
                                  SetLevel(currentTarget.value);
                                }}
                                className="form-control"
                                placeholder="Enter level name"
                              />
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-4 col-lg-2">
                            <div className="buttons-w">
                              <button className="btn btn-primary" type="submit">
                                Save New
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      <LoadingState loading={nLoading} />
                      <AlertMessage
                        message={nMessage?.message}
                        failed={nMessage?.failed}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center ">
                  <div className="col-lg-12 pt-5">
                    <AlertMessage
                      message={message?.message}
                      failed={message?.failed}
                    />
                    <LoadingState loading={loading} />
                    {data && data.GetLevels && (
                      <div className="element-box-tp">
                        <div className="table-responsive">
                          <table className="table table-padded">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Level</th>
                                <th>Created At</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.GetLevels.docs.map(
                                (level: any, index: number) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{level.name}</td>
                                    <td>{level.created_at}</td>
                                    <td className="row-actions text-center">
                                      <a href="#" title="Edit">
                                        <i className="os-icon os-icon-edit"></i>
                                      </a>
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
                      </div>
                    )}

                    {/* {!data && (
                      <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Level found!</h2>
                      </div>
                    )} */}
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

export default Level;
