import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { IMessage } from "../../models/IMessage";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  NEW_GUARDIAN_TYPE,
  GET_GUARDIAN_TYPES,
  REMOVE_GUARDIAN_TYPE,
  UPDATE_GUARDIAN_TYPE,
} from "../../queries/Guardian.query";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import IconInput from "../partials/IconInput";

const GuardianType: FC<IProps> = ({ history }) => {
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [newGuardianType, SetNewGuardianType] = useState<any>();

  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();
  const [editGuardianType, SetEditGuardianType] = useState<any>({});

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Get list of Guardian types
  const { loading, data } = useQuery(GET_GUARDIAN_TYPES, {
    onError: (err) =>
      SetLMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Save New Guardian type
  const [NewGuardianType, { loading: nLoading }] = useMutation(
    NEW_GUARDIAN_TYPE,
    {
      onError: (err) =>
        SetNMessage({
          message: err.message,
          failed: true,
        }),
      onCompleted: (data) =>
        SetNMessage({
          message: data.NewGuardianType.message,
          failed: false,
        }),
      update: (cache, { data }) => {
        const q: any = cache.readQuery({
          query: GET_GUARDIAN_TYPES,
        });

        q.GetGuardianTypes.docs.unshift(data.NewGuardianType.doc);

        //update cache
        cache.writeQuery({
          query: GET_GUARDIAN_TYPES,
          data: { GetGuardianTypes: q.GetGuardianTypes },
        });
      },
    }
  );

  // Remove GuardianType
  const [RemoveGuardianType, { loading: rLoading }] = useMutation(
    REMOVE_GUARDIAN_TYPE,
    {
      onError: (err) =>
        SetRMessage({
          message: err.message,
          failed: true,
        }),
      update: (cache, { data }) => {
        const q: any = cache.readQuery({
          query: GET_GUARDIAN_TYPES,
        });

        const index = q.GetGuardianTypes.docs.findIndex(
          (i: any) => i.id === data.RemoveGuardianType.doc.id
        );

        q.GetGuardianTypes.docs.splice(index, 1);

        //update
        cache.writeQuery({
          query: GET_GUARDIAN_TYPES,
          data: { GetGuardianTypes: q.GetGuardianTypes },
        });
      },
    }
  );

  // Update GuradianType
  const [UpdateGuradianType, { loading: uLoading }] = useMutation(
    UPDATE_GUARDIAN_TYPE,
    {
      onError: (err) =>
        SetUMessage({
          message: err.message,
          failed: true,
        }),
      onCompleted: (data) => {
        SetUMessage({
          message: data.UpdateGuardianType.message,
          failed: false,
        });
      },
      update: (cache, { data }) => {
        const q: any = cache.readQuery({
          query: GET_GUARDIAN_TYPES,
        });

        const index = q.GetGuardianTypes.docs.findIndex(
          (i: any) => i.id === data.UpdateGuardianType.doc.id
        );

        q.GetGuardianTypes.docs.splice(index, 1);
        q.GetGuardianTypes.docs.unshift(data.UpdateGuardianType.doc);

        //update
        cache.writeQuery({
          query: GET_GUARDIAN_TYPES,
          data: { GetGuardianTypes: q.GetGuardianTypes },
        });
      },
    }
  );

  return (
    <>
      <Helmet>
        <title>Term | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <h5 className="element-header">Guardian Type</h5>
                <div className="element-box">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <AlertMessage
                        message={nMessage?.message}
                        failed={nMessage?.failed}
                      />
                      <LoadingState loading={nLoading} />
                      <label htmlFor="">New Guardian Type</label>
                    </div>
                    <div className="col-lg-12">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          await NewGuardianType({
                            variables: {
                              name: newGuardianType,
                            },
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
                                className="form-control"
                                placeholder="Enter guardian type"
                                onChange={({ currentTarget }) =>
                                  SetNewGuardianType(currentTarget.value)
                                }
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
                    <div className="element-box-tp">
                      <div className="table-responsive">
                        <AlertMessage
                          message={lMessage?.message}
                          failed={lMessage?.failed}
                        />
                        <AlertMessage
                          message={rMessage?.message}
                          failed={rMessage?.failed}
                        />
                        <LoadingState loading={loading || rLoading} />

                        {data && (
                          <table className="table table-padded">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.GetGuardianTypes.docs.map(
                                (type: any, index: number) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{type.name}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        href="#"
                                        title="Edit"
                                        onClick={() => {
                                          SetUMessage(undefined);
                                          SetEditGuardianType({
                                            id: type.id,
                                            name: type.name,
                                          });
                                          if (editGuardianType) {
                                            setTimeout(() => {
                                              document
                                                .getElementById("btnModal")
                                                ?.click();
                                            }, 0);
                                          }
                                        }}
                                      >
                                        <i className="os-icon os-icon-edit"></i>
                                      </a>
                                      <a
                                        className="danger"
                                        href="#"
                                        title="Delete"
                                        onClick={async () => {
                                          let del = window.confirm(
                                            `Are you sure you want to delete "${type.name}"?`
                                          );
                                          if (del) {
                                            await RemoveGuardianType({
                                              variables: {
                                                id: type.id,
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
                        )}
                        {/* Hidden button to lunch edit modal */}
                        <button
                          type="button"
                          id="btnModal"
                          data-target="#editModal"
                          data-toggle="modal"
                          style={{ display: "none" }}
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit GuardianType Modal */}
      {editGuardianType && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="editModal"
          role="dialog"
        >
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Guardian Type Info <hr />
                </h5>

                <button className="close" data-dismiss="modal" type="button">
                  <span aria-hidden="true"> &times;</span>
                </button>
              </div>
              <div className="modal-body pb-2">
                <LoadingState loading={uLoading} />
                <AlertMessage
                  message={uMessage?.message}
                  failed={uMessage?.failed}
                />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Scroll to top of page
                    scrollTop();
                    UpdateGuradianType({
                      variables: {
                        id: editGuardianType?.id,
                        name: editGuardianType?.name,
                      },
                    });
                  }}
                >
                  <div className="row">
                    {/* Guardian Type input */}
                    <div className="col-12">
                      <IconInput
                        placeholder="Enter Guardian Type"
                        label="Guardiant Type"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        initVal={editGuardianType?.name}
                        onChange={(name: string) => {
                          SetEditGuardianType({
                            ...editGuardianType,
                            name,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="buttons-w mb-5">
                    <button className="btn btn-primary px-3" type="submit">
                      Update Guardian Type
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuardianType;
