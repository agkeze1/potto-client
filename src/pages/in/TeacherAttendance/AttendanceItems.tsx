import React, { FC } from "react";
import { cleanDate, GetTimeDifference } from "../../../context/App";

interface iProp {
    items: Array<any>;
    onSelect?: any;
    total: number;
}

const TeacherAttendanceList: FC<iProp> = ({ items, onSelect, total }) => {
    if (items.length)
        return (
            <div className="row fade-in">
                <div className="col-12">
                    <table className="table table-padded">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Attendance Date</th>
                                <th>Subject</th>
                                <th>Period</th>
                                <th>Time Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td>
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td>
                                        <strong className="text-primary">{cleanDate(item.date, false, true)}</strong>
                                    </td>
                                    <td>
                                        <span>{item.timetable.subject.title}</span>
                                    </td>
                                    <td>
                                        <strong>
                                            {item.timetable.period.from_time} - {item.timetable.period.to_time}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className="text-danger" style={{ display: "block", fontWeight: "bold" }}>
                                            {GetTimeDifference(item.timetable.period.from, item.date)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

    return (
        <div className="element-box no-bg bg-white text-center pb-5" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h3 className="text-info">No Record</h3>
            <p>Select teacher to view the attendance report</p>
        </div>
    );
};

export default TeacherAttendanceList;
