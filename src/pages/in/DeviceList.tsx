import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";
import SwitchInput from "../partials/SwitchInput";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import {
  GET_ASSIGNED_DEVICES,
  GET_UNASSIGNED_DEVICES,
  ASSIGN_DEVICE,
} from "../../queries/Device.query";
import { IMessage } from "../../models/IMessage";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Devices } from "./partials/Devices";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import Select from "react-select";

const DeviceList: FC<IProps> = ({ history }) => {
  const [showUnassignedDevices, SetShowUnassignedDevices] = useState<boolean>(
    false
  );
  const [message, SetMessage] = useState<IMessage>();
  const [aMessage, SetAMessage] = useState<IMessage>();
  const [activeDevice, SetActiveDevice] = useState<any>({});

  // For Level and Class inputs
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [cMessage, SetCMessage] = useState<IMessage>();
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showClassesRefresh, SetShowClassesRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [classes, SetClasses] = useState<any>([]);
  const [activeClass, SetActiveClass] = useState<any>();

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get School of logged in user
  const { school } = authService.GetUser();

  // Get List of Assigned Devices
  const { loading, data } = useQuery(GET_ASSIGNED_DEVICES, {
    onError: (err) => {
      SetMessage({
        message: err.message,
        failed: true,
      });
    },
  });

  // Get List of Unassigned Devices
  const { loading: uLoading, data: uData } = useQuery(GET_UNASSIGNED_DEVICES, {
    onError: (err) => {
      SetMessage({
        message: err.message,
        failed: true,
      });
    },
  });

  // Get Levels for level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: (err) => {
      SetLMessage({
        message: err.message,
        failed: true,
      });
      SetShowLevelsRefresh(true);
    },
    onCompleted: (data) => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
        SetShowLevelsRefresh(false);
      }
    },
  });

  // Get Levels when reload level button is clicked
  const [GetLevels, { loading: rlLoading }] = useLazyQuery(GET_LEVELS, {
    variables: { schschool: school.id },
    onError: (err) => {
      SetLMessage({
        message: err.message,
        failed: true,
      });
      SetShowLevelsRefresh(true);
    },
    onCompleted: (data) => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
        SetShowLevelsRefresh(false);
      }
    },
  });

  // Get classes for class input
  const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
    onError: (err) => {
      SetCMessage({
        message: err.message,
        failed: true,
      });
      SetShowClassesRefresh(true);
    },
    onCompleted: (data) => {
      if (data)
        SetClasses(
          data.GetClasses.docs.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      SetShowClassesRefresh(false);
    },
  });

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (activeLevel?.id) {
      SetClasses(undefined);
      GetClasses({ variables: { level: activeLevel?.id } });
    }
  }, [activeLevel?.id]);

  // Get classes for class input
  const [AssignDevice, { loading: aLoading }] = useMutation(ASSIGN_DEVICE, {
    onError: (err) => {
      SetAMessage({
        message: err.message,
        failed: true,
      });
    },
    onCompleted: (data) => {
      if (data) {
        SetAMessage({
          message: "Device assigned successfully",
          failed: false,
        });
        setTimeout(() => {
          document.getElementById("btnAssignDevice")?.click();
          SetShowUnassignedDevices(false);
        }, 1000);
      }
    },
    update: (cache, { data }) => {
      // Read Unassigned devices query
      const d: any = cache.readQuery({
        query: GET_UNASSIGNED_DEVICES,
      });

      // Read Assigned devices query
      const q: any = cache.readQuery({
        query: GET_ASSIGNED_DEVICES,
      });

      // Remove device from Unassigned Devices list
      const ind = d.GetUnassignedDevices.docs.findIndex(
        (i: any) => i.id === data.AssignToClass.doc.id
      );
      d.GetUnassignedDevices.docs.splice(ind, 1);

      // Add device to Assigned Devices list
      q.GetAssignedDevices.docs.unshift(data.AssignToClass.doc);

      //update Unassigned Devices
      cache.writeQuery({
        query: GET_UNASSIGNED_DEVICES,
        data: { GetUnassignedDevices: d.GetUnassignedDevices },
      });

      //update Assigned Devices
      cache.writeQuery({
        query: GET_ASSIGNED_DEVICES,
        data: { GetAssignedDevices: q.GetAssignedDevices },
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Device list | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <div className="element-actions" style={{ marginTop: "-20px" }}>
                  {/* Assigned/Unassigned devices switch */}
                  <SwitchInput
                    isOn={showUnassignedDevices}
                    handleToggle={() => {
                      SetShowUnassignedDevices(!showUnassignedDevices);
                    }}
                    label="Unassigned Devices"
                  />
                </div>
                <h5 className="element-header">
                  {showUnassignedDevices
                    ? "Unassigned Device List"
                    : "Assigned Device List"}
                </h5>
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box-tp">
                      <AlertMessage
                        message={message?.message}
                        failed={message?.failed}
                      />
                      <LoadingState loading={loading || uLoading} />
                      {/* List of Assigned devices */}
                      {!showUnassignedDevices && (
                        <Devices
                          devices={data?.GetAssignedDevices.docs}
                          type="Assigned"
                          SetActiveDevice={SetActiveDevice}
                          showAssignBtn={false}
                        />
                      )}

                      {/* List of Unassigned devices */}
                      {showUnassignedDevices && (
                        <Devices
                          devices={uData?.GetUnassignedDevices.docs}
                          type="Unassigned"
                          SetActiveDevice={SetActiveDevice}
                          showAssignBtn={true}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden button to clos Assign device to class modal */}
      <button
        id="btnAssignDevice"
        data-target="#AssignToClassModal"
        data-toggle="modal"
        style={{ display: "none" }}
      ></button>

      {/* View Device On History Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="PowerHistoryModal"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Device Power History</h5>
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
              <div className="table-responsive element-box no-bg no-shadow">
                <div className="text-center mb-3">
                  <i
                    className="os-icon os-icon-smartphone"
                    style={{ fontSize: "100px" }}
                  ></i>
                  <div className="mt-3">
                    <b>DVC-435</b>
                  </div>
                  <span>
                    Assigned to | <b>JSS 2 - A </b>
                  </span>
                </div>
                <div className="element-wrapper pb-2">
                  <h5 className="element-header">History</h5>
                </div>
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        21st Jan. 2020 -
                        <span className="text-primary"> (3:45pm)</span>
                      </td>
                      <td>
                        <label className="badge badge-success-inverted">
                          On
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>
                        29st Jan. 2020 -
                        <span className="text-primary"> (5:14pm)</span>
                      </td>
                      <td>
                        <label className="badge badge-danger-inverted">
                          Off
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>
                        6th Feb. 2020 -
                        <span className="text-primary"> (1:02pm)</span>
                      </td>
                      <td>
                        <label className="badge badge-danger-inverted">
                          Off
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Device to Class Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="AssignToClassModal"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Device to Class</h5>
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
              <AlertMessage
                message={aMessage?.message}
                failed={aMessage?.failed}
              />
              <LoadingState loading={aLoading} />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (activeClass) {
                    AssignDevice({
                      variables: {
                        id: activeDevice?.id,
                        _class: activeClass?.id,
                      },
                    });
                  }
                }}
              >
                <div className="row">
                  <div className="col-12 mb-3">
                    {/* Level input */}
                    <label>
                      Level <br />
                    </label>
                    <Select
                      options={levels}
                      onChange={(item: any) => {
                        SetActiveClass(undefined);
                        SetActiveLevel({
                          name: item?.label,
                          id: item?.value,
                        });
                      }}
                    />
                    {showLevelsRefresh && (
                      <button
                        onClick={() => {
                          SetShowLevelsRefresh(false);
                          SetLMessage(undefined);
                          GetLevels();
                        }}
                        className="btn btn-primary btn-sm px-1 my-2"
                        type="submit"
                      >
                        Reload Level
                      </button>
                    )}
                    <LoadingState loading={lLoading || rlLoading} />
                    <AlertMessage
                      message={lMessage?.message}
                      failed={lMessage?.failed}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    {/* Current Class input */}
                    <label>
                      Class <br />
                    </label>
                    <Select
                      options={classes}
                      value={{
                        label: activeClass?.name || (
                          <span className="text-gray">Select...</span>
                        ),
                        value: activeClass?.id,
                      }}
                      onChange={(item: any) => {
                        SetActiveClass({
                          name: item?.label,
                          id: item?.value,
                        });
                      }}
                    />
                    {showClassesRefresh && (
                      <button
                        onClick={() => {
                          SetShowClassesRefresh(false);
                          SetCMessage(undefined);
                          SetMessage(undefined);
                          GetClasses({
                            variables: { level: activeLevel?.id },
                          });
                        }}
                        className="btn btn-primary btn-sm px-1 my-2"
                        type="submit"
                      >
                        Reload Classes
                      </button>
                    )}
                    <LoadingState loading={cLoading} />
                    <AlertMessage
                      message={cMessage?.message}
                      failed={cMessage?.failed}
                    />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary mb-3" type="submit">
                      Assign Device
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

export default DeviceList;
