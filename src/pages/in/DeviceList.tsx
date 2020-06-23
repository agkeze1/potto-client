import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, cleanDate } from "../../context/App";
import SwitchInput from "../partials/SwitchInput";
import { authService } from "../../services/Auth.Service";
import {
  GET_ASSIGNED_DEVICES,
  GET_UNASSIGNED_DEVICES,
  ASSIGN_DEVICE,
  UNASSIGN_DEVICE,
} from "../../queries/Device.query";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Devices } from "./partials/Devices";
import LoadingState from "../partials/loading";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import Select from "react-select";
import { toast } from "react-toastify";

const DeviceList = () => {
  const [showUnassignedDevices, SetShowUnassignedDevices] = useState<boolean>(
    false
  );
  const [activeDevice, SetActiveDevice] = useState<any>({});

  // For Level and Class inputs
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showClassesRefresh, SetShowClassesRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [classes, SetClasses] = useState<any>([]);
  const [activeClass, SetActiveClass] = useState<any>();

  // Get School of logged in user
  const { school } = authService.GetUser();

  // Get List of Assigned Devices
  const { loading, data } = useQuery(GET_ASSIGNED_DEVICES, {
    onError: (err) => {
      toast.error(CleanMessage(err.message));
    },
  });

  // Get List of Unassigned Devices
  const { loading: uLoading, data: uData } = useQuery(GET_UNASSIGNED_DEVICES, {
    onError: (err) => {
      toast.error(CleanMessage(err.message));
    },
  });

  // Get Levels for level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: { school: school.id },
    onError: (err) => {
      toast.error(CleanMessage(err.message));
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
      toast.error(CleanMessage(err.message));
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
      toast.error(CleanMessage(err.message));
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
  }, [activeLevel, GetClasses]);

  // Assign Device to Class
  const [AssignDevice, { loading: aLoading }] = useMutation(ASSIGN_DEVICE, {
    onError: (err) => {
      toast.error(CleanMessage(err.message));
    },
    onCompleted: (data) => {
      if (data) {
        toast.success("Device assigned successfully");
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

  // Unassign Device from Class
  const [UnAssignDevice, { loading: uDLoading }] = useMutation(
    UNASSIGN_DEVICE,
    {
      onError: (err) => {
        toast.error(CleanMessage(err.message));
      },
      update: (cache, { data }) => {
        // Read Unassigned devices query
        const q: any = cache.readQuery({
          query: GET_UNASSIGNED_DEVICES,
        });

        // Read Assigned devices query
        const d: any = cache.readQuery({
          query: GET_ASSIGNED_DEVICES,
        });

        // Remove device from Assigned Devices list
        const ind = d.GetAssignedDevices.docs.findIndex(
          (i: any) => i.id === data.UnAssignDevice.doc.id
        );
        d.GetAssignedDevices.docs.splice(ind, 1);

        // Add device to UnAssigned Devices list
        q.GetUnassignedDevices.docs.unshift(data.UnAssignDevice.doc);

        //update Unassigned Devices
        cache.writeQuery({
          query: GET_UNASSIGNED_DEVICES,
          data: { GetUnassignedDevices: q.GetUnassignedDevices },
        });

        //update Assigned Devices
        cache.writeQuery({
          query: GET_ASSIGNED_DEVICES,
          data: { GetAssignedDevices: d.GetAssignedDevices },
        });
      },
    }
  );

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
                      <LoadingState
                        loading={loading || uLoading || uDLoading}
                      />
                      {/* List of Assigned devices */}
                      {!showUnassignedDevices && (
                        <Devices
                          devices={data?.GetAssignedDevices.docs}
                          type="Assigned"
                          SetActiveDevice={SetActiveDevice}
                          showAssignBtn={false}
                          UnassignDevice={UnAssignDevice}
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

      {/* Hidden button to close Assign device to class modal */}
      <button
        id="btnAssignDevice"
        data-target="#AssignToClassModal"
        data-toggle="modal"
        style={{ display: "none" }}
      ></button>

      {/* Device On History Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="PowerHistoryModal"
        role="dialog"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
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
                    <b>{activeDevice?.name}</b>
                  </div>
                  <span>
                    Assigned to |{" "}
                    <b>
                      {activeDevice?.assigned_class?.level?.name}
                      {" - "}
                      {activeDevice?.assigned_class?.name}{" "}
                    </b>
                  </span>
                </div>
                <div className="element-wrapper pb-2">
                  <h5 className="element-header">Power On History</h5>
                </div>
                {activeDevice?.state_histories?.length > 0 && (
                  <table className="table table-striped text-center">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDevice?.state_histories?.map(
                        (his: any, idx: number) => (
                          <tr>
                            <td>{idx + 1}</td>
                            <td>
                              <span className="text-primary">
                                {cleanDate(his.date)}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
                {activeDevice?.state_histories?.length === 0 && (
                  <h6 className="text-danger mt-3">No "On History" found!</h6>
                )}
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
                          GetLevels();
                        }}
                        className="btn btn-primary btn-sm px-1 my-2"
                        type="submit"
                      >
                        Reload Level
                      </button>
                    )}
                    <LoadingState loading={lLoading || rlLoading} />
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
