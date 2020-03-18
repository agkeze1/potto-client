import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Dropdown from "../partials/Dropdown";

const DeviceList = () => {
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
                <h5 className="element-header">Device List</h5>
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box-tp">
                      <div className="table-responsive">
                        <table className="table table-padded">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Mac Address</th>
                              <th>Android Id</th>
                              <th>Class</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>DVC102</td>
                              <td>HR:ed34421</td>
                              <td>AD3ed34421</td>
                              <td>SS1 - Jubilee</td>
                              <td className="row-actions text-center">
                                <a
                                  href="#"
                                  title="View On history"
                                  data-target="#PowerHistoryModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-power"></i>
                                </a>
                                <a
                                  href="#"
                                  title="Assign to class"
                                  data-target="#AssignToClassModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-file-text"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>DVC102</td>
                              <td>HR:ed34421</td>
                              <td>AD3ed34421</td>
                              <td>SS3 - Golden</td>
                              <td className="row-actions text-center">
                                <a
                                  href="#"
                                  title="View On history"
                                  data-target="#PowerHistoryModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-power"></i>
                                </a>
                                <a
                                  href="#"
                                  title="Assign to class"
                                  data-target="#AssignToClassModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-file-text"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>DVC98</td>
                              <td>HR:ed34421</td>
                              <td>AD3ed34421</td>
                              <td>
                                <span className="text-danger">
                                  Not assigned!
                                </span>{" "}
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
                                <a
                                  href="#"
                                  title="Assign to class"
                                  data-target="#AssignToClassModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-file-text"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Device found!</h2>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <form>
                <div className="row">
                  <div className="col-12">
                    {/* Level input */}
                    <Dropdown
                      items={[
                        { label: "JSS3", value: "1" },
                        { label: "SS1", value: "2" }
                      ]}
                      onSelect={() => {}}
                      label="Select Level"
                      icon="phone"
                    />
                  </div>
                  <div className="col-12">
                    {/* Gender input */}
                    <Dropdown
                      items={[
                        { label: "Bronze", value: "1" },
                        { label: "Gold", value: "2" }
                      ]}
                      onSelect={() => {}}
                      label="Select Class"
                      icon="phone"
                    />
                  </div>
                  <div className="col-12">
                    {" "}
                    <button className="btn btn-primary" type="button">
                      Save New
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
