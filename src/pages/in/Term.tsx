import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import {
  NEW_TERM,
  TERM_LIST,
  REMOVE_TERM,
  UPDATE_TERM,
} from "../../queries/Term.query";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import IconInput from "../partials/IconInput";

const Term: FC<IProps> = ({ history }) => {
  const [newTerm, SetNewTerm] = useState<string>();
  const [editTerm, SetEditTerm] = useState<any>({});

  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  const ClearMessages = () => {
    SetMessage(undefined);
    SetLMessage(undefined);
    SetRMessage(undefined);
    SetUMessage(undefined);
  };

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Create New Term
  const [NewTerm, { loading }] = useMutation(NEW_TERM, {
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) =>
      SetMessage({
        message: data.NewTerm.message,
        failed: false,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TERM_LIST,
      });

      q.GetTerms.docs.unshift(data.NewTerm.doc);

      //update
      cache.writeQuery({
        query: TERM_LIST,
        data: { GetTerms: q.GetTerms },
      });
    },
  });

  // Remove Term
  const [RemoveTerm, { loading: rLoading }] = useMutation(REMOVE_TERM, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TERM_LIST,
      });

      const index = q.GetTerms.docs.findIndex(
        (i: any) => i.id === data.RemoveTerm.doc.id
      );

      q.GetTerms.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: TERM_LIST,
        data: { GetTerms: q.GetTerms },
      });
    },
  });

  // Update Term
  const [UpdateTerm, { loading: uLoading }] = useMutation(UPDATE_TERM, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateTerm.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TERM_LIST,
      });

      const index = q.GetTerms.docs.findIndex(
        (i: any) => i.id === data.UpdateTerm.doc.id
      );

      q.GetTerms.docs.splice(index, 1);
      q.GetTerms.docs.unshift(data.UpdateTerm.doc);

      //update
      cache.writeQuery({
        query: TERM_LIST,
        data: { GetTerms: q.GetTerms },
      });
    },
  });

  // Get list of Terms
  const { loading: lLoading, data: lData } = useQuery(TERM_LIST, {
    onError: (err) =>
      SetLMessage({
        message: err.message,
        failed: true,
      }),
  });

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
                <h5 className="element-header">Term</h5>
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
                          ClearMessages();
                          await NewTerm({
                            variables: {
                              name: newTerm,
                            },
                          });
                        }}
                      >
                        <div className="row">
                          <div className="col-12">
                            {/* Term input */}
                            <IconInput
                              placeholder="Enter Term name"
                              label="New Term "
                              icon="os-icon-ui-09"
                              required={true}
                              type="text"
                              onChange={(name: string) => {
                                SetNewTerm(name);
                              }}
                            />
                          </div>
                          <div className="col-12">
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
                      message={lMessage?.message || rMessage?.message}
                      failed={lMessage?.failed || rMessage?.failed}
                    />
                    <LoadingState loading={lLoading || rLoading} />
                    {lData && lData.GetTerms.docs.length > 0 && (
                      <div className="element-box-tp">
                        <div className="table-responsive">
                          <table className="table table-padded">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Term</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lData.GetTerms.docs.map(
                                (term: any, index: number) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{term.name}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        href="#"
                                        title="Edit"
                                        data-target="#editModal"
                                        data-toggle="modal"
                                        onClick={() => {
                                          ClearMessages();
                                          SetEditTerm({
                                            id: term.id,
                                            name: term.name,
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
                                            `Are you sure you want to delete "${term.name}"?`
                                          );
                                          if (del) {
                                            await RemoveTerm({
                                              variables: {
                                                id: term.id,
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
                    {lData && lData.GetTerms.docs.length === 0 && (
                      <div className="text-center pt-5 fade-in">
                        <h3 className="text-danger"> No Term record found!</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Term Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="editModal"
        role="dialog"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button className="close" data-dismiss="modal" type="button">
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body pb-5">
              <LoadingState loading={uLoading} />
              <AlertMessage
                message={uMessage?.message}
                failed={uMessage?.failed}
              />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  ClearMessages();
                  await UpdateTerm({
                    variables: {
                      id: editTerm.id,
                      name: editTerm.name,
                    },
                  });
                }}
              >
                <div className="row">
                  <div className="col-12">
                    {/* Term input */}
                    <IconInput
                      placeholder="Enter Term name"
                      label="New Term "
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      initVal={editTerm?.name}
                      onChange={(name: string) => {
                        SetEditTerm({
                          ...editTerm,
                          name,
                        });
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <div className="buttons-w">
                      <button className="btn btn-primary" type="submit">
                        Update Term
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

export default Term;
