/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { FC, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { STU_SUB_ATT } from "../../../../queries/attendance.query";
import { toast } from "react-toastify";
import { CleanMessage, cleanDate } from "../../../../context/App";
import LoadingState from "../../../partials/loading";
import days from "../../../../data/days.json";

interface IProps {
    studentId: string;
}
const SubjectAttendance: FC<IProps> = ({ studentId }) => {
    const [attRecord, SetAttRecord] = useState<any>();
    const [activeAttRecord, SetActiveAttRecord] = useState<any>();
    const [activeDay, SetActiveDay] = useState<any>();
    const [activeTimetableAtt, SetActiveTimetableAtt] = useState<any>();
    const [showResult, SetShowResult] = useState<boolean>(false);

    const { loading } = useQuery(STU_SUB_ATT, {
        variables: { student: studentId },
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            console.log("Stu Att Record: ", data);
            if (data) SetAttRecord(data.GetSubjectAttendanceByStudent.docs);
        },
    });

    return (
        <>
            <div className="row">
                <LoadingState loading={loading} />
                {attRecord && (
                    <>
                        {showResult && (
                            <div className="col-12 mb-2">
                                <button
                                    className="btn btn-primary mt-n2"
                                    onClick={() => {
                                        SetShowResult(false);
                                    }}
                                >
                                    Change Day
                                </button>
                            </div>
                        )}

                        {/* Day Section */}
                        {!showResult && (
                            <div className="col-md-4">
                                <div className="element-box bdr no-bg bg-azure">
                                    <h6 className="element-header">Days</h6>
                                    {days?.days?.map((day: any, idx: number) => (
                                        <a
                                            key={idx}
                                            className={`el-tablo att-date-crd bg-transparent ${activeDay?.value === day.value ? "active-att-date" : ""}`}
                                            href="javascript:void(0)"
                                            onClick={() => {
                                                SetActiveDay(day);
                                                SetActiveAttRecord(undefined);
                                                const attRec = attRecord?.filter((i: any) => i.timetable?.day === day.value);

                                                SetActiveAttRecord(attRec);
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-10">
                                                    <div className="text-primary">{day.label?.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timetable Section */}
                        <div className={showResult ? "col-md-4" : "col-md-8"}>
                            <div className="element-box bdr">
                                <h6 className="element-header">Timetable {activeDay && <b>( {activeDay?.label} )</b>}</h6>
                                <div className="row">
                                    {activeAttRecord?.map((rec: any) => (
                                        <div className={showResult ? "col-md-12" : "col-md-6"}>
                                            <a
                                                className={`element-box el-tablo no-bg bg-beige mt-0 p-3 bdr ${activeTimetableAtt?.timetable?.id === rec.timetable?.id ? "active-bdr-primary" : ""}`}
                                                href="javascript:void(0)"
                                                onClick={() => {
                                                    SetShowResult(true);
                                                    SetActiveTimetableAtt(rec);
                                                }}
                                            >
                                                <div className="label">
                                                    {rec.timetable?.period?.from} {" - "}
                                                    {rec.timetable?.period?.to}
                                                </div>
                                                <div className="value">{rec.timetable?.subject?.title}</div>
                                            </a>
                                        </div>
                                    ))}
                                    {activeAttRecord?.length === 0 && (
                                        <div className="col-12 text-center">
                                            <h6 className="text-danger my-5">No Student Subject Attendance Record found for the selected day.</h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Result Section */}
                        {showResult && activeTimetableAtt && (
                            <div className="col-md-8">
                                <div className="table-responsive element-box no-bg no-shadow bdr">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Device</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeTimetableAtt?.attendances?.map((att: any, idx: number) => (
                                                <tr>
                                                    <td>{idx + 1}</td>
                                                    <td>{cleanDate(new Date(parseInt(att.date)).toISOString())}</td>
                                                    <td>
                                                        <label className={`badge badge-${att.present ? "success" : !att.present && !att.manual ? "danger" : att.exempted ? "warning" : ""}-inverted`}>
                                                            {att.present && "Present"}
                                                            {!att.present && !att.manual && "Absent"}
                                                            {att.exempted && "Exempted"}
                                                        </label>
                                                        {att.manual && <label className="badge badge-primary-inverted">Manual</label>}
                                                    </td>
                                                    <td>Device</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default SubjectAttendance;
