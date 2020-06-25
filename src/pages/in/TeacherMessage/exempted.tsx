/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";

interface iProp {
    items: Array<any>;
    onCheck: any;
}

const TeacherExemptedList: FC<iProp> = ({ items, onCheck }) => {
    if (items.length)
        return (
            <div className="row">
                {items.map((item: any, idx) => (
                    <div key={idx} className="col-md-3 col-12 slit-out-horizontal slit-in-vertical">
                        <div className="element-box text-center no-bg bg-white">
                            <div className="text-right">
                                <a className="btn-icon" onClick={() => onCheck(item)} title={`Remove ${item.name}`} href="javascript:void(0)">
                                    <i className="os-icon os-icon-close"></i>
                                </a>
                            </div>
                            <br />
                            <img src={item.image || "/avatar.png"} className="avatar" style={{ width: "80px", height: "80px" }} alt={item.first_name} />
                            <h6>{item.name}</h6>
                            <span className="text-uppercase text-primary">
                                <i className="os-icon os-icon-phone"></i> {item.phone}
                            </span>{" "}
                            <br />
                        </div>
                    </div>
                ))}
            </div>
        );

    return null;
};

export default TeacherExemptedList;
