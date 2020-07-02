/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TEACHER_LIST, REMOVE_TEACHER, SEARCH_TEACHER } from "../../queries/Teacher.query";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import LoadingState from "../partials/loading";
import Pagination from "../partials/Pagination";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../context/App";
import { useLazyQuery } from "@apollo/react-hooks";
import TeacherItems from "./Teacher/items";
import NotifyProvider from "../../events/event-resolver";
import { ACTION_EVENT } from "./../../events/index";
import { EventEmitter } from "../../events/EventEmitter";

const TeacherList: FC<IProps> = ({ history }) => {
    const [activeTeacher, SetActiveTeacher] = useState<any>(undefined);
    const [page, SetPage] = useState<number>(1);
    const [teachers, setTeachers] = useState<Array<any>>([]);
    const [limit] = useState<number>(25);
    const [keyword, setKeyword] = useState<string>();
    const [searcher, setSearcher] = useState(false);

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Fetch List of Teachers
    const { loading, data, fetchMore, refetch } = useQuery(TEACHER_LIST, {
        variables: { page, limit },
        onError: (err) => toast.error(CleanMessage(err.message)),
        notifyOnNetworkStatusChange: true,
        onCompleted: (d) => {
            const _res = Array.from(d.GetTeachers.docs);
            setTeachers(_res);
            setSearcher(false);
        },
    });

    const [searchFunc, { loading: searching }] = useLazyQuery(SEARCH_TEACHER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            const _res = Array.from(d?.SearchTeacher.docs);
            setTeachers(_res);
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    GetTeachers: fetchMoreResult.GetTeachers,
                };
            },
        });
    }, [page, limit, fetchMore]);

    // Remove Teacher
    const [RemoveTeacher, { loading: rLoading }] = useMutation(REMOVE_TEACHER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            NotifyProvider.NotifyAll({
                content: data.RemoveTeacher.doc.id,
                action: ACTION_EVENT.TEACHER.REMOVED,
            });
        },
    });
    EventEmitter.subscribe(ACTION_EVENT.TEACHER.CREATED, async () => refetch());
    EventEmitter.subscribe(ACTION_EVENT.TEACHER.REMOVED, async () => refetch());
    EventEmitter.subscribe(ACTION_EVENT.TEACHER.UPDATED, async () => refetch());
    return (
        <>
            <Helmet>
                <title>Teacher List | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        {!activeTeacher && (
                            <>
                                <span className="element-actions mt-n2">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => {
                                            history.push("/in/new-teacher");
                                        }}
                                    >
                                        Create New
                                    </button>
                                </span>
                                <h5 className="element-header">Teacher List</h5>
                                {data && data.GetTeachers.docs.length > 0 && (
                                    <div className="element-box">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12">
                                                <label htmlFor="">Filter Teacher</label>
                                            </div>
                                            <div className="col-lg-12">
                                                <form
                                                    onSubmit={async (event) => {
                                                        event.preventDefault();
                                                        await searchFunc({ variables: { keyword } });
                                                        setSearcher(true);
                                                    }}
                                                >
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">
                                                                <div className="os-icon os-icon-search"></div>
                                                            </div>
                                                        </div>
                                                        <input
                                                            defaultValue={keyword}
                                                            onChange={({ currentTarget: { value } }) => setKeyword(value)}
                                                            className="form-control"
                                                            placeholder="Enter teacher's email or phone"
                                                        />
                                                    </div>
                                                </form>
                                                {searcher && (
                                                    <button
                                                        className="btn btn-link"
                                                        onClick={() => {
                                                            setSearcher(false);
                                                            refetch();
                                                        }}
                                                    >
                                                        Reset search
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {data && (
                                    <div className="row justify-content-center ">
                                        <div className="col-lg-12 pt-5">
                                            <LoadingState loading={searching} />
                                            <div className="element-box-tp">
                                                <TeacherItems
                                                    onRemove={async (item: any) => await RemoveTeacher({ variables: { id: item.id } })}
                                                    onView={(item: any) => SetActiveTeacher(item)}
                                                    items={teachers}
                                                />
                                            </div>
                                        </div>

                                        {/* Pagination */}
                                        {data && !searcher && (
                                            <div className="col-lg fade-in">
                                                <div className="element-box">
                                                    <Pagination
                                                        length={teachers.length}
                                                        {...data.GetTeachers}
                                                        onPageClicked={(page: number) => {
                                                            SetPage(page);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <LoadingState loading={loading || rLoading} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherList;
