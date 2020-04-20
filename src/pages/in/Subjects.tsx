import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { IProps } from "../../models/IProps";
import Select from "react-select";
import {
  GET_SUBJECTS,
  NEW_SUBJECT,
  REMOVE_SUBJECT,
  UPDATE_SUBJECT,
} from "../../queries/Subject.query";
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
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();
  const [newSubject, SetNewSubject] = useState<any>();
  const [levels, SetLevel] = useState<any>([]);

  const [editSubject, SetEditSubject] = useState<any>({});

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Get  School ID from logged in user
  const { school } = authService.GetUser();

  // Fetch list of Subjects
  const { loading, data } = useQuery(GET_SUBJECTS, {
    variables: {
      school: school.id,
    },
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Save new Subject
  const [NewSubject, { loading: nLoading }] = useMutation(NEW_SUBJECT, {
    onError: (err) =>
      SetNMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) =>
      SetNMessage({
        message: data.NewSubject.message,
        failed: false,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
      });

      q.GetSubjects.docs.unshift(data.NewSubject.doc);

      //update
      cache.writeQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
        data: { GetSubjects: q.GetSubjects },
      });
    },
  });

  // Fetch Levels for Level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onCompleted: (data) => {
      if (data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
      }
    },
  });

  // Remove Subject
  const [RemoveSubject, { loading: rLoading }] = useMutation(REMOVE_SUBJECT, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
      });

      const index = q.GetSubjects.docs.findIndex(
        (i: any) => i.id === data.RemoveSubject.doc.id
      );

      q.GetSubjects.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
        data: { GetSubjects: q.GetSubjects },
      });
    },
  });

  // Update Subject
  const [UpdateSubject, { loading: uLoading }] = useMutation(UPDATE_SUBJECT, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateSubject.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
      });

      const index = q.GetSubjects.docs.findIndex(
        (i: any) => i.id === data.UpdateSubject.doc.id
      );

      q.GetSubjects.docs.splice(index, 1);
      q.GetSubjects.docs.unshift(data.UpdateSubject.doc);

      //update
      cache.writeQuery({
        query: GET_SUBJECTS,
        variables: { school: school.id },
        data: { GetTSubjects: q.GetTSubjects },
      });
    },
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
                    <LoadingState loading={loading || rLoading} />
                    <AlertMessage
                      message={message?.message}
                      failed={message?.failed}
                    />
                    <AlertMessage
                      message={rMessage?.message}
                      failed={rMessage?.failed}
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
                                      <a
                                        href="#"
                                        title="Edit"
                                        onClick={() => {
                                          SetUMessage(undefined);
                                          SetEditSubject({
                                            id: sub.id,
                                            title: sub.title,
                                            code: sub.code,
                                          });
                                          if (editSubject) {
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
                                            `Are you sure you want to delete "${
                                              sub.title +
                                              " ( " +
                                              sub.code +
                                              " )"
                                            }"?`
                                          );
                                          if (del) {
                                            await RemoveSubject({
                                              variables: {
                                                id: sub.id,
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
                        {/* Hidden button to lunch edit modal */}
                        <button
                          type="button"
                          id="btnModal"
                          data-target="#editModal"
                          data-toggle="modal"
                          style={{ display: "none" }}
                        ></button>
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  SetNMessage(undefined);
                  await NewSubject({
                    variables: {
                      model: { ...newSubject, school: school.id },
                    },
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
                      title,
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
                      code,
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
                        levels: items.map((i: any) => i.value),
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

      {/* Edit Subject Modal */}
      {editSubject && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="editModal"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Subject Info <hr />
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
                    UpdateSubject({
                      variables: {
                        id: editSubject?.id,
                        title: editSubject?.title,
                        code: editSubject?.code,
                      },
                    });
                  }}
                >
                  <div className="row">
                    {/* Subject title input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter subject title"
                        label="Title"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        initVal={editSubject?.title}
                        onChange={(title: string) => {
                          SetEditSubject({
                            ...editSubject,
                            title,
                          });
                        }}
                      />
                    </div>
                    {/* Subject code input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter subject code"
                        label="Code"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        initVal={editSubject?.code}
                        onChange={(code: string) => {
                          SetEditSubject({
                            ...editSubject,
                            code,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="buttons-w mb-5">
                    <button className="btn btn-primary px-3" type="submit">
                      Update Subject
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

export default Subjects;
