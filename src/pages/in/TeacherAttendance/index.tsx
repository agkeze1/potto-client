import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import Select from "react-select";
import TeacherAttendanceList from "./AttendanceItems";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_ALL_TEACHERS_SHORT, GET_TEACHER_ATTENDANCE } from "../../../queries/Teacher.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import DatePicker from "react-datepicker";

const TeacherAttendance = () => {
    const title = "Teacher Attendance Report";

    const [teacher, setTeacher] = useState<string>("");
    const [person, setPerson] = useState<any>(undefined);
    const [teachers, setTeachers] = useState<Array<any>>([]);
    const [filter, setFilter] = useState({ from: new Date(), to: new Date() });

    const { loading } = useQuery(GET_ALL_TEACHERS_SHORT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTeachers(d.GetAllTeachers.docs);
        },
    });

    const [getTeacherFunc, { loading: tLoading, data }] = useLazyQuery(GET_TEACHER_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
    });
    useEffect(() => {
        if (teacher) getTeacherFunc({ variables: { teacher } });
    }, [teacher, getTeacherFunc]);

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
                                                onChange={(item: any) => {
                                                    setTeacher(item.value);
                                                    const _item = teachers.find((d) => d.id === item.value);
                                                    setPerson(_item);
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
                                                selected={filter.from}
                                                onChange={(date) => {
                                                    setFilter({ from: date || new Date(), to: date || new Date() });
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="from">Date Range (to)</label>
                                            <DatePicker
                                                placeholderText="select date .."
                                                className="form-control"
                                                required
                                                minDate={filter.from}
                                                dateFormat="dd MMMM, YYY"
                                                selected={filter.to}
                                                onChange={(date) => {
                                                    setFilter({ ...filter, to: date || new Date() });
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
                                <LoadingState loading={loading || tLoading} />
                                {data && <TeacherAttendanceList items={data.GetTeacherSubjectAttendance.docs} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherAttendance;
