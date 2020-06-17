import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import Select from "react-select";
import TeacherAttendanceList from "./AttendanceItems";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_ALL_TEACHERS_SHORT, GET_TEACHER_ATTENDANCE, GET_TEACHER_TIMETABLE } from "../../../queries/Teacher.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import DatePicker from "react-datepicker";
import { CountCard } from "../partials/CountCard";

const TeacherAttendance = () => {
    const title = "Teacher Attendance Report";

    const [teacher, setTeacher] = useState<string>("");
    const [person, setPerson] = useState<any>(undefined);
    const [teachers, setTeachers] = useState<Array<any>>([]);
    const [from_filter, setFromFilter] = useState<any>(undefined);
    const [to_filter, setToFilter] = useState<any>(undefined);
    const [expected, setExpected] = useState<number>(0);

    const { loading } = useQuery(GET_ALL_TEACHERS_SHORT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTeachers(d.GetAllTeachers.docs);
        },
    });

    const [getTeacherFunc, { loading: tLoading, data }] = useLazyQuery(GET_TEACHER_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
    });

    const [getTeacherTimetableFunc, { loading: exLoading }] = useLazyQuery(GET_TEACHER_TIMETABLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setExpected(d.GetTeacherTimetables.docs.map((a: any) => a.total).reduce((a: number, b: number) => a + b));
        },
    });
    useEffect(() => {
        if (teacher && from_filter && to_filter) getTeacherFunc({ variables: { teacher, from: from_filter, to: to_filter } });
    }, [teacher, getTeacherFunc, from_filter, to_filter]);

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
                        <div className="row">
                            <div className="col-md-12">
                                <div className="element-box no-bg bg-white">
                                    <h5 className="element-header">{title}</h5>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="teacher">Select teacher to proceed</label>
                                            <Select
                                                options={teachers.map((i: any) => ({
                                                    value: i.id,
                                                    label: i.name,
                                                }))}
                                                isLoading={loading}
                                                id="teacher"
                                                isMulti={false}
                                                isSearchable={true}
                                                onChange={async (item: any) => {
                                                    setTeacher(item.value);
                                                    const _item = teachers.find((d) => d.id === item.value);
                                                    setPerson(_item);
                                                    await getTeacherTimetableFunc({ variables: { id: _item.id } });
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="from">Date Range (from)</label>
                                            <DatePicker
                                                placeholderText="select date .."
                                                className="form-control"
                                                required
                                                dateFormat="dd MMMM, YYY"
                                                selected={from_filter}
                                                onChange={(date) => {
                                                    setFromFilter(date);
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="from">Date Range (to)</label>
                                            <DatePicker
                                                placeholderText="select date .."
                                                className="form-control"
                                                required
                                                minDate={from_filter}
                                                dateFormat="dd MMMM, YYY"
                                                selected={to_filter}
                                                onChange={(date) => {
                                                    setToFilter(date);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="users-list-w">
                                        {person && (
                                            <div className="user-w with-status status-green fade-in">
                                                <div className="user-avatar-w">
                                                    <div className="user-avatar">
                                                        <img alt={person.first_name} src={person.image} />
                                                    </div>
                                                </div>
                                                <div className="user-name">
                                                    <h6 className="user-title">{person.name}</h6>
                                                    <div className="user-role">Teacher</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <LoadingState loading={tLoading} />
                                {data && (
                                    <div className="row">
                                        <div className="col-md-10 col-12">
                                            <TeacherAttendanceList total={data.GetTeacherSubjectAttendance.total} items={data.GetTeacherSubjectAttendance.docs} />
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <div className="row">
                                                <div className="col-12">
                                                    <CountCard title="Total Students" loading={exLoading} value={expected} cssClass="bg-darkseagreen" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherAttendance;
