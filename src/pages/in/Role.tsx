/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
// import Select from "react-select";
import IconInput from "../partials/IconInput";
import { authService } from "../../services/Auth.Service";
import { NEW_ROLE, GET_ROLES, REMOVE_ROLE, UPDATE_ROLE } from "../../queries/Role.query";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { IMessage } from "../../models/IMessage";
import { IProps } from "../../models/IProps";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";

const Role: FC<IProps> = ({ history }) => {
    const [newRole, SetNewRole] = useState<any>({});
    const [message, SetMessage] = useState<IMessage>();
    const [lMessage, SetLMessage] = useState<IMessage>();

    const [rMessage, SetRMessage] = useState<IMessage>();
    const [uMessage, SetUMessage] = useState<IMessage>();
    const [editRole, SetEditRole] = useState<any>({});

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    const scrollTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    // Create New Role
    const [NewRole, { loading }] = useMutation(NEW_ROLE, {
        onError: (err) =>
            SetMessage({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            SetMessage({
                message: data.NewRole.message,
                failed: false,
            });
        },
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: GET_ROLES,
            });

            q.GetRoles.docs.unshift(data.NewRole.doc);

            //update
            cache.writeQuery({
                query: GET_ROLES,
                data: { GetRoles: q.GetRoles },
            });
        },
    });

    const { loading: lLoading, data: lData } = useQuery(GET_ROLES, {
        onError: (err) =>
            SetLMessage({
                message: err.message,
                failed: true,
            }),
    });

    // Remove Role
    const [RemoveRole, { loading: rLoading }] = useMutation(REMOVE_ROLE, {
        onError: (err) =>
            SetRMessage({
                message: err.message,
                failed: true,
            }),
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: GET_ROLES,
            });

            const index = q.GetRoles.docs.findIndex((i: any) => i.id === data.RemoveRole.doc.id);

            q.GetRoles.docs.splice(index, 1);

            //update
            cache.writeQuery({
                query: GET_ROLES,
                data: { GetRoles: q.GetRoles },
            });
        },
    });

    // Update Role
    const [UpdateRole, { loading: uLoading }] = useMutation(UPDATE_ROLE, {
        onError: (err) =>
            SetUMessage({
                message: err.message,
                failed: true,
            }),
        onCompleted: (data) => {
            SetUMessage({
                message: data.UpdateRole.message,
                failed: false,
            });
        },
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: GET_ROLES,
            });

            const index = q.GetRoles.docs.findIndex((i: any) => i.id === data.UpdateRole.doc.id);

            q.GetRoles.docs.splice(index, 1);
            q.GetRoles.docs.unshift(data.UpdateRole.doc);

            //update
            cache.writeQuery({
                query: GET_ROLES,
                data: { GetTRoles: q.GetTRoles },
            });
        },
    });

    return (
        <>
            <Helmet>
                <title>Role | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <h5 className="element-header">Role</h5>
                                <div className="element-box">
                                    <h6 className="element-header">New Role</h6>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <AlertMessage message={message?.message} failed={message?.failed} />
                                            <LoadingState loading={loading} />
                                            <form
                                                onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    SetMessage(undefined);
                                                    await NewRole({
                                                        variables: {
                                                            name: newRole?.name,
                                                            desc: newRole?.desc,
                                                        },
                                                    });
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-12 col-md-6">
                                                        <IconInput
                                                            placeholder="Enter Role name"
                                                            label="Name"
                                                            icon="os-icon-phone"
                                                            required={true}
                                                            type="text"
                                                            onChange={(name: string) => {
                                                                SetNewRole({
                                                                    ...newRole,
                                                                    name,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="form-group">
                                                            <label> Description </label>
                                                            <textarea
                                                                className="form-control"
                                                                placeholder="Enter description"
                                                                onChange={({ currentTarget }) => {
                                                                    SetNewRole({
                                                                        ...newRole,
                                                                        desc: currentTarget.value,
                                                                    });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary" type="submit">
                                                    Save New
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                {/* Role List */}
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12 mt-5">
                                        <LoadingState loading={lLoading || rLoading} />
                                        <AlertMessage message={lMessage?.message} failed={lMessage?.failed} />
                                        {lData && lData.GetRoles.docs.length > 0 && (
                                            <div className="element-box-tp">
                                                <div className="table-responsive">
                                                    <table className="table table-padded">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Name</th>
                                                                <th>Description</th>
                                                                <th className="text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {lData.GetRoles.docs.map((role: any, index: number) => (
                                                                <tr>
                                                                    <td>
                                                                        <strong>{index + 1}</strong>
                                                                    </td>
                                                                    <td>{role.name}</td>
                                                                    <td>{role.desc}</td>
                                                                    <td className="row-actions text-center">
                                                                        <a
                                                                            href="#"
                                                                            title="Edit"
                                                                            onClick={() => {
                                                                                SetUMessage(undefined);
                                                                                SetEditRole({
                                                                                    id: role.id,
                                                                                    name: role.name,
                                                                                    desc: role.desc,
                                                                                });
                                                                                if (editRole) {
                                                                                    setTimeout(() => {
                                                                                        document.getElementById("btnModal")?.click();
                                                                                    }, 0);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <i className="os-icon os-icon-edit"></i>
                                                                        </a>
                                                                        <a
                                                                            className="danger"
                                                                            href="#"
                                                                            title="Delete"
                                                                            onClick={async () => {
                                                                                let del = window.confirm(`Are you sure you want to delete "${role.name}"?`);
                                                                                if (del) {
                                                                                    await RemoveRole({
                                                                                        variables: {
                                                                                            id: role.id,
                                                                                        },
                                                                                    });
                                                                                }
                                                                            }}
                                                                        >
                                                                            <i className="os-icon os-icon-ui-15"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Hidden button to lunch edit modal */}
                                                <button type="button" id="btnModal" data-target="#editModal" data-toggle="modal" style={{ display: "none" }}></button>
                                                {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Navigation Group found!</h2>
                      </div> */}
                                            </div>
                                        )}
                                        {lData && lData.GetRoles.docs.length === 0 && (
                                            <div className="text-center pt-5 fade-in">
                                                <h3 className="text-danger"> No Role record found!</h3>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Role Modal */}
            {editRole && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Edit Role <hr />
                                </h5>

                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body element-box no-shadow pb-2">
                                <LoadingState loading={uLoading} />
                                <AlertMessage message={uMessage?.message} failed={uMessage?.failed} />
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        // Scroll to top of page
                                        scrollTop();
                                        SetUMessage(undefined);
                                        UpdateRole({
                                            variables: {
                                                id: editRole?.id,
                                                name: editRole?.name,
                                                desc: editRole?.desc,
                                            },
                                        });
                                    }}
                                >
                                    <div className="row">
                                        {/* Role name input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter Role name"
                                                label="Role"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={editRole?.name}
                                                onChange={(name: string) => {
                                                    SetEditRole({
                                                        ...editRole,
                                                        name,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Role description input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label> Description </label>
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Enter description"
                                                    value={editRole?.desc}
                                                    onChange={({ currentTarget }) => {
                                                        SetEditRole({
                                                            ...editRole,
                                                            desc: currentTarget.value,
                                                        });
                                                    }}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buttons-w mb-5">
                                        <button className="btn btn-primary px-3" type="submit">
                                            Update Role
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

export default Role;
