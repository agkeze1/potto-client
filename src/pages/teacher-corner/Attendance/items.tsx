import React, { FC } from "react";
import { cleanDate, toPrettyTime } from "../../../context/App";

interface iProp {
    items: Array<any>;
}

const AttendanceItems: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Attendance Date</th>
                                <th>Tardiness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td>
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td>{cleanDate(item.date, false, false)}</td>
                                    <td className="text-danger">
                                        <strong>{toPrettyTime(item.totalMinutes)}</strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );

    return (
        <div className="text-center pb-5" style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h3 className="text-info">No Record Found!</h3>
            <p>Select Timetable to load the detail here.</p>
        </div>
    );
};
export default AttendanceItems;
