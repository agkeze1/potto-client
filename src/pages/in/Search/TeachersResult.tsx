import React, { FC } from "react";
import Image from "../../partials/Image";
import { GetAge, cleanDate } from "../../../context/App";
import { NavLink } from "react-router-dom";

interface iProps {
    items: Array<any>;
}

const TeachersSearchResult: FC<iProps> = ({ items }) => {
    if (items.length)
        return (
            <>
                <h6 className="element-header">Found {Intl.NumberFormat().format(items.length)} teacher(s)</h6>
                <div className="row">
                    <div className="users-list-w">
                        {items.map((teacher, idx) => (
                            <div key={idx} className="user-w with-status status-green fade-in ">
                                <Image alt={teacher?.first_name} src={teacher?.image} width={50} />

                                <div className="user-name">
                                    <h6 className="user-title">
                                        <NavLink to={{ pathname: `/in/teacher/${teacher.id}` }}>{teacher?.name}</NavLink>
                                    </h6>
                                    <div className="user-role">
                                        PHONE NUMBER: <strong>{teacher.phone}</strong> | <span className="badge badge-primary rounded">{GetAge(teacher.dob)} Years</span> | GENDER:{" "}
                                        <strong>{teacher.gender}</strong> | <span className="text-primary">TEACHER SINCE</span>:{" "}
                                        <strong className="text-primary">{cleanDate(teacher.doj, true, false)}</strong>
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

export default TeachersSearchResult;
