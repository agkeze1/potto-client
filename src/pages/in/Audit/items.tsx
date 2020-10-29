import React, { FC, useState } from "react";
import { AuditModel } from "../../../models/audit.model";
import TimeAgo from "react-timeago";
import { cleanDate, DefaultImage } from "./../../../context/App";

interface __ {
    items: Array<AuditModel>;
    onActionClicked: any;
    onUserClicked: any;
}

const AuditItems: FC<__> = ({ items, onActionClicked, onUserClicked }) => {
    const [active, setActive] = useState<string>("");
    if (items.length)
        return (
            <>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="uppercase thead-dark">
                            <tr>
                                <th style={{ width: "5%" }}>SN</th>
                                <th style={{ width: "25%" }}>Performed By</th>
                                <th style={{ width: "30%" }}>Summary</th>
                                <th style={{ width: "15%" }}>Action</th>
                                <th className="text-left" style={{ width: "15%" }}>
                                    DATE
                                </th>
                                <th style={{ width: "10%" }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr>
                                    <td>
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td>
                                        <div onClick={() => onUserClicked(item?.user?.id)} className="flex items-center  cursor-pointer">
                                            <img src={item?.user?.image || DefaultImage} alt={item?.user?.name} loading="lazy" width="50" className="mr-2 rounded-lg" />
                                            <div className="flex flex-col">
                                                <span className="font-bold">{item?.user?.name}</span>
                                                <span className="text-xs text-gray-600">{item?.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-left">{item.summary}</td>
                                    <td onClick={() => onActionClicked(item.action)} className="text-left uppercase cursor-pointer text-primary">
                                        {item.action}
                                    </td>
                                    <td className="text-left">
                                        <div className="font-bold">{cleanDate(item.created_at, true)}</div>

                                        <div className="intro-y text-primary text-xs">
                                            <TimeAgo date={new Date(item.created_at)} live={true} />
                                        </div>
                                    </td>
                                    <td className="table-report__action">
                                        <div className="flex justify-center items-center">
                                            <a
                                                id={idx + ""}
                                                onClick={() => setActive(item.desc)}
                                                className="flex items-center mr-3 text-primary p-2 rounded-lg"
                                                href="javascript:;"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                            >
                                                <i className="os-icon os-icon-align-right"></i> View
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Modal title
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="p-5">
                                    <code lang="js">{active}</code>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    return (
        <div className="fade-in text-center pb-5" style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img style={{ width: "20em" }} className="no-scale" src="/images/3.png" alt="404" />
            <h4 className="text-info mb-2">Record Not found!</h4>
            <p>Change filter or refresh the page.</p>
        </div>
    );
};

export default AuditItems;
