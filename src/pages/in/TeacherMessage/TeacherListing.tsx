import React, { FC } from "react";

interface iProp {
    items: Array<any>;
}

const TeacherListing: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>
                                    <div className="user-with-avatar clickable">
                                        <img src={item.image || "/avatar.png"} alt={item.first_name} />
                                    </div>
                                </td>
                                <td>{item.name}</td>
                                <td>
                                    <strong>{item.phone}</strong>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return null;
};

export default TeacherListing;
