import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { IProps } from "../../models/IProps";
import Select from "react-select";
import { GET_SUBJECTS, NEW_SUBJECT } from "../../queries/Subject.query";
import { GET_LEVELS } from "../../queries/Level.query";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { authService } from "../../services/Auth.Service";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import { IMessage } from "../../models/IMessage";
import { Subject } from "../../models/Subject.model";
import IconInput from "../partials/IconInput";

const Subjects: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [newSubject, SetNewSubject] = useState<any>();
  const [levels, SetLevel] = useState<any>([]);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School ID from logged in user
  const { school } = authService.GetUser();

  // Fetch list of Subjects
  const { loading, data } = useQuery(GET_SUBJECTS, {
    variables: {
      school: school.id
    },
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      })
  });

  // Save new Subject
  const [NewSubject, { loading: nLoading }] = useMutation(NEW_SUBJECT, {
    onError: err =>
      SetNMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data =>
      SetNMessage({
        message: data.NewSubject.message,
        failed: false
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id }
      });

      q.GetSubjects.docs.unshift(data.NewSubject.doc);

      //update
      cache.writeQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
        data: { GetSubjects: q.GetSubjects }
      });
    }
  });

  // Fetch Levels for Level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onCompleted: data => {
      if (data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id
          }))
        );
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Subjects | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <span className="element-actions">
                  <button
                    className="btn btn-primary "
                    data-target="#NewSubjectModal"
                    data-toggle="modal"
                    type="button"
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Subjects</h5>
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <LoadingState loading={loading} />
                    <AlertMessage
                      message={message?.message}
                      failed={message?.failed}
                    />
                    {data && (
                      <div className="element-box-tp">
                        <div className="table-responsive">
                          <table className="table table-padded">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Code</th>
                                <th>Levels</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.GetSubjects.docs.map(
                                (sub: any, index: number) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{sub.title}</td>
                                    <td>{sub.code}</td>
                                    <td>
                                      {sub.levels.map((lev: any) => (
                                        <span className="badge badge-success-inverted">
                                          {lev.name}
                                        </span>
                                      ))}
                                    </td>
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
                        {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Subject found!</h2>
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

      {/* Modal for New Subject*/}
      <div
        aria-hidden="true"
        className="modal fade"
        id="NewSubjectModal"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Subject</h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
              >
                <span aria-hidden="true"> ×</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  SetNMessage(undefined);
                  await NewSubject({
                    variables: {
                      model: { ...newSubject, school: school.id }
                    }
                  });
                }}
              >
                <LoadingState loading={nLoading} />
                <AlertMessage
                  message={nMessage?.message}
                  failed={nMessage?.failed}
                />

                {/* Class subject title input */}
                <IconInput
                  placeholder="Enter subject title"
                  label="Subject Title"
                  icon="os-icon-user-male-circle"
                  required={true}
                  type="text"
                  onChange={(title: string) => {
                    SetNewSubject({
                      ...newSubject,
                      title
                    });
                  }}
                />
                {/* Class subject title code */}
                <IconInput
                  placeholder="Enter subject code"
                  label="Subject Code"
                  icon="os-icon-user-male-circle"
                  required={true}
                  type="text"
                  onChange={(code: string) => {
                    SetNewSubject({
                      ...newSubject,
                      code
                    });
                  }}
                />
                <div className="form-group">
                  <label htmlFor="departmental">Levels</label>
                  <Select
                    isMulti={true}
                    options={levels}
                    onChange={(items: any) => {
                      SetNewSubject({
                        ...newSubject,
                        levels: items.map((i: any) => i.value)
                      });
                    }}
                  />
                </div>
                <LoadingState loading={lLoading} />
                <button className="btn btn-primary mt-3" type="submit">
                  {" "}
                  Save New
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subjects;
