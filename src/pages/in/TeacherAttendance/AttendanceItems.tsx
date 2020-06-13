import React, { FC } from "react";

interface iProp {
    items: Array<any>;
}

const TeacherAttendanceList: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <div>
                <table></table>
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
