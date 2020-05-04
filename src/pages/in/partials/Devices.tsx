import React, { FC } from "react";

interface IProps {
  devices: any;
  type: string;
  SetActiveDevice: any;
  showAssignBtn: boolean;
}
export const Devices: FC<IProps> = ({
  devices,
  type,
  SetActiveDevice,
  showAssignBtn,
}) => (
  <div className="table-responsive">
    {devices?.length > 0 && (
      <table className="table table-padded">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Mac Address</th>
            <th>Class Assigned</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <>
            {devices.map((dev: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{dev.name}</td>
                <td>{dev.mac}</td>
                <td>
                  {dev.assigned_class ? (
                    dev.assigned_class?.level?.name +
                    " - " +
                    dev.assigned_class?.name
                  ) : (
                    <label className="text-danger">Not Assigned</label>
                  )}
                </td>
                <td className="row-actions text-center">
                  <a
                    href="#"
                    title="View On history"
                    data-target="#PowerHistoryModal"
                    data-toggle="modal"
                  >
                    <i className="os-icon os-icon-power"></i>
                  </a>
                  {showAssignBtn && (
                    <>
                      <a
                        href="#"
                        title="Assign to class"
                        data-target="#AssignToClassModal"
                        data-toggle="modal"
                        onClick={SetActiveDevice(dev)}
                      >
                        <i className="os-icon os-icon-file-text"></i>
                      </a>
                    </>
                  )}
                  {!showAssignBtn && (
                    <a
                      href="#"
                      title="Un-assign Device"
                      data-target="#AssignToClassModal"
                      data-toggle="modal"
                      onClick={SetActiveDevice(dev)}
                    >
                      <i className="os-icon os-icon-delete text-danger"></i>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </>
        </tbody>
      </table>
    )}
    {devices?.length === 0 && (
      <div className="text-center pt-5 fade-in">
        <h5 className="text-danger">No {type} Device found!</h5>
      </div>
    )}
  </div>
);
