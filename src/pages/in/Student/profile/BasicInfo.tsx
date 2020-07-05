import React, { FC } from "react";
import { CLEAN_DATE, GetAge, cleanDate } from "../../../../context/App";

interface IProp {
    student: any;
}
const BasicInfo: FC<IProp> = ({ student }) => {
    return (
        <div className="text-center element-box no-bg no-shadow">
            <ul className="pro-details">
                <li>
                    <span>Gender</span> | <b>{student.gender}</b>
                </li>
                <li>
                    <span>Date of Birth</span> | <b>{cleanDate(student.dob, true, false)}</b>
                    <span className="badge badge-primary ml-2 p-1">{GetAge(student.dob)}Yrs</span>
                </li>
                <li>
                    <span>Date Created</span> | <b>{CLEAN_DATE(student.created_at)}</b>
                </li>
                <li>
                    <span>Level</span> | <b>{student.current_class?.level?.name}</b>
                </li>
                <li>
                    <span>Class</span> | <b>{student.current_class?.name}</b>
                </li>
                <li>
                    <span>State of Origin</span> | <b>{student.state}</b>
                </li>
                <li>
                    <span>LGA</span> | <b>{student.lga}</b>
                </li>
                <li>
                    <span>Address</span> | <b>{student.address}</b>
                </li>
            </ul>
        </div>
    );
};

export default BasicInfo;
