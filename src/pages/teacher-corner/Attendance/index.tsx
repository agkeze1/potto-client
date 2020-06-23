import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, toPrettyTime } from "./../../../context/App";
import { teacherAuthService } from "../../../services/teacher.auth.service";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_ATTENDANCE_SUMMARY, GET_TEACHER_TIMETABLE_SINGLE, GET_SINGLE_TIMETABLE_ATTENDANCE } from "../../../queries/Timetable.query";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import TeacherAttendanceSummary from "../../in/TeacherAttendance/Summary";
import { CountCard } from "../../in/partials/CountCard";
import { days } from "../../../data/days.json";
import AttendanceItems from "./items";

const TeacherAttendance = () => {
    const teacher = teacherAuthService.GetTeacher();
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalTimetable, setTotalTimetable] = useState(0);
    const [timetables, setTimetables] = useState<any>([]);
    const [active, setTimetable] = useState<any>(undefined);
    const [records, setRecord] = useState<Array<any>>([]);

    const { loading, data } = useQuery(GET_ATTENDANCE_SUMMARY, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { teacher: teacher.id, week: 1 },
        onCompleted: (d) => {
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

    const { loading: timeLoading } = useQuery(GET_TEACHER_TIMETABLE_SINGLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { teacher: teacher.id },
        onCompleted: (d) => {
            const _items: Array<any> = Array.from(d.GetTeacherTimetables.docs);
            const total = _items.map((t: any) => t.total).reduce((a: any, b: any) => a + b);
            setTotalTimetable(total);
            setTimetables(_items);
            setTimetable(_items[0].timetable_list[0]);
        },
    });

    const getLongDay = (day: string): string => {
        const _day = days.find((c) => c.value === day);
        if (_day) return _day.label;
        return day;
    };

    const [getRecordsFunc, { loading: recordLoading }] = useLazyQuery(GET_SINGLE_TIMETABLE_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const _items: Array<any> = Array.from(d.GetTeacherAttendanceByTimetable);
            setRecord(_items);
        },
    });
    useEffect(() => {
        if (active) getRecordsFunc({ variables: { timetable: active.id } });
    }, [active, getRecordsFunc]);

    return (
        <>
            <Helmet>
                <title> Attendance | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">Attendance</h5>
                        <LoadingState loading={loading} />
                        <div className="element-box no-bg bg-white">
                            <div className="row">
                                <h6 className="element-header">Last Week Attendance</h6>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-md-3 col-12">
                                            <CountCard loading={timeLoading} cssClass="bg-light-green" title="Expected Attendance" value={Math.round(totalTimetable * 1)} />
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <CountCard loading={timeLoading} cssClass="bg-darkseagreen" title="Total Attendance" value={totalAttendance} />
                                        </div>

                                        <div className="col-md-3 col-12">
                                            <CountCard loading={loading} cssClass="bg-lightcoral" title="Total Tardiness" value={toPrettyTime(totalMinutes)} />
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <CountCard loading={loading} cssClass="bg-light-red" title="Missed Attendance" value={Math.round(totalTimetable * 1 - totalAttendance)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">{!loading && <TeacherAttendanceSummary items={data.GetTeacherAttendancesSummary} />}</div>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-md-4 col-12">
                                    {timetables.map((time: any, idx: number) => (
                                        <React.Fragment key={idx}>
                                            <h6>{getLongDay(time.day)}</h6>
                                            {time.timetable_list.map((_item: any, index: number) => (
                                                <div
                                                    onClick={() => setTimetable(_item)}
                                                    key={index}
                                                    className={`element-box no-bg clickable   ${_item.id === active?.id ? "bg-light-green" : "bg-white"}`}
                                                >
                                                    {_item.period.from_time} - {_item.period.to_time}{" "}
                                                    {_item.period.total === 1 && <span className="badge badge-primary text-uppercase">single period</span>}
                                                    {_item.period.total === 2 && <span className="badge badge-primary text-uppercase">double period</span>}
                                                    <br />
                                                    <strong>{_item.subject.title}</strong> | <strong className="text-primary text-uppercase">{_item.assigned_class.name}</strong>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="col-md-8 col-12">
                                    <div className="element-box no-bg bg-white">
                                        <h6 className="element-header">Current Week Attendance</h6>
                                        <LoadingState loading={recordLoading} />
                                        {!timeLoading && !recordLoading && <AttendanceItems items={records} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default TeacherAttendance;
