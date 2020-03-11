import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import Dropdown from "../partials/Dropdown";
import Select from "react-select";

const Subjects = () => {
  const level = [
    { label: "JSS1", value: 1 },
    { label: "JSS2", value: 2 },
    { label: "JSS3", value: 3 },
    { label: "SS1", value: 4 },
    { label: "SS2", value: 5 },
    { label: "SS3", value: 6 }
  ];
  return (
    <>
      <Helmet>
        <title>Subjects | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <span className="element-actions">
                  <button
                    className="btn btn-primary "
                    data-target="#NewSubjectModal1"
                    data-toggle="modal"
                    type="button"
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Subjects</h5>

                <div className="row justify-content-center ">
                  <div className="col-lg-12">
                    <div className="element-box-tp">
                      <div className="table-responsive">
                        <table className="table table-padded">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Class</th>
                              <th>Level</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Eagle</td>
                              <td>JSS1</td>
                              <td className="row-actions text-center">
                                <a href="#" title="Edit">
                                  <i className="os-icon os-icon-edit"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Dog</td>
                              <td>JSS1</td>
                              <td className="row-actions text-center">
                                <a href="#" title="Edit">
                                  <i className="os-icon os-icon-edit"></i>
                                </a>
                                <a className="danger" href="#" title="Delete">
                                  <i className="os-icon os-icon-ui-15"></i>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Subject found!</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="NewSubjectModal1"
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
              <form>
                <div className="form-group">
                  <label htmlFor=""> Title</label>
                  <input
                    className="form-control"
                    placeholder="Enter subject title"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor=""> Code</label>
                  <input
                    className="form-control"
                    placeholder="Enter subject code"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departmental">Levels</label>
                  <Select isMulti={true} options={level} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-dismiss="modal"
                type="button"
              >
                {" "}
                Close
              </button>
              <button className="btn btn-primary" type="button">
                {" "}
                Save New
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subjects;
