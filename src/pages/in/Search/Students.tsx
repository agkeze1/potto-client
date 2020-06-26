import React, { FC } from "react";
import Image from "./../../partials/Image";
import { GetAge } from "./../../../context/App";

interface iProps {
    items: Array<any>;
}

const StudentSearchResult: FC<iProps> = ({ items }) => {
    if (items.length)
        return (
            <>
                <h6 className="element-header">Students found </h6>
                <div className="row">
                    <div className="users-list-w">
                        {items.map((student, idx) => (
                            <div key={idx} className="user-w with-status status-green fade-in ">
                                <Image alt={student?.surname} src={student?.passport} width={50} />

                                <div className="user-name">
                                    <h6 className="user-title">{student?.full_name}</h6>
                                    <div className="user-role">
                                        CLASS: <strong>{student?.current_class.name}</strong> | REG NO: <strong>{student.reg_no}</strong> |{" "}
                                        <span className="badge badge-primary rounded">{GetAge(student.dob)} Years</span> | GENDER: <strong>{student.gender}</strong> |{" "}
                                        <span className="text-primary">FIRST GUARDIAN</span>: <strong className="text-primary">{student.guardians[0].full_name}</strong> | STATE OF ORIGIN:{" "}
                                        <strong>{student.state}</strong>
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
