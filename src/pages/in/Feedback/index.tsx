/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import Select from "react-select";
import FeedbackList from "./items";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_FEEDBACKS, RESOLVE_FEEDBACK } from "../../../queries/feedback.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import Pagination from "../../partials/Pagination";
import { useMutation } from "@apollo/react-hooks";

const Feedback = () => {
    const [types, setTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [type, setType] = useState<string>();

    const [content, setContent] = useState<string>();

    const [fetchFunc, { loading, data, refetch }] = useLazyQuery(GET_FEEDBACKS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTypes(d.GetFeedbackTypes.docs.map((item: any) => ({ value: item.id, label: item.name })));
        },
    });

    const [resolveFunc, { loading: rLoading }] = useMutation(RESOLVE_FEEDBACK, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            toast.success(d.ResolveFeedback.message);
            await refetch();
        },
    });

    useEffect(() => {
        fetchFunc({ variables: { type, page, limit } });
    }, [type, fetchFunc, page, limit]);
    return (
        <>
            <Helmet>
                <title>Feedback | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <h5 className="element-header">Feedback</h5>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group">
                                                    <label htmlFor="departmental">Filter Feedback Type</label>
                                                    <Select isMulti={false} onChange={(item: any) => setType(item.value)} options={types} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <button
                                                    onClick={() => {
                                                        if (type) setType("");
                                                    }}
                                                    className="btn btn-primary mt-4"
                                                >
                                                    Reset filter
                                                </button>
                                            </div>
                                        </div>
                                        <div className="element-box-tp">
                                            <LoadingState loading={loading || rLoading} />
                                            {data && (
                                                <FeedbackList
                                                    onView={(item: any) => setContent(item.content)}
                                                    onResolve={async (i: any) => {
                                                        if (window.confirm("Are you sure you want to proceed?")) {
                                                            await resolveFunc({ variables: { id: i.id } });
                                                        }
                                                    }}
                                                    items={data.GetFeedbacks.docs}
                                                />
                                            )}
                                        </div>
                                        {data && data.GetFeedbacks.totalDocs > 0 && (
                                            <div className="element-box fade-in">
                                                <Pagination onPageClicked={(page: number) => setPage(page)} {...data.GetFeedbacks} length={data.GetFeedbacks.docs.length} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback ContentModal Modal */}
            <div aria-hidden="true" className="modal fade" id="ContentModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Feedback Content</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> ×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
