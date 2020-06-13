/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
import { CLEAN_DATE } from "../../../context/App";

interface iProps {
    items: Array<any>;
    onResolve?: any;
    onView?: any;
}

const FeedbackList: FC<iProps> = ({ items, onResolve, onView }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td>1</td>
                                <td>{item.type.name}</td>
                                <td>{item.subject}</td>
                                <td>{CLEAN_DATE(item.created_at)}</td>
                                <td>{item.resolved ? <span className="badge badge-success-inverted">Attended</span> : <span className="badge badge-danger-inverted">Unattended</span>}</td>
                                <td className="row-actions text-center">
                                    <a onClick={() => onView(item)} href="#" title="View content" data-target="#ContentModal" data-toggle="modal">
                                        <i className="os-icon os-icon-eye"></i>
                                    </a>
                                    {!item.resolved && (
                                        <a onClick={() => onResolve(item)} className="text-success" href="#" title="Mark attended">
                                            <i className="os-icon os-icon-check-circle"></i>
                                        </a>
                                    )}
                                    {/* <a className="danger" href="#" title="Delete">
                                        <i className="os-icon os-icon-ui-15"></i>
                                    </a> */}
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
                <h2 className="text-danger">No Feedback found!</h2>
            </div>
        </>
    );
};

export default FeedbackList;
