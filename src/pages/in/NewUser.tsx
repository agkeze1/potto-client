import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { IProps } from "../../models/IProps";
import { GetAppName } from "../../context/App";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import Dropdown from "../partials/Dropdown";
import SwitchInput from "../partials/SwitchInput";
import { NEW_USER } from "../../queries/User.query";
import { GET_ROLES } from "../../queries/Role.query";
import { authService } from "../../services/Auth.Service";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gender from "../../data/gender.json";
import LoadingState from "../partials/loading";
import Select from "react-select";
import NotifyProvider from "../../events/event-resolver";
import { ACTION_EVENT } from "./../../events/index";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../context/App";

const NewUser: FC<IProps> = ({ history }) => {
    const [record, SetRecord] = useState<any>();
    const [roles, SetRoles] = useState<any>([]);
    const [isAdmin, SetIsAdmin] = useState<boolean>(true);

    // for confirm password
    const [bdrClass, SetBdrClass] = useState<string>();
    const [cPassword, SetCPassword] = useState<string>();

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Get Roles for Role input
    const { loading: rLoading, data: rData } = useQuery(GET_ROLES, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: () => {
            if (rData && rData.GetRoles) {
                SetRoles(
                    rData.GetRoles.docs.map((role: any) => ({
                        label: role.name,
                        value: role.id,
                    }))
                );
            }
        },
    });

    // New User Mutation
    const [NewUser, { loading }] = useMutation(NEW_USER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            history.push("/in/user-list");
            NotifyProvider.NotifyAll({
                content: { id: d.NewUser.doc.id },
                action: ACTION_EVENT.USER.CREATED,
            });
        },
    });

    return (
        <>
            <Helmet>
                <title>New User | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">New User</h5>

                        <div className="row justify-content-center element-box">
                            <div className="col-lg-10 pt-5">
                                <div className="element-actions" style={{ marginTop: "-20px" }}>
                                    <SwitchInput
                                        isOn={isAdmin}
                                        handleToggle={() => {
                                            SetIsAdmin(!isAdmin);
                                        }}
                                        label="Is Admin?"
                                    />
                                </div>
                                <h5 className="element-header">Basic Information</h5>
                                <LoadingState loading={loading} />
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        //Check password match before submitting form
                                        if (cPassword && cPassword !== record?.password) {
                                            SetBdrClass("bdr-danger");
                                        } else {
                                            if (isAdmin && record?.roles) {
                                                SetRecord({
                                                    ...record,
                                                    roles: undefined,
                                                });
                                            }
                                            await NewUser({
                                                variables: {
                                                    model: {
                                                        ...record,
                                                        admin: isAdmin,
                                                    },
                                                },
                                            });
                                        }
                                    }}
                                >
                                    {/* Fullname input */}
                                    <IconInput
                                        placeholder="Enter fullname"
                                        label="Full Name"
                                        icon="os-icon-user-male-circle"
                                        required={true}
                                        type="text"
                                        onChange={(name: string) => {
                                            SetRecord({
                                                ...record,
                                                name,
                                            });
                                        }}
                                    />

                                    <div className="row">
                                        {/* Email input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter email"
                                                label="Email"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="email"
                                                onChange={(email: string) => {
                                                    SetRecord({
                                                        ...record,
                                                        email,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Phone input */}
                                        <div className="col-sm-6">
                                            <IconInput
                                                placeholder="Enter phone number"
                                                label="Phone Number"
                                                icon="os-icon-phone"
                                                required={true}
                                                type="text"
                                                onChange={(phone: string) => {
                                                    SetRecord({
                                                        ...record,
                                                        phone,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Gender input */}
                                        <div className={isAdmin ? "col-sm-12" : "col-sm-6"}>
                                            <Dropdown
                                                items={gender.gender}
                                                onSelect={(item: any) => {
                                                    SetRecord({
                                                        ...record,
                                                        gender: item.label,
                                                    });
                                                }}
                                                label="Gender"
                                            />
                                        </div>
                                        {!isAdmin && (
                                            // Role input
                                            <div className="col-sm-6">
                                                <label htmlFor="">Roles</label>
                                                <br />
                                                <Select
                                                    options={roles}
                                                    isMulti={true}
                                                    onChange={(items: any) => {
                                                        SetRecord({
                                                            ...record,
                                                            roles: items.map((i: any) => i.value),
                                                        });
                                                    }}
                                                    label="Role"
                                                    icon="phone"
                                                />
                                                <LoadingState loading={rLoading} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            {/* Password input */}
                                            <IconInput
                                                placeholder="Enter password"
                                                label="Password"
                                                icon="os-icon-ui-09"
                                                required={true}
                                                type="password"
                                                onChange={(password: string) => {
                                                    SetRecord({
                                                        ...record,
                                                        password,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            {/* Confirm password input */}
                                            <IconInput
                                                placeholder="Re-enter password"
                                                label="Confirm password"
                                                icon="os-icon-ui-09"
                                                required={true}
                                                type="password"
                                                classStyle={bdrClass}
                                                onChange={(cPass: string) => {
                                                    SetCPassword(cPass);
                                                    if (cPass !== record?.password) {
                                                        SetBdrClass("bdr-danger");
                                                    } else {
                                                        SetBdrClass("");
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <label>Passport</label>
                                    <ImageUpload
                                        title="Browse picture..."
                                        onData={(path: string) =>
                                            SetRecord({
                                                ...record,
                                                image: path,
                                            })
                                        }
                                    />
                                    <div className="buttons-w mt-3 mb-5">
                                        <button className="btn btn-primary px-5 mt-3" type="submit">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUser;
