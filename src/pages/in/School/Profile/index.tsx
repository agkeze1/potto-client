import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import {
  GetAppName,
  ToggleExpansion,
  CleanMessage,
} from "../../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import LoadingState from "../../../partials/loading";
import { IProps } from "../../../../models/IProps";
import { toast } from "react-toastify";
import BasicInfo from "./BasicInfo";
import { GET_SCHOOL } from "../../../../queries/School.query";
import LargeImage from "../../partials/LargeImage";

const SchoolProfile: FC<IProps> = ({ history, match }) => {
  const [school, SetSchool] = useState<any>();

  //   School Id from match object passed
  const { id } = match.params;

  //   Get School with id passed
  const { loading } = useQuery(GET_SCHOOL, {
    variables: { id },
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      if (data) {
        SetSchool(data.GetSchool.doc);
      }
    },
    fetchPolicy: "network-only",
  });

  return (
    <>
      <Helmet>
        <title> School Profile {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div>
              <h5 className="element-header tracking-in-contract">
                School Profile
              </h5>
              <LoadingState loading={loading} />
              {school && (
                <div className="element-box ">
                  <div>
                    <a
                      href="javascript:void(0)"
                      title="Expand / Collapse"
                      className="icon-lg m-3 float-right"
                      onClick={() => {
                        ToggleExpansion();
                      }}
                    >
                      <i className="os-icon os-icon-maximize"></i>
                    </a>
                    <a
                      href="javascript:void(0)"
                      title="Back"
                      className="icon-lg m-3 float-left"
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <i className="os-icon os-icon-arrow-left6"></i>
                    </a>
                  </div>
                  <div className="text-center mb-5 mt-3">
                    {/* Profile Picture */}
                    <LargeImage imgPath={school.logo} />

                    <h4 className="up-header text-uppercase mt-3">
                      {school.name}
                    </h4>
                    <h6 className="up-sub-header text-uppercase">
                      {school.alias}
                    </h6>
                  </div>
                  <div className="os-tabs-w">
                    <div className="os-tabs-controls">
                      <ul className="nav nav-tabs smaller">
                        <li className="nav-item text-uppercase">
                          <a
                            className="nav-link active"
                            data-toggle="tab"
                            href="#basic-info"
                          >
                            Basic Info
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content">
                      {/* Basic Information */}
                      <div className="tab-pane active" id="basic-info">
                        <BasicInfo school={school} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolProfile;
