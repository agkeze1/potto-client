/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProps {
    items: Array<any>;
    onView: any;
    onRemove: any;
}

const NavigationList: FC<iProps> = ({ items, onView, onRemove }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Group</th>
                            <th>Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>{item.name}</td>
                                <td>
                                    <i className={item.icon}></i>
                                    {item.icon}
                                </td>
                                <td>{item.group.name}</td>
                                <td>{item.role.name}</td>
                                <td className="row-actions text-center">
                                    <a href="#" onClick={() => onView(item)} title="View Details" data-target="#DescriptionModal" data-toggle="modal">
                                        <i className="os-icon os-icon-alert-octagon"></i>
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
        <>
            <div className="text-center pt-5 fade-in">
                <h2 className="text-danger">No Navigation found!</h2>
            </div>
        </>
    );
};

export default NavigationList;
