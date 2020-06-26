import React, { useState, FC } from "react";
import Select from "react-select";
import Image from "./../../partials/Image";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_TEACHERS_SHORT } from "../../../queries/Teacher.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import { CountCard } from "../partials/CountCard";
import { COUNT_SUBJECT_ATTENDANCE, COUNT_TIMETABLE_ATTENDANCE } from "../../../queries/Timetable.query";

interface iProp {
    onTeacher: any;
    onWeek: any;
    activeTeacher: any;
}

const TeacherAttendanceReportFilter: FC<iProp> = ({ onTeacher, onWeek, activeTeacher }) => {
    const weeks: Array<any> = [
        { label: "2 Weeks Ago", value: 2 },
        { label: "Last Week", value: 1 },
    ];
    const [teachers, setTeachers] = useState<Array<any>>([]);
    const [totalAttendance, setTotalAttendance] = useState<number>(0);
    const [weeklyCount, setWeeklyCount] = useState<number>(0);

    const { loading } = useQuery(GET_ALL_TEACHERS_SHORT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTeachers(d.GetAllTeachers.docs);
        },
    });

    const { loading: cLoading } = useQuery(COUNT_SUBJECT_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setTotalAttendance(d.CountSubjectAttendance);
        },
    });

    const { loading: weekLoading } = useQuery(COUNT_TIMETABLE_ATTENDANCE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const items = Array.from(d.CountTimetableAttendance);
            if (items.length) {
                const sum = items.map((item: any) => item.total).reduce((a: number, b: number) => a + b);
                setWeeklyCount(sum);
            }
        },
    });
    const date = new Date();
    if (date.getDay() === 5) weeks.push({ label: "Current Week", value: 0 });

    return (
        <div className="row">
            <div className="col-md-8 col-12">
                <div className="element-box">
                    <label htmlFor="teacher">Filter by teacher</label>
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
                            const _item = teachers.find((d) => d.id === item.value);
                            onTeacher(_item);
                        }}
                    />
                </div>
            </div>

            <div className="col-md-4 col-12">
                <div className="element-box">
                    <label htmlFor="from">Select Range</label>
                    <Select options={weeks} isMulti={false} isSearchable={true} onChange={async (item: any) => onWeek(item)} />
                </div>
            </div>
            {activeTeacher && (
                <div className="col-12 col-md-4 fade-in">
                    <div className="element-box bg-white">
                        <div className="users-list-w">
                            <div className="user-w with-status status-green fade-in ">
                                <Image alt={activeTeacher?.first_name} src={activeTeacher?.image} width={50} />

                                <div className="user-name">
                                    <h6 className="user-title">{activeTeacher?.name}</h6>
                                    <div className="user-role">
                                        <strong>{activeTeacher?.phone}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="col-12 col-md-4">
                <CountCard loading={cLoading} cssClass="bg-orange" title="Total Attendance within active term" value={totalAttendance} />
            </div>
            <div className="col-12 col-md-4">
                <CountCard loading={weekLoading} cssClass="bg-light-blue" title="Total Attendance within 7 days" value={weeklyCount} />
            </div>
        </div>
    );
};

export default TeacherAttendanceReportFilter;
