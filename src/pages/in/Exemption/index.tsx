/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "./../../../context/App";
import NewExemption from "./NewExemption";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { NEW_EXEMPTION, GET_EXEMPTIONS } from "./../../../queries/exemption.query";
import { toast } from "react-toastify";
import ExemptionList from "./ExemptionList";
import LoadingState from "./../../partials/loading/index";
import Pagination from "../../partials/Pagination";
import ExemptionDetails from "./Details";

const Exemption = () => {
    const title = "Attendance Exemption";
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [newItem, setNewItem] = useState(false);
    const [item, setItem] = useState<any>(undefined);

    const { loading: get_Loading, data, fetchMore } = useQuery(GET_EXEMPTIONS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { page, limit },
    });

    const [createFunc, { loading }] = useMutation(NEW_EXEMPTION, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const { doc } = d.NewExemption;
            setItem(doc);
            setNewItem(false);
        },
        update: (cache, { data: { NewExemption } }) => {
            const item: any = cache.readQuery({
                query: GET_EXEMPTIONS,
                variables: { page, limit },
            });
            item.GetExemptions.docs.unshift(NewExemption.doc);
            item.GetExemptions.totalDocs += 1;
            cache.writeQuery({
                variables: { page, limit },
                data: { GetExemptions: item.GetExemptions },
                query: GET_EXEMPTIONS,
            });
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetExemptions: fetchMoreResult.GetExemptions };
            },
        });
    }, [page, limit, fetchMore]);

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
                            {!newItem && !item && (
                                <div className="element-actions">
                                    <button
                                        title="New"
                                        onClick={() => {
                                            setNewItem(!newItem);
                                            setItem(undefined);
                                        }}
                                        className="btn btn-light text-primary"
                                    >
                                        <i className="os-icon os-icon-plus"></i> New Exemption
                                    </button>
                                </div>
                            )}
                            <h5 className="element-header">{title}</h5>
                            {newItem && !item && (
                                <>
                                    <h6 className="element-header">
                                        <a
                                            href="javascript:void(0)"
                                            title="Back"
                                            className="icon-lg mr-4"
                                            onClick={() => {
                                                setNewItem(false);
                                                setItem(undefined);
                                            }}
                                        >
                                            <i className="os-icon os-icon-arrow-left6"></i>
                                        </a>
                                        New Exemption
                                    </h6>
                                    <NewExemption onSubmit={async (model: any) => await createFunc({ variables: { model } })} />
                                    <LoadingState loading={loading} />
                                </>
                            )}

                            {!item && !newItem && (
                                <p>
                                    <div>
                                        <LoadingState loading={get_Loading} />
                                        {data && (
                                            <div style={{ minHeight: "65vh" }}>
                                                <ExemptionList
                                                    onView={(item: any) => {
                                                        setNewItem(false);
                                                        setItem(item);
                                                    }}
                                                    items={data.GetExemptions.docs}
                                                />
                                            </div>
                                        )}
                                        {data && !get_Loading && (
                                            <div className="fade-in">
                                                <Pagination length={data.GetExemptions.docs.length} {...data.GetExemptions} onPageClicked={(page: number) => setPage(page)} />
                                            </div>
                                        )}
                                    </div>
                                </p>
                            )}

                            {item && !newItem && (
                                <>
                                    <h6 className="element-header">
                                        <a
                                            href="javascript:void(0)"
                                            title="Back"
                                            className="icon-lg mr-4"
                                            onClick={() => {
                                                setNewItem(false);
                                                setItem(undefined);
                                            }}
                                        >
                                            <i className="os-icon os-icon-arrow-left6"></i>
                                        </a>
                                        Exemption Detail
                                    </h6>
                                    <ExemptionDetails item={item} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Exemption;
