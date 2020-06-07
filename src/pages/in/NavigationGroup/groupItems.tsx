/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProps {
    items: Array<any>;
    onRemove: any;
}

const NavigationGroupList: FC<iProps> = ({ items, onRemove }) => {
    if (items.length)
        return (
            <div className="table-responsive">
                <table className="table table-padded">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
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

                                <td>{item.desc}</td>
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
                <h2 className="text-danger">No Navigation Group found!</h2>
            </div>
        </>
    );
};

export default NavigationGroupList;
