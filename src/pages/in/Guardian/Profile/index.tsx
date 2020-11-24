// eslint-disable-next-line
import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import LoadingState from "../../../partials/loading";
import { IProps } from "../../../../models/IProps";
import { toast } from "react-toastify";
import { GET_GUARDIAN, UPDATE_GUARDIAN } from "../../../../queries/Student.query";
import BasicInfo from "./BasicInfo";
import LargeImage from "../../partials/LargeImage";
import IconInput from "../../../partials/IconInput";
import Select from "react-select";
import state from "../../../../data/state.json";
import gender from "../../../../data/gender.json";
import titles from "../../../../data/title.json";
import ImageUpload from "../../../partials/ImageUpload";
import { GET_GUARDIAN_TYPES } from "../../../../queries/Guardian.query";

const GuardianProfile: FC<IProps> = ({ history, match }) => {
    const [guardian, SetGuardian] = useState<any>();
    const [editGuardian, SetEditGuardian] = useState<any>();
    const [guardianTypes, SetGuardianTypes] = useState<any>();
    const [showGTypeRefresh, SetShowGTypeRefresh] = useState<boolean>(false);
    const [locals, SetLocals] = useState<any>([]);

    //   Guardian Id from match object passed
    const { id } = match.params;

    //   Get Guardian with id passed
    const { loading } = useQuery(GET_GUARDIAN, {
        variables: {
            id,
        },
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            if (data) {
                SetGuardian(data.GetGuardian.doc);
            }
        },
        fetchPolicy: "network-only",
    });

    // Get Guardian Types for GuardianTypes input
    const { loading: gTypeLoading, refetch: gTRefetch } = useQuery(GET_GUARDIAN_TYPES, {
        onError: (err) => {
            toast.error(CleanMessage(err.message));
            SetShowGTypeRefresh(true);
        },
        onCompleted: (data) => {
            if (data && data.GetGuardianTypes) {
                SetGuardianTypes(
                    data.GetGuardianTypes.docs.map((type: any) => ({
                        label: type.name,
                        value: type.id,
                    }))
                );
            }
        },
        notifyOnNetworkStatusChange: true,
    });

    const [UpdateGuardian, { loading: uLoading }] = useMutation(UPDATE_GUARDIAN, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            toast.success(CleanMessage(data.UpdateGuardian.message));
            SetGuardian(data.UpdateGuardian.doc);
        },
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
                            <h5 className="element-header tracking-in-contract">Guardian Profile</h5>
                            <LoadingState loading={loading} />
                            {guardian && (
                                <div className="element-box ">
                                    <div>
                                        <a
                                            href="javascript:void(0)"
                                            title="Edit"
                                            className="icon-lg m-3 float-right"
                                            onClick={() => {
                                                SetEditGuardian({
                                                    title: guardian.title,
                                                    name: guardian.name,
                                                    gender: guardian.gender,
                                                    email: guardian.email,
                                                    phone: guardian.phone,
                                                    hometown: guardian.hometown,
                                                    address: guardian.address,
                                                    state: guardian.state,
                                                    lga: guardian.lga,
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
                                    <div className="text-center mb-5 mt-3">
                                        {/* Profile Picture */}
                                        <LargeImage imgPath={guardian.image} />

                                        <h4 className="up-header text-uppercase mt-3">{guardian.full_name}</h4>
                                        <h6 className="up-sub-header text-uppercase text-primary">{guardian.type?.name}</h6>
                                    </div>
                                    <div className="os-tabs-w">
                                        <div className="os-tabs-controls">
                                            <ul className="nav nav-tabs smaller">
                                                <li className="nav-item text-uppercase">
                                                    <a className="nav-link active" data-toggle="tab" href="#basic-info">
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

            {/* Hidden button to lunch edit modal */}
            <button
                type="button"
                id="btnModal"
                data-target="#editModal"
                data-toggle="modal"
                style={{
                    display: "none",
                }}
            ></button>

            {/* Edit Guardian Modal */}
            {editGuardian && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Edit Guardian Info <hr />
                                </h5>
                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body element-box no-shadow pb-2">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        UpdateGuardian({
                                            variables: {
                                                id,
                                                model: editGuardian,
                                            },
                                        });
                                    }}
                                >
                                    <div className="row">
                                        {/* Title input */}
                                        <div className="col-md-6">
                                            <label>Title</label>
                                            <Select
                                                className="mb-3"
                                                options={titles.titles.map((title: any) => ({
                                                    label: title.label,
                                                    value: title.value,
                                                }))}
                                                value={{
                                                    label: editGuardian.title || <span className="text-gray">Select...</span>,
                                                    value: editGuardian.title,
                                                }}
                                                onChange={(item: any) =>
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        title: item.label,
                                                    })
                                                }
                                                icon="phone"
                                            />
                                        </div>
                                        {/* Name input */}
                                        <div className="col-md-6">
                                            <IconInput
                                                placeholder="Enter name"
                                                label="Name"
                                                icon="os-icon-file-text"
                                                required={true}
                                                type="text"
                                                initVal={editGuardian.name}
                                                onChange={(name: string) => {
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        name,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Relationship input */}
                                        <div className="col-md-6">
                                            <label>Relationship</label>
                                            <Select
                                                className="mb-3"
                                                options={guardianTypes.map((rel: any) => ({
                                                    label: rel.label,
                                                    value: rel.value,
                                                }))}
                                                value={{
                                                    label: editGuardian.type || <span className="text-gray">Select...</span>,
                                                    value: editGuardian.type,
                                                }}
                                                onChange={(item: any) => {
                                                    // SetEditGuardian({
                                                    //   ...editGuardian,
                                                    //   type: item.value,
                                                    // });
                                                }}
                                                icon="phone"
                                            />
                                            {showGTypeRefresh && (
                                                <button
                                                    onClick={() => {
                                                        SetShowGTypeRefresh(false);
                                                        gTRefetch();
                                                    }}
                                                    className="btn btn-primary btn-sm px-1 mb-2"
                                                    type="button"
                                                >
                                                    Reload Type
                                                </button>
                                            )}
                                            <LoadingState loading={gTypeLoading} />
                                        </div>
                                        {/* Gender input */}
                                        <div className="col-md-6">
                                            <label>Gender</label>
                                            <Select
                                                className="mb-3"
                                                options={gender.gender.map((item: any) => ({
                                                    label: item.label,
                                                    value: item.value,
                                                }))}
                                                value={{
                                                    label: editGuardian.gender || <span className="text-gray">Select...</span>,
                                                    value: editGuardian.gender,
                                                }}
                                                onChange={(item: any) =>
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        gender: item.label,
                                                    })
                                                }
                                                label="Gender"
                                                icon="phone"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Phone number input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter phone number"
                                                label="Phone Number"
                                                icon="os-icon-ui-09"
                                                required={true}
                                                type="text"
                                                initVal={editGuardian.phone}
                                                onChange={(email: string) =>
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        email,
                                                    })
                                                }
                                            />
                                        </div>
                                        {/* Email input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter email"
                                                label="Email"
                                                icon="os-icon-ui-09"
                                                required={false}
                                                type="text"
                                                initVal={editGuardian.phone}
                                                onChange={(email: string) =>
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        email,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* State of Origin input */}
                                        <div className="col-sm-6">
                                            <label>State of Origin</label>
                                            <Select
                                                className="mb-3"
                                                options={state.map((item: any, index: number) => ({
                                                    label: item.state.name,
                                                    value: index + "",
                                                }))}
                                                value={{
                                                    label: editGuardian.state || <span className="text-gray">Select...</span>,
                                                    value: editGuardian.state,
                                                }}
                                                onChange={(item: any) => {
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        state: item.label,
                                                    });
                                                    SetLocals(
                                                        state[item.value].state.locals.map((item: any) => ({
                                                            label: item.name,
                                                            value: item.name,
                                                        }))
                                                    );
                                                }}
                                                label="State of Origin"
                                                icon="phone"
                                            />
                                        </div>
                                        {/* LGA */}
                                        <div className="col-sm-6">
                                            <label>LGA</label>
                                            <Select
                                                className="mb-3"
                                                options={locals}
                                                value={{
                                                    label: editGuardian.lga || <span className="text-gray">Select...</span>,
                                                    value: editGuardian.lga,
                                                }}
                                                onChange={(item: any) =>
                                                    SetEditGuardian({
                                                        ...editGuardian,
                                                        lga: item.label,
                                                    })
                                                }
                                                label="LGA"
                                                icon="phone"
                                            />
                                        </div>
                                    </div>

                                    {/* Hometown input */}
                                    <IconInput
                                        placeholder="Enter Hometown"
                                        label="Hometown"
                                        icon="os-icon-ui-09"
                                        required={true}
                                        type="text"
                                        initVal={editGuardian.hometown}
                                        onChange={(hometown: string) =>
                                            SetEditGuardian({
                                                ...editGuardian,
                                                hometown,
                                            })
                                        }
                                    />

                                    {/* Address input */}
                                    <IconInput
                                        placeholder="Enter address"
                                        label="Address"
                                        icon="os-icon-ui-09"
                                        required={true}
                                        type="text"
                                        initVal={editGuardian.address}
                                        onChange={(address: string) =>
                                            SetEditGuardian({
                                                ...editGuardian,
                                                address,
                                            })
                                        }
                                    />
                                    {/* Profile picture */}
                                    <label>Profile picture</label>
                                    <ImageUpload
                                        title="Browse for picture"
                                        onData={(logo: string) => {
                                            // SetEditGuardian({
                                            //   ...editGuardian,
                                            //   logo,
                                            // });
                                        }}
                                    />
                                    <LoadingState loading={uLoading} />
                                    <div className="buttons-w my-4">
                                        <button className="btn btn-primary px-5" type="submit">
                                            <span className="os-icon os-icon-save mr-2"></span>
                                            Update Guardian
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

export default GuardianProfile;
