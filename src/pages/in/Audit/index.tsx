import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import Helmet from "react-helmet";
import { GET_LOGS } from "../../../queries/audit.query";
import { CleanMessage, GetAppName } from "./../../../context/App";
import { toast } from "react-toastify";
import LoadingState from "./../../partials/loading/index";
import AuditItems from "./items";
import Pagination from "../../partials/Pagination";
import "./audit.css";

const AuditTrail = () => {
    const title = "Audit Trail";

    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [user, setUser] = useState(undefined);
    const [action, setAction] = useState(undefined);

    const [getLogFunc, { loading, data }] = useLazyQuery(GET_LOGS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        notifyOnNetworkStatusChange: true,
        variables: { page, limit, user, action },
    });

    useEffect(() => {
        getLogFunc({ variables: { page, limit, user, action } });
    }, [page, limit, getLogFunc, action, user]);

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
                        <div className="element-box no-bg bg-white" style={{ minHeight: "85vh" }}>
                            <h5 className="element-header">{title}</h5>
                            <LoadingState loading={loading} />
                            {(user || action) && (
                                <div className="flex justify-end mb-3">
                                    {action && <span className="btn btn-light text-primary mr-2">Filter By Action ({action})</span>}
                                    {user && <span className="btn btn-light text-primary mr-2">Filter By User</span>}
                                    <button
                                        onClick={() => {
                                            setAction(undefined);
                                            setUser(undefined);
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {data && (
                                <AuditItems
                                    onUserClicked={(u: any) => {
                                        setUser(u);
                                        setPage(1);
                                    }}
                                    onActionClicked={(a: any) => {
                                        setAction(a);
                                        setPage(1);
                                    }}
                                    items={data.GetAudits.docs}
                                />
                            )}
                            {data && (
                                <div className="col-lg fade-in mt-4">
                                    <Pagination
                                        length={data.GetAudits.docs.length}
                                        {...data.GetAudits}
                                        onPageClicked={(page: number) => {
                                            setPage(page);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuditTrail;
