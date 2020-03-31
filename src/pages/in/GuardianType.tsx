import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { IMessage } from "../../models/IMessage";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  NEW_GUARDIAN_TYPE,
  GET_GUARDIAN_TYPES
} from "../../queries/Guardian.query";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";

const GuardianType: FC<IProps> = ({ history }) => {
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [newGuardianType, SetNewGuardianType] = useState<any>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get list of Guardian types
  const { loading, data } = useQuery(GET_GUARDIAN_TYPES, {
    onError: err =>
      SetLMessage({
        message: err.message,
        failed: true
      })
  });

  // Save New Guardian type
  const [NewGuardianType, { loading: nLoading }] = useMutation(
    NEW_GUARDIAN_TYPE,
    {
      onError: err =>
        SetNMessage({
          message: err.message,
          failed: true
        }),
      onCompleted: data =>
        SetNMessage({
          message: data.NewGuardianType.message,
          failed: false
        }),
      update: (cache, { data }) => {
        const q: any = cache.readQuery({
          query: GET_GUARDIAN_TYPES
        });

        q.GetGuardianTypes.docs.unshift(data.NewGuardianType.doc);

        //update cache
        cache.writeQuery({
          query: GET_GUARDIAN_TYPES,
          data: { GetGuardianTypes: q.GetGuardianTypes }
        });
      }
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
                        onSubmit={async e => {
                          e.preventDefault();

                          await NewGuardianType({
                            variables: {
                              name: newGuardianType
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
                        <LoadingState loading={loading} />

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
                        )}
                      </div>
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

export default GuardianType;
