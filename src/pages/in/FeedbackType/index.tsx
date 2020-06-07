/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import IconInput from "../../partials/IconInput";
import FeedbackTypeList from "./items";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_FEEDBACK_TYPES, NEW_FEEDBACK_TYPE, REMOVE_FEEDBACK_TYPE } from "../../../queries/feedback.type.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";

const FeedbackType = () => {
    const [newModel, setModel] = useState({ name: "" });

    const { data, loading, refetch } = useQuery(GET_FEEDBACK_TYPES, {
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
    });

    const [createFuc, { loading: cLoading }] = useMutation(NEW_FEEDBACK_TYPE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.NewFeedbackType) {
                document.getElementById("openNew")?.click();
                toast.success(d.NewFeedbackType.message);
                await refetch();
                setModel({ name: "" });
            }
        },
    });

    const [RemoveFuc, { loading: rLoading }] = useMutation(REMOVE_FEEDBACK_TYPE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.RemoveFeedbackType) {
                toast.success(d.RemoveFeedbackType.message);
                await refetch();
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Feedback Type | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <span className="element-actions">
                                    <button className="btn btn-primary" id="openNew" data-target="#NewFeedbackTypeModal" data-toggle="modal" type="button">
                                        Create New
                                    </button>
                                </span>
                                <h5 className="element-header">Feedback Type</h5>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12">
                                        <LoadingState loading={loading || rLoading} />
                                        <div className="element-box-tp">
                                            {data && (
                                                <FeedbackTypeList
                                                    onRemove={async (item: any) => {
                                                        if (window.confirm("Are you sure you want to proceed!")) {
                                                            await RemoveFuc({ variables: { id: item.id } });
                                                        }
                                                    }}
                                                    items={data.GetFeedbackTypes.docs}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Feedback Type Modal */}
            <div aria-hidden="true" className="modal fade" id="NewFeedbackTypeModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Feedback Type</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> ×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <LoadingState loading={cLoading} />
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await createFuc({ variables: { name: newModel.name } });
                                }}
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <IconInput
                                            initVal={newModel.name}
                                            placeholder="Enter feedback type"
                                            label="Name"
                                            icon="os-icon-phone"
                                            required={true}
                                            type="text"
                                            onChange={(name: string) => setModel({ ...newModel, name })}
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-primary" type="submit">
                                    Save New
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackType;
