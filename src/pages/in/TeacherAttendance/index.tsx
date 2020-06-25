import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, toPrettyTime } from "../../../context/App";
import TeacherAttendanceReportFilter from "./Filter";
import LoadingState from "../../partials/loading";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_TEACHER_TIMETABLE_SINGLE, COUNT_TIMETABLE_ATTENDANCE, GET_TARDINESS_ATTENDANCE, GET_ATTENDANCE_SUMMARY } from "../../../queries/Timetable.query";
import { toast } from "react-toastify";
import TimetableAttendance from "./TimetableAttendance";
import TeacherAttendanceCount from "./TeacherAttendanceCount";
import AttendanceTardiness from "./AttendanceTardiness";
import TeacherAttendanceSummary from "./Summary";
import { CountCard } from "../partials/CountCard";

const TeacherAttendance = () => {
    const title = "Teacher's Attendance Report";
    const [teacher, setTeacher] = useState<any>();
    const [timetables, setTimetables] = useState<any>([]);
    const [summary, setSummary] = useState<any>([]);

    const [tardiness, setTardiness] = useState<any>([]);
    const [week, setWeek] = useState<any>(undefined);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalTimetable, setTotalTimetable] = useState(0);

    const [fetchTimetableFunc, { loading }] = useLazyQuery(GET_TEACHER_TIMETABLE_SINGLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        fetchPolicy: "network-only",
        onCompleted: (d) => {
            setTimetables(d.GetTeacherTimetables.docs);
            const _items = Array.from(d.GetTeacherTimetables.docs);
            if (_items.length) {
                const count = _items.map((g: any) => g.total).reduce((f: any, i: any) => f + i);
                setTotalTimetable(count);
            }
        },
    });
    // COUNT_TIMETABLE_ATTENDANCE
    const { loading: countLoading, data: countData } = useQuery(COUNT_TIMETABLE_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        fetchPolicy: "network-only",
    });

    // GET_TARDINESS_ATTENDANCE
    const { loading: tardinessLoading } = useQuery(GET_TARDINESS_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        fetchPolicy: "network-only",
        onCompleted: (d) => {
            const items = Array.from(d.GetTeacherAttendanceTardiness);
            setTardiness(items.sort((a: any, b: any) => b.totalMinutes - a.totalMinutes));
        },
    });
    // GET_ATTENDANCE_SUMMARY
    const [getSummaryFunc, { loading: summaryLoading }] = useLazyQuery(GET_ATTENDANCE_SUMMARY, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        fetchPolicy: "network-only",
        onCompleted: (d) => {
            setSummary(d.GetTeacherAttendancesSummary);
            const _items = Array.from(d.GetTeacherAttendancesSummary);
            if (_items.length) {
                const _total = _items.map((g: any) => g.totalAttendance).reduce((a: any, b: any) => a + b);
                setTotalAttendance(_total);

                let mins = _items
                    .map((i: any) => i.classes)
                    .flat()
                    .map((r: any) => r.totalMinutes)
                    .reduce((a: any, b: any) => a + b);
                setTotalMinutes(mins);
            }
        },
    });

    useEffect(() => {
        if (teacher) {
            fetchTimetableFunc({ variables: { teacher: teacher.id } });
            if (week) getSummaryFunc({ variables: { teacher: teacher.id, week: week.value } });
        }
    }, [teacher, fetchTimetableFunc, week, getSummaryFunc]);

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
                        <h5 className="element-header">{title}</h5>
                        <TeacherAttendanceReportFilter
                            onWeek={(week: any) => setWeek(week)}
                            onTeacher={(teacher: any) => {
                                setTeacher(teacher);
                                setTimetables([]);
                                setSummary([]);
                                setTotalAttendance(0);
                                setTotalMinutes(0);
                                setTotalTimetable(0);
                            }}
                            activeTeacher={teacher}
                        />
                        {teacher && week && (
                            <div className="row fade-in">
                                <div className="col-12 col-md-4">
                                    <LoadingState loading={loading} />
                                    <TimetableAttendance items={timetables} onItem={(item: any) => {}} />
                                </div>
                                <div className="col-12 col-md-8">
                                    <div className="element-box no-bg bg-white">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-md-4 col-12">
                                                        <CountCard loading={summaryLoading} cssClass="bg-light-green" title="Expected Attendance" value={Math.round(totalTimetable * week.value)} />
                                                    </div>
                                                    <div className="col-md-4 col-12">
                                                        <CountCard loading={summaryLoading} cssClass="bg-darkseagreen" title="Total Attendance" value={totalAttendance} />
                                                    </div>
                                                    <div className="col-md-4 col-12">
                                                        <CountCard loading={loading} cssClass="bg-light-blue" title="Total Timetable" value={totalTimetable} />
                                                    </div>
                                                    <div className="col-md-4 col-12">
                                                        <CountCard loading={summaryLoading} cssClass="bg-lightcoral" title="Total Tardiness" value={toPrettyTime(totalMinutes)} />
                                                    </div>
                                                    <div className="col-md-4 col-12">
                                                        <CountCard
                                                            loading={summaryLoading}
                                                            cssClass="bg-light-red"
                                                            title="Missed Attendance"
                                                            value={Math.round(totalTimetable * week.value - totalAttendance)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <TeacherAttendanceSummary items={summary} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!teacher && !week && (
                            <div className="row fade-in">
                                <div className="col-12 col-md-6">
                                    <h6 className="element-header">Teacher taken attendance in the last 7 days</h6>
                                    <LoadingState loading={countLoading} />
                                    {countData && <TeacherAttendanceCount items={countData.CountTimetableAttendance} />}
                                </div>
                                <div className="col-12 col-md-6">
                                    <h6 className="element-header">Attendance Tardiness in the last 7 days</h6>
                                    <LoadingState loading={tardinessLoading} />
                                    {!tardinessLoading && (
                                        <AttendanceTardiness
                                            onTeacher={(_teacher: any) => {
                                                setTeacher(_teacher);
                                            }}
                                            items={tardiness}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherAttendance;
