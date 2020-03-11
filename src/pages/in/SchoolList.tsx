import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";

const SchoolList = () => {
  return (
    <>
      <Helmet>
        <title>School List | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <span className="element-actions mt-n2">
              <button
                className="btn btn-primary "
                data-target="#exampleModal1"
                id="#newMax"
                data-toggle="modal"
                type="button"
              >
                Create New
              </button>
            </span>
            <h5 className="element-header">School List</h5>
            <div className="element-box">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <label htmlFor="">Filter School</label>
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
                          placeholder="Enter school ref.no, alias or name to search"
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
                          <th>Logo</th>
                          <th>Ref. No</th>
                          <th>Name</th>
                          <th>Alias</th>
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
                          <td>CKC2020</td>
                          <td>Christ the King College</td>
                          <td>CKC</td>
                          <td className="row-actions text-center">
                            <a href="#" title="Edit">
                              <i className="os-icon os-icon-edit"></i>
                            </a>
                            <NavLink title="View contact info" to="#">
                              <i className="os-icon os-icon-eye"></i>
                            </NavLink>
                            <a className="danger" href="#" title="Delete">
                              <i className="os-icon os-icon-ui-15"></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            <div
                              className="user-with-avatar clickable"
                              data-target="#imageModal"
                              data-toggle="modal"
                            >
                              <img src="/logo192.png" alt="" />
                            </div>
                          </td>
                          <td>SPC2020</td>
                          <td>Saint Patric's College</td>
                          <td>SPC</td>
                          <td className="row-actions text-center">
                            <a href="#" title="Edit">
                              <i className="os-icon os-icon-edit"></i>
                            </a>
                            <NavLink title="View contact info" to="#">
                              <i className="os-icon os-icon-eye"></i>
                            </NavLink>
                            <a className="danger" href="#" title="Delete">
                              <i className="os-icon os-icon-ui-15"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-center pt-5 fade-in">
                    <h2 className="text-danger">No School found!</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Schoo Logo */}
      <ImageModal />
    </>
  );
};

export default SchoolList;
