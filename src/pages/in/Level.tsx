import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE } from "../../context/App";
import {
  GET_LEVELS,
  NEW_LEVEL,
  UPDATE_LEVEL,
  REMOVE_LEVEL,
} from "../../queries/Level.query";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import TimeAgo from "react-timeago";
import IconInput from "../partials/IconInput";

const Level: FC<IProps> = ({ history }) => {
  const [level, SetLevel] = useState<any>();
  const [editLevel, SetEditLevel] = useState<any>({});

  const [message, SetMessage] = useState<IMessage>();
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  const ClearMessages = () => {
    SetMessage(undefined);
    SetNMessage(undefined);
    SetRMessage(undefined);
    SetUMessage(undefined);
  };

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School ID from logged in user
  const { school } = authService.GetUser();

  // Get list of Levels
  const { data, loading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Create New Level
  const [NewLevel, { loading: nLoading }] = useMutation(NEW_LEVEL, {
    onError: (err) =>
      SetNMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) =>
      SetNMessage({
        message: data.NewLevel.message,
        failed: false,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_LEVELS,
      });

      q.GetLevels.docs.unshift(data.NewLevel.doc);

      // update
      cache.writeQuery({
        query: GET_LEVELS,
        data: { GetLevels: q.GetLevels },
      });
    },
  });

  // Remove Level
  const [RemoveLevel, { loading: rLoading }] = useMutation(REMOVE_LEVEL, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetRMessage({
        message: data.RemoveLevel.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_LEVELS,
      });

      const index = q.GetLevels.docs.findIndex(
        (i: any) => i.id === data.RemoveLevel.doc.id
      );

      q.GetLevels.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: GET_LEVELS,
        data: { GetLevels: q.GetLevels },
      });
    },
  });

  // Update Level
  const [UpdateLevel, { loading: uLoading }] = useMutation(UPDATE_LEVEL, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateLevel.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_LEVELS,
      });

      const index = q.GetLevels.docs.findIndex(
        (i: any) => i.id === data.UpdateLevel.doc.id
      );

      q.GetLevels.docs.splice(index, 1);
      q.GetLevels.docs.unshift(data.UpdateLevel.doc);

      //update
      cache.writeQuery({
        query: GET_LEVELS,
        data: { GetLevels: q.GetLevels },
      });
    },
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
                      <LoadingState loading={nLoading} />
                      <AlertMessage
                        message={nMessage?.message}
                        failed={nMessage?.failed}
                      />
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await NewLevel({
                            variables: {
                              name: level,
                              school: school.id,
                            },
                          });
                        }}
                      >
                        <div className="row">
                          <div className="col-sm-12 col-md-8 col-lg-10">
                            {/* Level name input */}
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
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center ">
                  <div className="col-lg-12 pt-5">
                    <AlertMessage
                      message={message?.message}
                      failed={message?.failed}
                    />
                    <LoadingState loading={loading || rLoading} />
                    {data && data.GetLevels.docs.length > 0 && (
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
                                    <td>{CLEAN_DATE(level.created_at)}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        href="#"
                                        title="Edit"
                                        data-target="#editModal"
                                        data-toggle="modal"
                                        onClick={() => {
                                          ClearMessages();
                                          SetEditLevel({
                                            id: level.id,
                                            name: level.name,
                                          });
                                        }}
                                      >
                                        <i className="os-icon os-icon-edit"></i>
                                      </a>
                                      <a
                                        className="danger"
                                        href="#"
                                        title="Delete"
                                        onClick={async () => {
                                          ClearMessages();

                                          let del = window.confirm(
                                            `Are you sure you want to delete "${level.name}"?`
                                          );
                                          if (del) {
                                            await RemoveLevel({
                                              variables: {
                                                id: level.id,
                                              },
                                            });
                                          }
                                        }}
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
                    {data && data.GetLevels.docs.length === 0 && (
                      <div className="text-center pt-5 fade-in">
                        <h3 className="text-danger"> No Level record found!</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Level Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="editModal"
        role="dialog"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Level <hr />
              </h5>
              <button className="close" data-dismiss="modal" type="button">
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body element-box no-shadow pb-5">
              <LoadingState loading={uLoading} />
              <AlertMessage
                message={uMessage?.message}
                failed={uMessage?.failed}
              />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  ClearMessages();
                  await UpdateLevel({
                    variables: {
                      id: editLevel.id,
                      name: editLevel.name,
                    },
                  });
                }}
              >
                <div className="row">
                  <div className="col-12">
                    {/* Level input */}
                    <IconInput
                      placeholder="Enter Level name"
                      label="Level "
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      initVal={editLevel?.name}
                      onChange={(name: string) => {
                        SetEditLevel({
                          ...editLevel,
                          name,
                        });
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <div className="buttons-w">
                      <button className="btn btn-primary" type="submit">
                        Update Level
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Level;
