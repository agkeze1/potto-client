import React, { FC } from "react";
import Image from "./../../partials/Image";
import { GetAge } from "./../../../context/App";
import { NavLink } from "react-router-dom";

interface iProps {
    items: Array<any>;
}

const StudentSearchResult: FC<iProps> = ({ items }) => {
    if (items.length)
        return (
            <>
                <h6 className="element-header">Found {Intl.NumberFormat().format(items.length)} student(s) </h6>
                <div className="row">
                    <div className="users-list-w">
                        {items.map((student, idx) => (
                            <div key={idx} className="user-w with-status status-green fade-in ">
                                <Image alt={student?.surname} src={student?.passport} width={50} />

                                <div className="user-name">
                                    <h6 className="user-title">
                                        <NavLink to={{ pathname: `/in/student/${student.id}` }}>{student?.full_name}</NavLink>
                                    </h6>
                                    <div className="user-role">
                                        CLASS: <strong>{student?.current_class.name}</strong> | REG NO: <strong>{student.reg_no}</strong> |{" "}
                                        <span className="badge badge-primary rounded">{GetAge(student.dob)} Years</span> | GENDER: <strong>{student.gender}</strong>{" "}
                                        {student.guardians.length > 0 && (
                                            <>
                                                | <span className="text-primary">FIRST GUARDIAN</span>: <strong className="text-primary">{student.guardians[0].full_name}</strong>
                                            </>
                                        )}{" "}
                                        | STATE OF ORIGIN: <strong>{student.state}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );

    return null;
};

export default StudentSearchResult;
