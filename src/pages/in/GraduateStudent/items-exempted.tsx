/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProp {
    items: Array<any>;
    onCheck: any;
}

const StudentCheckExemptedList: FC<iProp> = ({ items, onCheck }) => {
    if (items.length)
        return (
            <div className="row">
                {items.map((item: any, idx) => (
                    <div key={idx} className="col-md-3 col-12 fade-in">
                        <div className="element-box text-center no-bg bg-white">
                            <div className="text-right">
                                <a className="btn-icon" onClick={() => onCheck(item)} title={`Remove ${item.full_name}`} href="javascript:void(0)">
                                    <i className="os-icon os-icon-close"></i>
                                </a>
                            </div>
                            <br />
                            <img src={item.passport || "/avatar.png"} className="avatar" style={{ width: "80px", height: "80px" }} alt={item.surname} />
                            <h6>{item.full_name}</h6>
                            <span className="text-uppercase">{item.reg_no}</span> <br />
                            <span className="text-success">
                                Class: <strong>{item.current_class.name}</strong>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );

    return null;
};

export default StudentCheckExemptedList;
