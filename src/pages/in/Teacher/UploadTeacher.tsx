import React, { useState } from "react";
import Helmet from "react-helmet";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAppName } from "../../../context/App";
import axios from "axios";
import LoadingState from "../../partials/loading";
import { authService } from "../../../services/Auth.Service";

const UploadTeacherForm = () => {
    // local state
    const [record, setRecord] = useState<any>({});
    const [filename, setFilename] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<any>();

    return (
        <>
            <Helmet>
                <title>Upload New Teacher File | {GetAppName()}</title>
            </Helmet>
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <NavLink to="/in/dashboard">Home</NavLink>
                </li>
                <li className="breadcrumb-item">
                    <NavLink to="/in/teacher-list">Teachers</NavLink>
                </li>
                <li className="breadcrumb-item">
                    <span>Upload New Teacher </span>
                </li>
            </ul>

            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">Upload Teacher File</h5>

                        <div className="row justify-content-center element-box no-bg bg-white" style={{ minHeight: "70vh" }}>
                            <div className="col-lg-10 pt-5">
                                <form
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const token = authService.GetToken();
                                        // build data
                                        let formData = new FormData();
                                        formData.append("file", file);
                                        formData.append("model", JSON.stringify(record));
                                        // post data
                                        setLoading(true);
                                        try {
                                            const result = await axios({
                                                method: "POST",
                                                url: "https://potto-api.netlify.app/.netlify/functions/upload-teacher-record",
                                                data: formData,
                                                headers: { authorization: token ? `Bearer ${token}` : "" },
                                            });
                                            setLoading(false);
                                            if (result.status === 200) {
                                                const data = JSON.parse(result.data);
                                                toast.success(data.message);
                                                setTimeout(() => {
                                                    document.location.href = "/in/teacher-list";
                                                }, 500);
                                            } else toast.error(result.data.message);
                                        } catch (error) {
                                            setLoading(false);
                                            toast.error(error.message);
                                        }
                                    }}
                                >
                                    <h5>Upload Teacher's File</h5>
                                    <div className="form-group  mb-4">
                                        <label className={filename && "text-primary"}>{filename || "Select File (JSON)"}</label>
                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                className="custom-file-input"
                                                accept="application/json"
                                                required
                                                multiple={false}
                                                onChange={async (evt) => {
                                                    if (evt.target.files?.length) {
                                                        setFilename("Selected " + evt.target.files[0].name);
                                                        setFile(evt.target.files[0]);
                                                        // upload service
                                                    } else {
                                                        toast.info("No file selected!");
                                                    }
                                                }}
                                                id="customFile"
                                            />
                                            <label className="custom-file-label" htmlFor="customFile">
                                                Browse File...
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-row mb-4">
                                        <div className="col">
                                            <label htmlFor="fn">Firstname Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="firstname"
                                                id="firstname"
                                                placeholder="enter firstname field from the file"
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="lastname">Lastname Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="lastname"
                                                id="lastname"
                                                placeholder="enter lastname field from the file"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="col">
                                            <label htmlFor="middlename">Middlename Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                className="form-control"
                                                name="middlename"
                                                id="middlename"
                                                placeholder="enter middlename field from the file"
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="phone">Phone number Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="phone"
                                                id="phone"
                                                placeholder="enter phone field from the file"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="col">
                                            <label htmlFor="gender">Gender Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="gender"
                                                id="gender"
                                                placeholder="enter gender field from the file"
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="address">Contact Address Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="address"
                                                id="address"
                                                placeholder="enter address field from the file"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="col">
                                            <label htmlFor="gender">Date of Birth Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="dob"
                                                id="dob"
                                                placeholder="enter dob field from the file"
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="gender">Password Field</label>
                                            <input
                                                type="text"
                                                onChange={({ currentTarget: { value, name } }) => {
                                                    let object: any = {};
                                                    object[name] = value;
                                                    setRecord({ ...record, ...object });
                                                }}
                                                required
                                                className="form-control"
                                                name="password"
                                                id="password"
                                                placeholder="enter password field from the file"
                                            />
                                        </div>
                                    </div>
                                    <LoadingState loading={loading} />
                                    <div className="form-row mb-4 text-right">
                                        <button className="btn btn-primary px-5" type="submit">
                                            Process File
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

export default UploadTeacherForm;
