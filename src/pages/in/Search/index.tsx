import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GetParamFromQuery, CleanMessage } from "./../../../context/App";
import { useLazyQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import StudentSearchResult from "./Students";
import { ALL_SEARCH } from "../../../queries/search.query";
import TeachersSearchResult from "./TeachersResult";
import GuardianResult from "./GuardianResult";
import mark from "mark.js";
import "./search.css";

const AppSearch = () => {
    const _search = GetParamFromQuery("q");
    const [keyword, setKeyword] = useState<string>(_search);
    const [start, setStart] = useState(_search !== undefined || _search !== null);
    const marker = new mark(document.getElementById("resultContent") || "resultContent");

    const [searchFunc, { loading, data }] = useLazyQuery(ALL_SEARCH, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            setStart(false);
            marker.mark(keyword);
        },
    });

    useEffect(() => {
        if (keyword && start) searchFunc({ variables: { search: keyword } });
    }, [keyword, searchFunc, start]);

    return (
        <>
            <Helmet>
                <title>
                    {keyword || "Application Search"} | {GetAppName()}
                </title>
            </Helmet>

            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">Search</h5>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        if (keyword) setStart(true);
                                    }}
                                >
                                    <div className="search-in ci mb-3 scale-in-bottom">
                                        <i className="os-icon os-icon-search p-4"></i>
                                        <input
                                            defaultValue={keyword}
                                            type="search"
                                            placeholder="Start typing to search..."
                                            className="form-control"
                                            onChange={({ currentTarget: { value } }) => setKeyword(value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="col-12">
                                <div id="resultContent" className="element-box no-bg bg-white" style={{ minHeight: "60vh" }}>
                                    <LoadingState loading={loading} />
                                    <div className="col-12">{data && <StudentSearchResult items={data.StudentSearch.docs} />}</div>
                                    <div className="col-12 mt-4">{data && <TeachersSearchResult items={data.SearchTeacher.docs} />}</div>
                                    <div className="col-12 mt-4">{data && <GuardianResult items={data.SearchGuardian.docs} />}</div>

                                    {data && data.SearchGuardian.docs.length === 0 && data.SearchTeacher.docs.length === 0 && data.StudentSearch.docs.length === 0 && (
                                        <div
                                            className="fade-in text-center pb-5"
                                            style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                                        >
                                            <img style={{ width: "34em" }} className="no-scale" src="/images/3.png" alt="404" />
                                            <h3 className="text-info mb-4">No Record found</h3>
                                            <div className="text-left">
                                                <p>You can search with the following:</p>
                                                <ul>
                                                    <li>Student's name, reg no, state, or local government</li>
                                                    <li>Teacher's name, phone number, or address</li>
                                                    <li>Guardian's name, hometown, address, state, local government, or phone number</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppSearch;
