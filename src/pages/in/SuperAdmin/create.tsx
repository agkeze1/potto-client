import React, { FC, useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../../context/App";
import IconInput from "../../partials/IconInput";
import ImageUpload from "../../partials/ImageUpload";
import { toast } from "react-toastify";
import Select from "react-select";

interface iProp {
    onSubmit: any;
    onCancel: any;
}

const NewSuperAdmin: FC<iProp> = ({ onCancel, onSubmit }) => {
    const [model, SetModel] = useState<any>({});
    return (
        <>
            <Helmet>
                <title>New Super Admin | {GetAppName()}</title>
            </Helmet>
            <div className="element-wrapper">
                <div className="row justify-content-center element-box">
                    <div className="col-lg-10 pt-5">
                        <h5 className="element-header">New Super Admin Form</h5>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (model.password !== model.confirm) {
                                    toast.warn("Password do not match!");
                                    return;
                                } else {
                                    onSubmit(model);
                                }
                            }}
                        >
                            {/* Full name input */}
                            <IconInput
                                placeholder="Enter full name"
                                label="Full Name"
                                icon="os-icon-user-male-circle"
                                required={true}
                                type="text"
                                onChange={(name: string) => SetModel({ ...model, name })}
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
                                        name="email"
                                        onChange={(email: string) => SetModel({ ...model, email })}
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
                                        name="phone"
                                        onChange={(phone: string) => SetModel({ ...model, phone })}
                                    />
                                </div>
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
                                        onChange={(password: string) => SetModel({ ...model, password })}
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
                                        onChange={(password: string) => SetModel({ ...model, confirm: password })}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="gender"> Gender</label>
                                        <Select
                                            id="gender"
                                            onChange={(item: any) => SetModel({ ...model, gender: item.label })}
                                            options={[
                                                { label: "Male", value: "1" },
                                                { label: "Female", value: "2" },
                                            ]}
                                            isMulti={false}
                                            placeholder="Select Gender"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label>Passport</label>
                                    <ImageUpload
                                        title="Browse Picture..."
                                        onData={(path: string) =>
                                            SetModel({
                                                ...model,
                                                image: path,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="buttons-w mt-3 mb-5">
                                <button className="btn btn-primary px-5 mt-3" type="submit">
                                    Save <i className="os-icon os-icon-save"></i>
                                </button>
                                <button onClick={onCancel} className="btn btn-danger px-5 mt-3" type="button">
                                    Cancel <i className="os-icon os-icon-cancel-circle"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewSuperAdmin;
