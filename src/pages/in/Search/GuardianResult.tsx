import React, { FC } from "react";
import Image from "../../partials/Image";
import { NavLink } from "react-router-dom";

interface iProps {
    items: Array<any>;
}

const GuardianResult: FC<iProps> = ({ items }) => {
    if (items.length)
        return (
            <>
                <h6 className="element-header">Found {Intl.NumberFormat().format(items.length)} guardian(s)</h6>
                <div className="row">
                    <div className="users-list-w">
                        {items.map((item, idx) => (
                            <div key={idx} className="user-w with-status status-green fade-in ">
                                <Image alt={item?.name} src={item?.image} width={50} />

                                <div className="user-name">
                                    <h6 className="user-title">
                                        <NavLink to={{ pathname: `/in/guardian/${item.id}` }}>{item?.name}</NavLink>
                                    </h6>
                                    <div className="user-role">
                                        PHONE NUMBER: <strong>{item.phone}</strong> | GENDER: <strong>{item.gender}</strong>
                                        {" | "}
                                        <span className="badge badge-primary rounded">{item.type.name}</span>| <span className="text-primary">STATE OF ORIGIN</span>:{" "}
                                        <strong className="text-primary">{item.state}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );

    return null;
};

export default GuardianResult;
