import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../../context/App";
import NewGuardianMessage from "./NewMessage";
import GuardianMessageList from "./MessageItems";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_STUDENT_MESSAGE, SEND_STUDENT_MESSAGE } from "../../../queries/student-message.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import LoadingState from "../../partials/loading";
import Pagination from "../../partials/Pagination";
import SingleGuardianMessage from "./SingleMessage";

const GuardianMessage = () => {
    const title = "Guardian Messaging";

    const [newItem, setNewItem] = useState(false);
    const [item, setItem] = useState<any>(undefined);
    const [page, setPage] = useState(1);
    const [limit] = useState(25);

    const { loading, data, fetchMore } = useQuery(GET_STUDENT_MESSAGE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { page, limit },
    });

    const [sendFunc, { loading: sendLoading }] = useMutation(SEND_STUDENT_MESSAGE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d) {
                toast.success(d.SendStudentsMessage.message);
                setNewItem(false);
                setItem(undefined);
            }
        },
        update: (cache, { data: { SendStudentsMessage } }) => {
            // read
            const result: any = cache.readQuery({
                query: GET_STUDENT_MESSAGE,
                variables: { page, limit },
            });
            // update
            result.GetStudentMessageLog.docs.unshift(SendStudentsMessage.doc);
            result.GetStudentMessageLog.totalDocs++;

            // write update back
            cache.writeQuery({
                query: GET_STUDENT_MESSAGE,
                variables: { page, limit },
                data: { GetStudentMessageLog: result.GetStudentMessageLog },
            });
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetStudentMessageLog: fetchMoreResult.GetStudentMessageLog };
            },
        });
    }, [page, limit, fetchMore]);

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
                        <h5 className="element-header">{title}</h5>
                        <LoadingState loading={loading || sendLoading} />
                        <div className="row">
                            {!item && !newItem && data && (
                                <div className="col-12">
                                    <div className="element-box" style={{ minHeight: "450px" }}>
                                        <GuardianMessageList
                                            items={data.GetStudentMessageLog.docs}
                                            onSelect={(item: any) => {
                                                setNewItem(false);
                                                setItem(item);
                                            }}
                                        />
                                    </div>
                                    {data.GetStudentMessageLog.docs.length > 0 && (
                                        <div className="element-box no-bg bg-white fade-in">
                                            <Pagination length={data.GetStudentMessageLog.totalDocs} {...data.GetStudentMessageLog} onPageClicked={(page: number) => setPage(page)} />
                                        </div>
                                    )}
                                </div>
                            )}
                            {!item && newItem && (
                                <div className="col-12 fade-in">
                                    <h6>
                                        <button
                                            onClick={() => {
                                                setNewItem(false);
                                                setItem(undefined);
                                            }}
                                            className="btn btn-default"
                                        >
                                            <i style={{ fontSize: "1.5em" }} className="os-icon os-icon-arrow-left2 text-primary"></i>
                                        </button>
                                        New Message
                                    </h6>
                                    <NewGuardianMessage
                                        onSubmit={async (model: any) => {
                                            await sendFunc({ variables: { model } });
                                        }}
                                    />
                                </div>
                            )}
                            {item && !newItem && (
                                <div className="col-12 fade-in">
                                    <SingleGuardianMessage
                                        item={item}
                                        onBack={() => {
                                            setNewItem(false);
                                            setItem(undefined);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {!newItem && (
                <div className="fab fade-in">
                    <button onClick={() => setNewItem(!newItem)} type="button" className="btn btn-primary btn-round">
                        <i className="os-icon os-icon-users"></i> <span>New Message</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default GuardianMessage;
