import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import Dropdown from "../partials/Dropdown";
import IconInput from "../partials/IconInput";

const Class = () => {
  return (
    <>
      <Helmet>
        <title>Class | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">Class</h5>
            <div className="element-box">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        {/* Class name input */}
                        <IconInput
                          placeholder="Enter class name"
                          label="Class Name"
                          icon="os-icon-user-male-circle"
                          required={true}
                          type="text"
                          onChange={(name: string) => {}}
                        />
                      </div>
                      <div className="col-md-6">
                        <Dropdown
                          items={[
                            { label: "JSS1", value: "1" },
                            { label: "JSS2", value: "2" }
                          ]}
                          onSelect={() => {}}
                          label="Level"
                        />
                      </div>
                      <div className="col-sm-12">
                        <div className="buttons-w">
                          <button className="btn btn-primary" type="submit">
                            Save New
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row justify-content-center ">
              <div className="col-lg-12 pt-5">
                <div className="element-box-tp">
                  <div className="table-responsive">
                    <table className="table table-padded">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Class</th>
                          <th>Level</th>
                          <th>Form Teacher</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Eagle</td>
                          <td>JSS1</td>
                          <td>Teacher Component</td>
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
                        <tr>
                          <td>2</td>
                          <td>Dog</td>
                          <td>JSS1</td>
                          <td>Teacher Component</td>
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
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Class found!</h2>
                      </div> */}
                </div>
              </div>
            </div>
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
