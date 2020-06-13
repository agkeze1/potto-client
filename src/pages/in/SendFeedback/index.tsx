import React, { useState } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import Select from "react-select";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_FEEDBACK_TYPES } from "../../../queries/feedback.type.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import { SEND_FEEDBACK } from "../../../queries/feedback.query";

const SendFeedback = () => {
    const title = "Send Feedback";
    const [types, setTypes] = useState([]);
    const [model, setModel] = useState({ subject: "", type: "", content: "" });

    const { loading } = useQuery(GET_FEEDBACK_TYPES, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTypes(
                d.GetFeedbackTypes.docs.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                }))
            );
        },
    });

    const [sendFunc, { loading: sLoading }] = useMutation(SEND_FEEDBACK, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.NewFeedback.message);
            setModel({ content: "", type: "", subject: "" });
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
                        <div className="row justify-content-center">
                            <div className="col-md-10 col012">
                                <div className="element-box" style={{ minHeight: "520px" }}>
                                    <h5 className="element-header">{title}</h5>
                                    <LoadingState loading={loading} />
                                    <form
                                        onSubmit={async (event) => {
                                            event.preventDefault();

                                            await sendFunc({ variables: { model } });
                                        }}
                                    >
                                        <LoadingState loading={sLoading} />
                                        <div className="form-group">
                                            <label htmlFor="type">Feedback Type</label>
                                            <Select id="type" isMulti={false} onChange={(item: any) => setModel({ ...model, type: item.value })} options={types} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <input
                                                value={model.subject}
                                                onChange={({ currentTarget: { value } }) => setModel({ ...model, subject: value })}
                                                type="text"
                                                required
                                                placeholder="enter subject"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Write your feedback</label>
                                            <textarea
                                                value={model.content}
                                                onChange={({ currentTarget: { value } }) => setModel({ ...model, content: value })}
                                                name="content"
                                                id="content"
                                                required
                                                className="form-control"
                                                rows={10}
                                            ></textarea>
                                        </div>
                                        <div className="form-group text-right">
                                            <button className="btn btn-primary" type="submit">
                                                Send <div className="os-icon os-icon-send"></div>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SendFeedback;
