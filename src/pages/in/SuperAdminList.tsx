import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";

const SuperAdminList = () => {
  return (
    <>
      <Helmet>
        <title>Super Admin List | {GetAppName()}</title>
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
            <h5 className="element-header">Super Admin List</h5>
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
                          <th>Gender</th>
                          <th>Email</th>
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
                          <td>Male</td>
                          <td>080333222111</td>
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
                          <td>douglas@afari.com</td>
                          <td>Female</td>
                          <td>jakata@gmail.com</td>
                          <td>080332211332</td>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Image */}
      <ImageModal />
    </>
  );
};

export default SuperAdminList;
