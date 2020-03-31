import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import IconInput from "../partials/IconInput";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { IProps } from "../../models/IProps";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES, NEW_CLASS } from "../../queries/Class.query";
import { IMessage } from "../../models/IMessage";
import { authService } from "../../services/Auth.Service";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import SwitchInput from "../partials/SwitchInput";

const Class: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [nMessage, SetNMessage] = useState<IMessage>();
  const [newClass, SetNewClass] = useState<any>();
  const [activeLevelId, SetActiveLevelId] = useState<any>();
  const [showNewClass, SetShowNewClass] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School ID of logged in user
  const { school } = authService.GetUser();

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

  // Fetch list of Classes
  const [GetClasses, { loading, data }] = useLazyQuery(GET_CLASSES, {
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      })
  });

  //Save new Class
  const [NewClass, { loading: nLoading }] = useMutation(NEW_CLASS, {
    onError: err =>
      SetNMessage({
        message: err.message,
        failed: true
      }),
    onCompleted: data => {
      SetNMessage({
        message: data.NewClass.message,
        failed: false
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_CLASSES,
        variables: { level: activeLevelId }
      });

      q.GetClasses.docs.unshift(data.NewClass.doc);

      //update
      cache.writeQuery({
        query: GET_CLASSES,
        variables: { level: activeLevelId },
        data: { GetClasses: q.GetClasses }
      });
    }
  });

  useEffect(() => {
    if (activeLevelId) GetClasses({ variables: { level: activeLevelId } });
  }, [activeLevelId]);

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
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      SetNMessage(undefined);
                      await NewClass({
                        variables: {
                          level: activeLevelId,
                          name: newClass
                        }
                      });
                    }}
                  >
                    <div className="row">
                      <div className="col-12">
                        <AlertMessage
                          message={nMessage?.message}
                          failed={nMessage?.failed}
                        />
                      </div>
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
                              SetNewClass(name);
                            }}
                          />
                        </div>
                      )}
                      <div className={showNewClass ? "col-md-6" : "col-12"}>
                        <Dropdown
                          items={levels}
                          onSelect={(item: any) => SetActiveLevelId(item.value)}
                          label="Level"
                        />
                      </div>
                      <LoadingState loading={nLoading} />
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
                  <LoadingState loading={lLoading} />
                </div>
              </div>
            </div>

            <LoadingState loading={loading} />
            <AlertMessage message={message?.message} failed={message?.failed} />
            {data && data.GetClasses && (
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
                              <tr>
                                <td>{index + 1}</td>
                                <td>{clas.name}</td>
                                <td>
                                  {clas.form_teacher?.first_name ||
                                    "None assigned"}
                                </td>
                                <td>{clas.created_at}</td>
                                <td className="row-actions text-center">
                                  <a href="#" title="Edit">
                                    <i className="os-icon os-icon-edit"></i>
                                  </a>
                                  <a
                                    href="#"
                                    title="Assign Form teacher"
                                    data-target="#FormTeacherModal"
                                    data-toggle="modal"
                                  >
                                    <i className="os-icon os-icon-file-text"></i>
                                  </a>
                                  <a className="danger" href="#" title="Delete">
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
          </div>
        </div>
      </div>

      {/* Assign Form Teacher Modal*/}
      <div
        aria-hidden="true"
        className="modal fade"
        id="FormTeacherModal"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Form Teacher</h5>
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
              <form>
                <Dropdown
                  items={[
                    { label: "Mrs. Antai Grace", value: "1" },
                    { label: "Sir Innocent Okoli", value: "2" }
                  ]}
                  onSelect={() => {}}
                  label="Select Form Teacher"
                />
                <button className="btn btn-primary" type="submit">
                  Assign
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Class;
