import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";

const Level = () => {
  return (
    <>
      <Helmet>
        <title>Level | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <h5 className="element-header">Level</h5>
            <div className="text-right mb-3 mt-n3">
              <NavLink className="btn btn-primary" to="/in/new-school">
                New User
              </NavLink>
            </div>
            <div className="element-box">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <label htmlFor="">Filter User</label>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-sm-12 col-md-8 col-lg-10">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <div className="os-icon os-icon-search"></div>
                          </div>
                        </div>
                        <input
                          className="form-control"
                          placeholder="Enter school name or alias to search"
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-2">
                      <div className="buttons-w">
                        <button className="btn btn-primary">
                          Search School
                        </button>
                      </div>
                    </div>
                  </div>
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
                          <th>Image</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Phone</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                            <div
                              className="user-with-avatar clickable"
                              data-target="#imageModal"
                              data-toggle="modal"
                            >
                              <img src="/logo192.png" alt="" />
                            </div>
                          </td>
                          <td>Douglas Aniekwu</td>
                          <td>douglas@afari.com</td>
                          <td>080333222111</td>
                          <td>Desk staff</td>
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
                          <td>1</td>
                          <td>
                            <div
                              className="user-with-avatar clickable"
                              data-target="#imageModal"
                              data-toggle="modal"
                            >
                              <img src="/logo192.png" alt="" />
                            </div>
                          </td>
                          <td>Odogwu Jakata</td>
                          <td>
                            jakata@gmail.com
                            <i
                              className="os-icon os-icon-check-circle text-success ml-2"
                              title="Email verified"
                            ></i>
                          </td>
                          <td>080332211332</td>
                          <td>
                            <span className="badge badge-success">Admin</span>
                          </td>
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
                    <h2 className="text-danger">No User found!</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Level;
