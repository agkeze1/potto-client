import React, { FC } from "react";
import { cleanDate } from "../../../context/App";

interface iProps {
    items: Array<any>;
    onSelect: any;
}

const TeacherMessageList: FC<iProps> = ({ items, onSelect }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-lightborder">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th style={{ width: "40%" }}>Message</th>
                            <th>Teachers</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Percent</th>
                            <th className="text-right">Date & Time</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx) => (
                            <tr key={idx}>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>{item.message}</td>
                                <td>
                                    <div className="cell-image-list">
                                        {item.teachers.slice(0, 3).map((teacher: any, index: number) => (
                                            <div key={index} className="cell-img" title={teacher.name} style={{ backgroundImage: "url(" + teacher.image || "/avatar.png)" }}></div>
                                        ))}
                                        {item.teachers.length > 3 && <div className="cell-img-more">+ {item.teachers.length - 3} more</div>}
                                    </div>
                                </td>
                                <td className="text-center">
                                    {item.status ? <span className="badge badge-success text-uppercase">Sent</span> : <span className="badge badge-danger text-uppercase">Failed</span>}
                                </td>
                                <td className="text-center">
                                    <div className="os-progress-bar primary">
                                        <div className="bar-level-1" style={{ width: "100%" }}>
                                            <div className="bar-level-2" style={{ width: "100%" }}>
                                                <div className="bar-level-3" title={`${item.percent}%`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right">{cleanDate(item.created_at, false)}</td>
                                <td className="text-right">
                                    <button onClick={() => onSelect(item)} className="btn btn-primary btn-sm">
                                        Detail <span className="os-icon os-icon-arrow-right7"></span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "column", minHeight: "450px" }}>
            <h4 className="text-danger">No Message found!</h4>
            <p>Click on 'New Message' button to create an item.</p>
        </div>
    );
};

export default TeacherMessageList;
