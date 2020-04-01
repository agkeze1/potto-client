import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NEW_TERM, TERM_LIST } from "../../queries/Term.query";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import IconInput from "../partials/IconInput";

const Term: FC<IProps> = ({ history }) => {
  const [newTerm, SetNewTerm] = useState<string>();
  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const [NewTerm, { loading }] = useMutation(NEW_TERM, {
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      SetMessage({
        message: data.NewTerm.message,
        failed: false
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TERM_LIST
      });

      q.GetTerms.docs.unshift(data.NewTerm.doc);

      //update
      cache.writeQuery({
        query: TERM_LIST,
        data: { GetTerms: q.GetTerms }
      });
    }
  });

  const { loading: lLoading, data: lData } = useQuery(TERM_LIST, {
    onError: err =>
      SetLMessage({
        message: err.message,
        failed: true
      })
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
                        onSubmit={async e => {
                          e.preventDefault();
                          await NewTerm({
                            variables: {
                              name: newTerm
                            }
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
                      message={lMessage?.message}
                      failed={lMessage?.failed}
                    />
                    <LoadingState loading={lLoading} />
                    <div className="element-box-tp">
                      {lData && (
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
                      )}
                    </div>
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

export default Term;
