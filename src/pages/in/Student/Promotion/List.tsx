import React, { FC } from "react";

interface __ {
    items: Array<any>;
    onRemove: any;
    background: string;
}
const PromotionList: FC<__> = ({ items, onRemove, background }) => {
    return (
        <>
            <table style={{ background }} className="table table-bordered border-primary">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Select All</th>
                        <th>Passport</th>
                        <th>Full Name</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td>
                                <strong>{idx + 1}</strong>
                            </td>
                            <td>
                                <div className="custom-control custom-checkbox">
                                    <input
                                        onChange={() => onRemove(item)}
                                        checked
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={item.id}
                                    />
                                    <label className="custom-control-label" htmlFor={item.id}>
                                        Selected
                                    </label>
                                </div>
                            </td>
                            <td>
                                <div className="user-with-avatar clickable" data-toggle="modal">
                                    <img src={item.passport || "/avatar.png"} alt={item.first_name} />
                                </div>
                            </td>
                            <td>
                                {item.full_name}
                                <strong>
                                    <br />
                                    {item.reg_no}
                                </strong>
                            </td>
                            <td>{item.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default PromotionList;
