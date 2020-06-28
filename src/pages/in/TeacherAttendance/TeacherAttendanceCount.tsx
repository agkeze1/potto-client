import React, { FC } from "react";
import Image from "./../../partials/Image";
import { NavLink } from "react-router-dom";

interface iProp {
    items: Array<any>;
}

const TeacherAttendanceCount: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <div className="">
                <div className="table">
                    <table className="table table-padded">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Teacher</th>
                                <th className="text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td>
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td>
                                        <div className="users-list-w">
                                            <div className="user-w with-status status-green fade-in ">
                                                <Image alt={item.teacher.first_name} src={item.teacher.image} width={50} />
                                                <div className="user-name">
                                                    <h6 className="user-title">
                                                        <NavLink to={{ pathname: `/in/teacher/${item.teacher.id}` }}>{item.teacher.name}</NavLink>
                                                    </h6>
                                                    <div className="user-role">
                                                        <strong>{item.teacher.phone}</strong> |{" "}
                                                        <span className="text-primary">
                                                            <strong> {item.teacher.gender} </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-primary badge-lg">{item.total}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    return (
        <div className="element-box text-center pb-5" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h3 className="text-info">No Record</h3>
            <p>Select teacher to view the attendance report</p>
        </div>
    );
};

export default TeacherAttendanceCount;
