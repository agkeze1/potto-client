import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import LoadingState from "../../../partials/loading";
import { IProps } from "../../../../models/IProps";
import { toast } from "react-toastify";
import BasicInfo from "./BasicInfo";
import { GET_SCHOOL, UPDATE_SCHOOL } from "../../../../queries/School.query";
import LargeImage from "../../partials/LargeImage";
import IconInput from "../../../partials/IconInput";
import ImageUpload from "../../../partials/ImageUpload";
import ColorPicker from "../../partials/ColorPicker";

const SchoolProfile: FC<IProps> = ({ history, match }) => {
    const [school, SetSchool] = useState<any>();
    const [editSchool, SetEditSchool] = useState<any>();

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
        fetchPolicy: "network-only"
    });

    const [UpdateSchool, { loading: uLoading }] = useMutation(UPDATE_SCHOOL, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            toast.success(CleanMessage(data.UpdateSchool.message));
            SetSchool(data.UpdateSchool.doc);
            setTimeout(() => {
                document.getElementById("btnModal")?.click();
            }, 1000);
        }
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
                            <h5 className="element-header tracking-in-contract">School Profile</h5>
                            <LoadingState loading={loading} />
                            {school && (
                                <div className="element-box ">
                                    <div className="row">
                                        <div className="col-12">
                                            <a
                                                href="javascript:void(0)"
                                                title="Edit"
                                                className="icon-lg m-3 float-right"
                                                onClick={() => {
                                                    SetEditSchool({
                                                        name: school.name,
                                                        alias: school.alias,
                                                        logo: school.logo,
                                                        contactAddress: school.contact_address,
                                                        contactEmail: school.contact_email,
                                                        contactPhone: school.contact_phone,
                                                        address: school.address,
                                                        primaryColor: school.primary_color,
                                                        secondaryColor: school.secondary_color
                                                    });

                                                    setTimeout(() => {
                                                        document.getElementById("btnModal")?.click();
                                                    }, 0);
                                                }}
                                            >
                                                <i className="os-icon os-icon-edit"></i>
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
                                    </div>
                                    <div className="text-center mb-5 mt-n3">
                                        {/* Profile Picture */}
                                        <LargeImage imgPath={school.logo} />

                                        <h4 className="up-header text-uppercase mt-3">{school.name}</h4>
                                        <h6 className="up-sub-header text-uppercase text-primary">{school.alias}</h6>
                                    </div>
                                    <div className="os-tabs-w">
                                        <div className="os-tabs-controls">
                                            <ul className="nav nav-tabs smaller">
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link active" data-toggle="tab" href="#basic-info">
                                                        Basic Info
                                                    </a>
                                                </li>
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link" data-toggle="tab" href="#settings">
                                                        Settings
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="tab-content">
                                            {/* Basic Information */}
                                            <div className="tab-pane active" id="basic-info">
                                                <BasicInfo school={school} />
                                            </div>

                                            {/* Settings */}
                                            <div className="tab-pane" id="settings">
                                                Settings
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden button to lunch edit modal */}
            <button
                type="button"
                id="btnModal"
                data-target="#editModal"
                data-toggle="modal"
                style={{ display: "none" }}
            ></button>

            {/* Edit School Modal */}
            {editSchool && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Edit School Info <hr />
                                </h5>
                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body element-box no-shadow pb-2">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        UpdateSchool({
                                            variables: {
                                                id,
                                                update: editSchool
                                            }
                                        });
                                    }}
                                >
                                    <div className="row">
                                        {/* Name input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter name"
                                                label="Name"
                                                icon="os-icon-file-text"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.name}
                                                onChange={(name: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        name
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Alias input */}
                                        <div className="col-md-6">
                                            <IconInput
                                                placeholder="Enter alias"
                                                label="Alias"
                                                icon="os-icon-file"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.alias}
                                                onChange={(alias: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        alias
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Contact Phone input */}
                                        <div className="col-md-6">
                                            <IconInput
                                                placeholder="Enter contact phone"
                                                label="Contact Phone"
                                                icon="os-icon-smartphone"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.contactPhone}
                                                onChange={(contactPhone: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        contactPhone
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Contact Email input */}
                                        <div className="col-md-6">
                                            <IconInput
                                                placeholder="Enter contact Email"
                                                label="Contact Email"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.contactEmail}
                                                onChange={(contactEmail: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        contactEmail
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Contact Address input */}
                                        <div className="col-md-6">
                                            <IconInput
                                                placeholder="Enter contact address"
                                                label="Contact Address"
                                                icon="os-icon-map-pin"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.contactAddress}
                                                onChange={(contactAddress: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        contactAddress
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Address input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter address"
                                                label="Address"
                                                icon="os-icon-map-pin"
                                                required={true}
                                                type="text"
                                                initVal={editSchool.address}
                                                onChange={(address: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        address
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Primary Colour input */}
                                        <div className="col-md-6">
                                            <ColorPicker
                                                placeholder="Pick primary colour"
                                                label="Primary Colour"
                                                icon="os-icon-email-2-at2"
                                                initColor={editSchool.primaryColor}
                                                initVal={editSchool.primaryColor}
                                                onChange={(primaryColor: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        primaryColor
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Secondary Colour input */}
                                        <div className="col-md-6">
                                            <ColorPicker
                                                placeholder="Pick secondary colour"
                                                label="Secondary Colour"
                                                icon="os-icon-email-2-at2"
                                                initColor={editSchool.secondaryColor}
                                                initVal={editSchool.secondaryColor}
                                                onChange={(secondaryColor: string) => {
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        secondaryColor
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label>Logo</label>
                                            <ImageUpload
                                                title="Browse for Logo"
                                                onData={(logo: string) =>
                                                    SetEditSchool({
                                                        ...editSchool,
                                                        logo
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <LoadingState loading={uLoading} />
                                    <div className="buttons-w my-4">
                                        <button className="btn btn-primary px-5" type="submit">
                                            <span className="os-icon os-icon-save mr-2"></span>
                                            Update School
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SchoolProfile;
