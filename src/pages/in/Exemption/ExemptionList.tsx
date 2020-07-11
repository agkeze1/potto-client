/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line
import React, { FC } from "react";
import { cleanDate } from "../../../context/App";

interface iProp {
    items: Array<any>;
    onView: any;
}

const ExemptionList: FC<iProp> = ({ items, onView }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Start</th>
                            <th className="text-center">End Date</th>
                            <th className="text-left">Description</th>
                            <th className="text-center">Students</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, index: number) => (
                            <tr>
                                <td>
                                    <strong>{index + 1}</strong>
                                </td>
                                <td>
                                    <strong>{cleanDate(item.start, true)}</strong>
                                </td>
                                <td className="text-center">
                                    <strong>{cleanDate(item.end, true)}</strong>
                                </td>
                                <td className="text-left">{item.desc}</td>
                                <td className="text-center">
                                    <div className="cell-image-list">
                                        {item.students.slice(0, 3).map((student: any, index: number) => (
                                            <div key={index} className="cell-img" title={student.full_name} style={{ backgroundImage: "url(" + student.passport || "/avatar.png)" }}></div>
                                        ))}
                                        {item.students.length > 3 && <div className="cell-img-more">+ {item.students.length - 3} more</div>}
                                    </div>
                                </td>

                                <td className="row-actions text-center">
                                    <a onClick={() => onView(item)} className="primary" href="#" title="View">
                                        <i className="os-icon os-icon-eye"></i>
                                    </a>
                                    {/* <a className="editButton" data-target="#editModal" data-toggle="modal" href="#" title="Update">
                                        <i className="os-icon os-icon-edit"></i>
                                    </a> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return (
        <div className="fade-in text-center pb-5" style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img style={{ width: "20em" }} className="no-scale" src="/images/3.png" alt="404" />
            <h4 className="text-info mb-2">Record Not found!</h4>
            <p>No Exemption Found. Click on "New Exemption" to add one.</p>
        </div>
    );
};

export default ExemptionList;
