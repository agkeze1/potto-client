// eslint-disable-next-line
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_PLAN } from "../../../queries/plan.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import LoadingState from "../../partials/loading";

interface IProps {
    items: Array<any>;
    onUpdate?: any;
    onRemove: any;
}

const PlanItems: FC<IProps> = ({ items, onUpdate, onRemove }) => {
    const [model, setModel] = useState<any>(undefined);

    const [updateFunc, { loading }] = useMutation(UPDATE_PLAN, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const { message } = d.UpdatePlan;
            toast.success(message);
        },
    });

    if (items.length)
        return (
            <>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="text-center">School Attendance</th>
                                <th className="text-center">RollCall</th>
                                <th className="text-center">Subject Attendance</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, index: number) => (
                                <tr>
                                    <td>
                                        <strong>{index + 1}</strong>
                                    </td>
                                    <td>
                                        <strong>{item.name}</strong>
                                        <p>{item.desc}</p>
                                    </td>
                                    <td className="text-center">
                                        {item.useSchoolAttendance ? <i className="os-icon os-icon-check text-success"></i> : <i className="os-icon os-icon-close text-danger"></i>}
                                    </td>
                                    <td className="text-center">{item.useRollCall ? <i className="os-icon os-icon-check text-success"></i> : <i className="os-icon os-icon-close text-danger"></i>}</td>
                                    <td className="text-center">
                                        {item.useSubjectAttendance ? <i className="os-icon os-icon-check text-success"></i> : <i className="os-icon os-icon-close text-danger"></i>}
                                    </td>

                                    <td className="row-actions text-center">
                                        <a className="editButton" data-target="#editModal" data-toggle="modal" onClick={() => setModel(item)} href="#" title="Update">
                                            <i className="os-icon os-icon-edit"></i>
                                        </a>
                                        <a className="danger" onClick={() => onRemove(item)} href="#" title="Delete">
                                            <i className="os-icon os-icon-ui-15"></i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div aria-hidden="true" className="modal fade animated" id="editModal" role="dialog">
                    <div className="modal-dialog modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Service Plan</h5>
                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body no-shadow">
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const { id, created_at, __typename, ...rest } = model;
                                        await updateFunc({ variables: { model: rest, id } });
                                        onUpdate(id);
                                    }}
                                >
                                    <div className="form-group">
                                        <label htmlFor="name">Name *</label>
                                        <input
                                            defaultValue={model?.name}
                                            onChange={({ currentTarget: { value } }) => setModel({ ...model, name: value })}
                                            type="text"
                                            placeholder="enter plan name"
                                            required
                                            className="form-control"
                                            name="name"
                                            id="name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Description *</label>
                                        <textarea
                                            defaultValue={model?.desc}
                                            onChange={({ currentTarget: { value } }) => setModel({ ...model, desc: value })}
                                            className="form-control"
                                            required
                                            name="desc"
                                            id="desc"
                                            rows={2}
                                        ></textarea>
                                    </div>
                                    <h6 className="element-header">Select Options</h6>

                                    <ul className="list-group list-group-flush switch-container">
                                        <li className="list-group-item">
                                            Allow school to take <strong>School attendance</strong>
                                            <label className="switch ">
                                                <input
                                                    defaultChecked={model?.useSchoolAttendance}
                                                    onChange={({ currentTarget: { checked } }) => setModel({ ...model, useSchoolAttendance: checked })}
                                                    type="checkbox"
                                                    className="success"
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </li>
                                        <li className="list-group-item">
                                            Allow school to take <strong>RollCall attendance</strong>
                                            <label className="switch ">
                                                <input
                                                    defaultChecked={model?.useRollCall}
                                                    onChange={({ currentTarget: { checked } }) => setModel({ ...model, useRollCall: checked })}
                                                    type="checkbox"
                                                    className="success"
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </li>
                                        <li className="list-group-item">
                                            Allow school to take <strong>Subject attendance</strong>
                                            <label className="switch ">
                                                <input
                                                    defaultChecked={model?.useSubjectAttendance}
                                                    onChange={({ currentTarget: { checked } }) => setModel({ ...model, useSubjectAttendance: checked })}
                                                    type="checkbox"
                                                    className="success"
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </li>
                                    </ul>
                                    <div className="form-group mt-5 text-right">
                                        <button type="submit" className="btn btn-primary">
                                            Update <i className="os-icon os-icon-arrow-right7"></i>
                                        </button>
                                    </div>
                                    <LoadingState loading={loading} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    return (
        <div className="fade-in text-center pb-5" style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img style={{ width: "20em" }} className="no-scale" src="/images/3.png" alt="404" />
            <h4 className="text-info mb-2">Record Not found!</h4>
            <p>No Service plan available. Click on "New Plan" to add one.</p>
        </div>
    );
};

export default PlanItems;
