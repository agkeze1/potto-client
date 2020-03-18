import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Select from "react-select";
import IconInput from "../partials/IconInput";

const NavigationGroup = () => {
  return (
    <>
      <Helmet>
        <title>Navigation Group | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <span className="element-actions">
                  <button
                    className="btn btn-primary "
                    data-target="#NewNavigationGroupModal"
                    data-toggle="modal"
                    type="button"
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Navigation Group</h5>
                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box-tp">
                      <div className="table-responsive">
                        <table className="table table-padded">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Description</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Student Mgt</td>
                              <td>Ecerything about Student.</td>
                              <td className="row-actions text-center">
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>User Mgt</td>
                              <td>Ecerything about User.</td>
                              <td className="row-actions text-center">
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Navigation Group found!</h2>
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
        id="NewNavigationGroupModal"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Navigation Group</h5>
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
                    <IconInput
                      placeholder="Enter name"
                      label="Name"
                      icon="os-icon-phone"
                      required={true}
                      type="text"
                      onChange={(name: string) => {}}
                    />
                  </div>
                  <div className="col-12">
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
    </>
  );
};

export default NavigationGroup;
