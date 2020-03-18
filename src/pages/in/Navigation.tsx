import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Select from "react-select";
import IconInput from "../partials/IconInput";

const Navigation = () => {
  const role = [
    { label: "Admin", value: 1 },
    { label: "Front Desker", value: 2 },
    { label: "Principal", value: 3 }
  ];

  const navGroup = [
    { label: "Student Mgt", value: 1 },
    { label: "Attendance", value: 2 },
    { label: "Setup", value: 3 }
  ];

  return (
    <>
      <Helmet>
        <title>Navigation | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <span className="element-actions">
                  <button
                    className="btn btn-primary "
                    data-target="#NewNavigationModal"
                    data-toggle="modal"
                    type="button"
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Navigation</h5>
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box-tp">
                      <div className="table-responsive">
                        <table className="table table-padded">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Group</th>
                              <th>Role</th>
                              <th>Path</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>New Student</td>
                              <td>Student Mgt</td>
                              <td>Admin</td>
                              <td>/in/new-student</td>
                              <td className="row-actions text-center">
                                <a
                                  href="#"
                                  title="View Details"
                                  data-target="#DescriptionModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-alert-octagon"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Student List</td>
                              <td>Student Mgt</td>
                              <td>Admin</td>
                              <td>/in/student-list</td>
                              <td className="row-actions text-center">
                                <a
                                  href="#"
                                  title="View Details"
                                  data-target="#DescriptionModal"
                                  data-toggle="modal"
                                >
                                  <i className="os-icon os-icon-alert-octagon"></i>
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
                        <h2 className="text-danger">No Navigation found!</h2>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Navigation Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="NewNavigationModal"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Navigation</h5>
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
                  <div className="col-lg-6">
                    <IconInput
                      placeholder="Enter name"
                      label="Name"
                      icon="os-icon-phone"
                      required={true}
                      type="text"
                      onChange={(name: string) => {}}
                    />
                  </div>
                  <div className="col-lg-6">
                    <IconInput
                      placeholder="Enter path"
                      label="Path"
                      icon="os-icon-phone"
                      required={true}
                      type="text"
                      onChange={(path: string) => {}}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="departmental">Navigation Group</label>
                      <Select isMulti={true} options={navGroup} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="departmental">Roles</label>
                      <Select isMulti={true} options={role} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <IconInput
                      placeholder="Enter icon (os-icon only)"
                      label="Icon"
                      icon="os-icon-phone"
                      required={true}
                      type="text"
                      onChange={(icon: string) => {}}
                    />
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label> Description </label>
                      <textarea
                        className="form-control"
                        placeholder="Enter description"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" type="button">
                  Save New
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Description Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="DescriptionModal"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Navigation Description</h5>
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
              <p>Discharge best employed your phase each the of shine.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
