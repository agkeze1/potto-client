/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE, GetAge } from "../../context/App";
import { NavLink } from "react-router-dom";
import TeacherTTAccordion from "../partials/TeacherTTAccordion";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TEACHER_LIST, REMOVE_TEACHER, SEARCH_TEACHER } from "../../queries/Teacher.query";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import LoadingState from "../partials/loading";
import Pagination from "../partials/Pagination";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../context/App";
import MessageEditor from "../partials/MessagingEditor";
import { SEND_TEACHER_MESSAGE } from "../../queries/teacher-message.query";
import { useLazyQuery } from "@apollo/react-hooks";
import TeacherItems from "./Teacher/items";

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

    const [sendMessageFunc, { loading: messageLoading }] = useMutation(SEND_TEACHER_MESSAGE, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            toast.success(d.SendTeachersMessage.message);
        },
    });

    const [searchFunc, { loading: searching }] = useLazyQuery(SEARCH_TEACHER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            const _res = Array.from(d.SearchTeacher.docs);
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
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: TEACHER_LIST,
                variables: { page, limit },
            });

            const index = q.GetTeachers.docs.findIndex((i: any) => i.id === data.RemoveTeacher.doc.id);

            q.GetTeachers.docs.splice(index, 1);

            //update
            cache.writeQuery({
                query: TEACHER_LIST,
                variables: { page, limit },
                data: { GetTeachers: q.GetTeachers },
            });
        },
    });

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

                        {/* Profile Section */}
                        {activeTeacher && (
                            <div>
                                <div className="content-box">
                                    <div className="element-wrapper">
                                        <h5 className="element-header">Teacher Profile</h5>
                                        <div className="element-box">
                                            <div className="text-left">
                                                <NavLink
                                                    to="#"
                                                    onClick={() => {
                                                        SetActiveTeacher(undefined);
                                                    }}
                                                >
                                                    <i className="icon-lg os-icon os-icon-arrow-left6" style={{ fontSize: "25px" }}></i>
                                                </NavLink>
                                            </div>
                                            <div className="text-center mb-5">
                                                <img
                                                    className="avatar mb-3"
                                                    alt="Passport"
                                                    src={activeTeacher.image || "/avatar.png"}
                                                    style={{
                                                        width: "200px",
                                                        height: "200px",
                                                    }}
                                                />

                                                <h2 className="up-header ">{activeTeacher.name}</h2>
                                                <h6 className="up-sub-header">
                                                    {activeTeacher.email}
                                                    <i className="os-icon os-icon-check-circle text-success ml-2" title="Email verified"></i>
                                                </h6>
                                            </div>

                                            <div className="os-tabs-w">
                                                <div className="os-tabs-controls">
                                                    <ul className="nav nav-tabs smaller">
                                                        {/* Basic Info Tab */}
                                                        <li className="nav-item text-uppercase">
                                                            <a className="nav-link active" data-toggle="tab" href="#basic-info">
                                                                Basic Info
                                                            </a>
                                                        </li>

                                                        {/* Timetable Tab */}
                                                        <li className="nav-item text-uppercase">
                                                            <a className="nav-link" data-toggle="tab" href="#timetable">
                                                                Timetable
                                                            </a>
                                                        </li>
                                                        {/* MESSAGE */}
                                                        <li className="nav-item text-uppercase">
                                                            <a className="nav-link" data-toggle="tab" href="#message">
                                                                Send Message
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="tab-content">
                                                    {/* Basic Information */}
                                                    <div className="tab-pane active" id="basic-info">
                                                        <div className="text-center element-box no-bg no-shadow">
                                                            <ul className="pro-details">
                                                                <li>
                                                                    <span>Gender</span> | <b>{activeTeacher.gender}</b>
                                                                </li>
                                                                <li>
                                                                    <span>Date of Birth</span> | <b>{CLEAN_DATE(activeTeacher.dob)}</b>
                                                                    <span className="badge badge-primary ml-2 p-1">{GetAge(activeTeacher.dob)}Yrs</span>
                                                                </li>
                                                                <li>
                                                                    <span>Phone number</span> | <b>{activeTeacher.phone}</b>
                                                                </li>
                                                                <li>
                                                                    <span>Employment date</span> | <b>{CLEAN_DATE(activeTeacher.doj)}</b>
                                                                </li>
                                                                <li>
                                                                    <span>Address</span> | <b>{activeTeacher.address}</b>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Timetable */}
                                                    <div className="tab-pane" id="timetable">
                                                        <div className="text-center element-box no-bg no-shadow">
                                                            <TeacherTTAccordion day="Monday" />
                                                            <TeacherTTAccordion day="Tuesday" />
                                                            <TeacherTTAccordion day="Wednesday" />
                                                            <TeacherTTAccordion day="Thursday" />
                                                            <TeacherTTAccordion day="Friday" />
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane" id="message">
                                                        <div className="slit-in-vertical">
                                                            <MessageEditor
                                                                onSubmit={async (message: string) =>
                                                                    await sendMessageFunc({
                                                                        variables: {
                                                                            model: {
                                                                                message,
                                                                                excluded: [],
                                                                                teachers: [activeTeacher.id],
                                                                            },
                                                                        },
                                                                    })
                                                                }
                                                                total={1}
                                                            />
                                                            <LoadingState loading={messageLoading || searching} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherList;
