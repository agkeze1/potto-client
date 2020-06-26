import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "./../../context/App";
import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title> Resource not found! | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div
                            className="element-box no-bg bg-white fade-in text-center pb-5"
                            style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                        >
                            <img style={{ width: "34em" }} className="no-scale" src="/images/13.png" alt="404" />
                            <h3 className="text-info mb-4">Not found!</h3>
                            <p>Sorry, we could not find what you where looking for.</p>
                            <NavLink to="/in/dashboard" className="btn btn-light rounded">
                                <i className="os-icon os-icon-home text-primary" style={{ fontSize: "1.4em" }}></i> Back Home
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NotFound;
