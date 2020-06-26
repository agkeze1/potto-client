import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { GetAppName, GetParamFromQuery, CleanMessage } from "./../../../context/App";
import { useLazyQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { FIND_STUDENTS } from "../../../queries/Student.query";
import LoadingState from "../../partials/loading";
import StudentSearchResult from "./Students";

const AppSearch = () => {
    const _search = GetParamFromQuery("q");
    const [keyword, setKeyword] = useState<string>(_search);
    const [start, setStart] = useState(_search !== undefined || _search !== null);

    const [searchFunc, { loading, data }] = useLazyQuery(FIND_STUDENTS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => setStart(false),
    });

    useEffect(() => {
        if (keyword && start) searchFunc({ variables: { search: keyword } });
    }, [keyword, searchFunc, start]);

    return (
        <>
            <Helmet>
                <title>
                    {keyword} | {GetAppName()}
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
                                        setStart(true);
                                    }}
                                >
                                    <div className="element-box no-bg bg-white rounded">
                                        <input
                                            defaultValue={keyword}
                                            onChange={({ currentTarget: { value } }) => setKeyword(value)}
                                            className="form-control w-100 text-search rounded"
                                            placeholder="Start typing to search..."
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="col-12">
                                <div className="element-box no-bg bg-white" style={{ minHeight: "60vh" }}>
                                    <LoadingState loading={loading} />
                                    {data && <StudentSearchResult items={data.StudentSearch.docs} />}
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
