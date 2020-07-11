import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../../context/App";
import "./service.css";
import { NEW_PLAN, GET_PLANS } from "../../../queries/plan.query";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import LoadingState from "../../partials/loading";
import PlanItems from "./items";
import { REMOVE_PLAN } from "./../../../queries/plan.query";

const ServicePlan = () => {
    const title = "Service Plan";

    const [model, setModel] = useState({ name: "", desc: "", useSchoolAttendance: false, useSubjectAttendance: false, useRollCall: false });

    const { loading: getLoading, data, refetch } = useQuery(GET_PLANS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        notifyOnNetworkStatusChange: true,
    });

    const [saveFunc, { loading }] = useMutation(NEW_PLAN, {
        onCompleted: (d) => {
            const { message } = d.NewPlan;
            document.getElementById("newButton")?.click();
            toast.success(message);
            setModel({ name: "", desc: "", useSchoolAttendance: false, useSubjectAttendance: false, useRollCall: false });
        },
        onError: (e) => toast.error(CleanMessage(e.message)),
        update: (cache, { data: { NewPlan } }) => {
            const item: any = cache.readQuery({
                query: GET_PLANS,
            });
            item.GetPlans.docs.unshift(NewPlan.doc);
            cache.writeQuery({
                query: GET_PLANS,
                data: { GetPlans: item.GetPlans },
            });
        },
    });

    const [removeFunc, { loading: removeLoading }] = useMutation(REMOVE_PLAN, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            const { message } = d.RemovePlan;
            toast.success(message);
            await refetch();
        },
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {GetAppName()}
                </title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div className="element-box no-bg bg-white" style={{ minHeight: "80vh" }}>
                            <div className="element-actions">
                                <button id="newButton" title="New " data-target="#newModal" data-toggle="modal" className="btn btn-light text-primary">
                                    <i className="os-icon os-icon-plus"></i> New Plan
                                </button>
                            </div>
                            <h5 className="element-header">{title}</h5>
                            <LoadingState loading={getLoading || removeLoading} />
                            {data && !getLoading && (
                                <PlanItems
                                    onRemove={async (item: any) => {
                                        if (window.confirm("Are you sure you want to proceed?")) {
                                            await removeFunc({ variables: { id: item.id } });
                                        }
                                    }}
                                    onUpdate={() => refetch()}
                                    items={data.GetPlans.docs}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div aria-hidden="true" className="modal fade animated" id="newModal" role="dialog">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Service Plan</h5>
                            <button className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body no-shadow">
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await saveFunc({ variables: { model } });
                                }}
                            >
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        defaultValue={model.name}
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
                                        defaultValue={model.desc}
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
                                                defaultChecked={model.useSchoolAttendance}
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
                                                defaultChecked={model.useRollCall}
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
                                                defaultChecked={model.useSubjectAttendance}
                                                onChange={({ currentTarget: { checked } }) => setModel({ ...model, useSubjectAttendance: checked })}
                                                type="checkbox"
                                                className="success"
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </li>
                                </ul>
                                <div className="form-group mt-5 text-right">
                                    <button disabled={loading} type="submit" className="btn btn-primary">
                                        Save Service Plan <i className="os-icon os-icon-arrow-right7"></i>
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
};
export default ServicePlan;
