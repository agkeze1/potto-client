import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../../context/App";
import { NavLink } from "react-router-dom";

const PromoteStudents = () => {
  return (
    <>
      <Helmet>
        <title>Promote Students | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <span className="element-actions mt-n2">
              <NavLink
                to="/in/new-school"
                className="btn btn-primary"
                type="button"
              >
                Create New
              </NavLink>
            </span>
            <h5 className="element-header">Promote Students</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoteStudents;
