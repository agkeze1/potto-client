/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProps {
    items: Array<any>;
    onRemove?: any;
}

const FeedbackTypeList: FC<iProps> = ({ items, onRemove }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th className="text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td>
                                    <strong>{idx + 1}</strong>
                                </td>
                                <td>{item.name}</td>
                                <td className="row-actions text-center">
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
                <h2 className="text-danger">No Feedback type found!</h2>
            </div>
        </>
    );
};

export default FeedbackTypeList;
