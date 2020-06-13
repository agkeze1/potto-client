/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProp {
    items: Array<any>;
    onEdit: any;
    onRemove: any;
}

const AdminList: FC<iProp> = ({ items, onEdit, onRemove }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th className="text-right">Phone</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx) => (
                            <tr key={idx}>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>
                                    <div className="user-with-avatar clickable">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.gender || "No set"}</td>
                                <td className="text-right">{item.phone}</td>
                                <td className="row-actions text-center">
                                    <a data-target="#editModal" data-toggle="modal" href="#" onClick={() => onEdit(item)} title="Edit">
                                        <i className="os-icon os-icon-edit"></i>
                                    </a>
                                    <a onClick={() => onRemove(item)} className="danger" href="#" title="Delete">
                                        <i className="os-icon os-icon-ui-15"></i>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    return (
        <div className="text-center">
            <h2 className="text-danger m-5"> No record found!</h2>
        </div>
    );
};

export default AdminList;
