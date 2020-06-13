/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProp {
    items: Array<any>;
    onCheck: any;
}

const StudentCheckList: FC<iProp> = ({ items, onCheck }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Passport</th>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx} className="clickable" onClick={() => onCheck(item)}>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>
                                    <div className="user-with-avatar clickable">
                                        <img src={item.passport || "/avatar.png"} alt={item.surname} />
                                    </div>
                                </td>
                                <td>{item.full_name}</td>
                                <td>{item.reg_no}</td>
                                <td>{item.current_class?.name}</td>
                                <td>{item.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return null;
};

export default StudentCheckList;
