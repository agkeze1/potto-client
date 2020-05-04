import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import IconInput from "../partials/IconInput";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { IProps } from "../../models/IProps";
import { GET_LEVELS } from "../../queries/Level.query";
import {
  GET_CLASSES,
  NEW_CLASS,
  REMOVE_CLASS,
  UPDATE_CLASS,
} from "../../queries/Class.query";
import { TEACHER_LIST } from "../../queries/Teacher.query";
import { IMessage } from "../../models/IMessage";
import { authService } from "../../services/Auth.Service";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import SwitchInput from "../partials/SwitchInput";
import Select from "react-select";

const Class: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [newClass, SetNewClass] = useState<any>({});
  const [showNewClass, SetShowNewClass] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [teachers, SetTeachers] = useState<any>([]);

  // Update Class
  const [activeClassId, SetActiveClassId] = useState<string>();
  const [editClass, SetEditClass] = useState<any>({});

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School of logged in user
  const { school } = authService.GetUser();

  // Fetch Teachers for Form Teacher input
  const { loading: tLoading } = useQuery(TEACHER_LIST, {
    variables: { page: 1, limit: 100 },
    onCompleted: (data) => {
      if (data.GetTeachers) {
        SetTeachers(
          data.GetTeachers.docs.map((teacher: any) => ({
            label:
              teacher.first_name +
              " " +
              teacher.middle_name +
              " " +
              teacher.last_name +
              " ( " +
              teacher.phone +
              " )",
            value: teacher.id,
          }))
        );
      }
    },
  });

  // Fetch Levels for Level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: (err) => {
      SetLMessage({
        message: err.message,
        failed: true,
      });
    },
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

  // Fetch list of Classes
  const [GetClasses, { loading, data }] = useLazyQuery(GET_CLASSES, {
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
  });

  //Save new Class
  const [NewClass, { loading: nLoading }] = useMutation(NEW_CLASS, {
    onError: (err) =>
      SetNMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetNMessage({
        message: data.NewClass.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_CLASSES,
        variables: { level: newClass?.level },
      });

      q.GetClasses.docs.unshift(data.NewClass.doc);

      //update
      cache.writeQuery({
        query: GET_CLASSES,
        variables: { level: newClass?.level },
        data: { GetClasses: q.GetClasses },
      });
    },
  });

  useEffect(() => {
    if (newClass?.level) GetClasses({ variables: { level: newClass?.level } });
  }, [newClass?.level]);

  // Remove Class
  const [RemoveClass, { loading: rLoading }] = useMutation(REMOVE_CLASS, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_CLASSES,
        variables: { level: newClass?.level },
      });

      const index = q.GetClasses.docs.findIndex(
        (i: any) => i.id === data.RemoveClass.doc.id
      );

      q.GetClasses.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: TEACHER_LIST,
        variables: { level: newClass?.level },
        data: { GetClasses: q.GetClasses },
      });
    },
  });

  // Update Class
  const [UpdateClass, { loading: uLoading }] = useMutation(UPDATE_CLASS, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateClass.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_CLASSES,
        variables: { level: newClass?.level },
      });

      const index = q.GetClasses.docs.findIndex(
        (i: any) => i.id === data.UpdateClass.doc.id
      );

      q.GetClasses.docs.splice(index, 1);
      q.GetClasses.docs.unshift(data.UpdateClass.doc);

      //update
      cache.writeQuery({
        query: GET_CLASSES,
        variables: { level: newClass?.level },
        data: { GetClasses: q.GetClasses },
      });
    },
  });

  // Get Form Teacher basic info from Form Teacher object passed
  const FormTeacher = (formTeacherObj: any) => {
    if (formTeacherObj) {
      return (
        formTeacherObj.first_name +
        " " +
        formTeacherObj.middle_name +
        " " +
        formTeacherObj.last_name +
        " ( " +
        formTeacherObj.phone +
        " )"
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Class | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div className="element-actions" style={{ marginTop: "-20px" }}>
              {/* New Class and Level Filter switch */}
              <SwitchInput
                isOn={showNewClass}
                handleToggle={() => {
                  SetShowNewClass(!showNewClass);
                }}
                label="New Class"
              />
            </div>
            <h5 className="element-header">Class</h5>
            {/* Show New class Inputs */}
            <div className="element-box">
              {showNewClass && <h6 className="element-header">New Class</h6>}

              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <LoadingState loading={nLoading} />
                  <AlertMessage
                    message={nMessage?.message}
                    failed={nMessage?.failed}
                  />
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      SetNMessage(undefined);
                      await NewClass({
                        variables: {
                          name: newClass?.name,
                          level: newClass?.level,
                          formTeacher: newClass?.formTeacher,
                        },
                      });
                    }}
                  >
                    <div className="row">
                      {showNewClass && (
                        <div className="col-md-6">
                          {/* Class name input */}
                          <IconInput
                            placeholder="Enter class name"
                            label="Class Name"
                            icon="os-icon-user-male-circle"
                            required={true}
                            type="text"
                            onChange={(name: string) => {
                              SetNewClass({
                                ...newClass,
                                name,
                              });
                            }}
                          />
                          {/* Form Teacher input */}
                          <Dropdown
                            items={teachers}
                            onSelect={(item: any) =>
                              SetNewClass({
                                ...newClass,
                                formTeacher: item.value,
                              })
                            }
                            label="Form Teacher"
                          />
                          <LoadingState loading={tLoading} />
                        </div>
                      )}
                      <div className={showNewClass ? "col-md-6" : "col-12"}>
                        {/* Level input */}
                        <Dropdown
                          items={levels}
                          onSelect={(item: any) =>
                            SetNewClass({
                              ...newClass,
                              level: item.value,
                            })
                          }
                          label="Level"
                        />
                        <LoadingState loading={lLoading} />
                        <AlertMessage
                          message={lMessage?.message}
                          failed={lMessage?.failed}
                        />
                      </div>
                      {showNewClass && (
                        <div className="col-sm-12">
                          <div className="buttons-w">
                            <button className="btn btn-primary" type="submit">
                              Save New
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <LoadingState loading={loading || rLoading} />
            <AlertMessage message={message?.message} failed={message?.failed} />
            {data && data.GetClasses.docs.length > 0 && (
              <div className="row justify-content-center ">
                <div className="col-lg-12 pt-5">
                  <div className="element-box-tp">
                    <div className="table-responsive">
                      <table className="table table-padded">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Class</th>
                            <th>Form Teacher</th>
                            <th>Date Created</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.GetClasses.docs.map(
                            (clas: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{clas.name}</td>
                                <td>
                                  {FormTeacher(clas.form_teacher) || (
                                    <span className="text-danger">
                                      None assigned!
                                    </span>
                                  )}
                                </td>
                                <td>{CLEAN_DATE(clas.created_at)}</td>
                                <td className="row-actions text-center">
                                  <a
                                    href="#"
                                    title="Edit"
                                    data-target="#editModal"
                                    data-toggle="modal"
                                    onClick={() => {
                                      SetUMessage(undefined);
                                      SetActiveClassId(clas.id);
                                      SetEditClass({
                                        name: clas.name,
                                        formTeacher: {
                                          id: clas.form_teacher?.id,
                                          name: FormTeacher(clas.form_teacher),
                                        },
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
                                      let del = window.confirm(
                                        `Are you sure you want to delete "${clas.name}"?`
                                      );
                                      if (del) {
                                        await RemoveClass({
                                          variables: {
                                            id: clas.id,
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
                </div>
              </div>
            )}
            {data && data.GetClasses.docs.length === 0 && (
              <div className="text-center pt-5 fade-in">
                <h3 className="text-danger"> No Class record found!</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Class Modal*/}
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
                Edit Class <hr />
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
              >
                <span aria-hidden="true"> ×</span>
              </button>
            </div>
            <div className="modal-body element-box no-shadow">
              <LoadingState loading={uLoading} />
              <AlertMessage
                message={uMessage?.message}
                failed={uMessage?.failed}
              />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await UpdateClass({
                    variables: {
                      id: activeClassId,
                      name: editClass?.name,
                      formTeacher: editClass?.formTeacher?.id,
                    },
                  });
                }}
              >
                <div className="row">
                  <div className="col-12">
                    {/* Class name input */}
                    <IconInput
                      placeholder="Enter class name"
                      label="Class Name"
                      icon="os-icon-user-male-circle"
                      required={true}
                      type="text"
                      initVal={editClass.name}
                      onChange={(name: string) => {
                        SetEditClass({
                          ...editClass,
                          name,
                        });
                      }}
                    />
                  </div>
                  {/* Form Teacher input */}
                  <div className="col-12">
                    <label htmlFor="">Form Teacher</label>
                    <br />
                    <Select
                      options={teachers}
                      value={{
                        label: editClass.formTeacher?.name || (
                          <span className="text-gray">Select...</span>
                        ),
                        value: editClass.formTeacher?.id,
                      }}
                      onChange={(item: any) =>
                        SetEditClass({
                          ...editClass,
                          formTeacher: { id: item.value, name: item.label },
                        })
                      }
                      label="Form Teacher"
                    />
                    <LoadingState loading={tLoading} />
                  </div>
                  <div className="buttons-w col-12 pb-3 mt-4">
                    <button className="btn btn-primary" type="submit">
                      Update Class
                    </button>
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

export default Class;
