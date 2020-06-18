import React, { FC } from "react";

interface iProp {
    items: Array<any>;
}

const StudentListing: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Passport</th>
                            <th>FullName</th>
                            <th>Reg. No</th>
                            <th>Class</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((stu: any, index: number) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="user-with-avatar clickable" data-toggle="modal">
                                        <img src={stu.passport || "/avatar.png"} alt="" />
                                    </div>
                                </td>
                                <td>{stu.full_name}</td>
                                <td>{stu.reg_no}</td>
                                <td>
                                    <strong>{stu.current_class?.name}</strong>
                                </td>
                                <td>{stu.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return null;
};

export default StudentListing;
