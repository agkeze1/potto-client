/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import AdminList from "./items";
import NewSuperAdmin from "./create";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_SUPER_ADMINS, NEW_SUPER_ADMIN, UPDATE_USER } from "../../../queries/User.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import IconInput from "../../partials/IconInput";
import Select from "react-select";
import { User } from "../../../models/User.model";

const SuperAdmin = () => {
    const title = "Super Admin";
    const [newForm, setNew] = useState(false);
    const [item, setItem] = useState<User>();

    const { loading, data, refetch } = useQuery(GET_SUPER_ADMINS, {
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
    });

    const [createFunc, { loading: cLoading }] = useMutation(NEW_SUPER_ADMIN, {
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.NewSuperAdmin) {
                toast.success(d.NewSuperAdmin.message);
                setNew(false);
                await refetch();
            }
        },
    });

    const [updateFunc, { loading: uLoading }] = useMutation(UPDATE_USER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.UpdateUser) {
                toast.success(d.UpdateUser.message);
            }
        },
    });
    return (
        <>
            <Helmet>
                <title>
                    {title}| {GetAppName()}
                </title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <span className="element-actions mt-n2">
                            <button className="btn btn-primary" onClick={() => setNew(!newForm)} type="button">
                                Create New
                            </button>
                        </span>
                        <h5 className="element-header">{title}</h5>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 pt-5">
                                <div className="element-box-tp">
                                    <LoadingState loading={loading || cLoading} />
                                    {newForm && (
                                        <div className="fade-in">
                                            <NewSuperAdmin
                                                onSubmit={async (item: any) => {
                                                    const { confirm, ...model } = item;
                                                    await createFunc({ variables: { model } });
                                                }}
                                                onCancel={() => {
                                                    setNew(false);
                                                    document.body.scrollTop = 0;
                                                    document.documentElement.scrollTop = 0;
                                                }}
                                            />
                                        </div>
                                    )}

                                    {!newForm && (
                                        <div className="fade-in">
                                            {data && (
                                                <AdminList
                                                    items={data.GetSuperAdmins.docs}
                                                    onEdit={(item: any) => {
                                                        setItem(item);
                                                        document.body.scrollTop = 0;
                                                        document.documentElement.scrollTop = 0;
                                                    }}
                                                    onRemove={() => {
                                                        toast.info("Super Admin Removal Coming soon!");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {item && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Update Account <hr />
                                </h5>

                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body pb-2">
                                <LoadingState loading={uLoading} />
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        // Scroll to top of page
                                        const { id, name, gender, phone } = item;
                                        await updateFunc({ variables: { id, model: { name, gender, phone } } });
                                    }}
                                >
                                    <div className="row">
                                        {/* Name input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter name"
                                                label="Name"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={item?.name}
                                                onChange={(name: string) => {
                                                    setItem({
                                                        ...item,
                                                        name,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Phone number input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter Phone number"
                                                label="Phone number"
                                                icon="os-icon-phone"
                                                required={true}
                                                type="text"
                                                initVal={item.phone}
                                                onChange={(phone: string) => {
                                                    setItem({
                                                        ...item,
                                                        phone,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Gender input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="departmental">Gender</label>
                                                <Select
                                                    options={[
                                                        { label: "Male", value: "Male" },
                                                        { label: "Female", value: "Female" },
                                                    ]}
                                                    value={{
                                                        label: item.gender,
                                                        value: item.gender,
                                                    }}
                                                    onChange={(i: any) => {
                                                        setItem({
                                                            ...item,
                                                            gender: i.label,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 buttons-w mt-3 mb-5">
                                            <button className="btn btn-primary px-5 mt-3" type="submit">
                                                Update Account
                                            </button>
                                        </div>
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

export default SuperAdmin;
