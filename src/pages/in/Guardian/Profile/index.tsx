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
import { GET_GUARDIAN } from "../../../../queries/Student.query";
import BasicInfo from "./BasicInfo";
import LargeImage from "../../partials/LargeImage";

const GuardianProfile: FC<IProps> = ({ history, match }) => {
  const [guardian, SetGuardian] = useState<any>();

  //   Guardian Id from match object passed
  const { id } = match.params;

  //   Get Guardian with id passed
  const { loading } = useQuery(GET_GUARDIAN, {
    variables: { id },
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      if (data) {
        SetGuardian(data.GetGuardian.doc);
      }
    },
    fetchPolicy: "network-only",
  });

  return (
    <>
      <Helmet>
        <title> Guardian Profile {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            <div>
              <h5 className="element-header tracking-in-contract">
                Guardian Profile
              </h5>
              <LoadingState loading={loading} />
              {guardian && (
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
                    <LargeImage imgPath={guardian.image} />

                    <h4 className="up-header text-uppercase mt-3">
                      {guardian.full_name}
                    </h4>
                    <h6 className="up-sub-header text-uppercase">
                      {guardian.phone}
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
                        <BasicInfo guardian={guardian} />
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

export default GuardianProfile;
