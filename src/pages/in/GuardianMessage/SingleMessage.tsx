import React, { FC } from "react";
import { cleanDate } from "../../../context/App";
import { Doughnut } from "react-chartjs-2";
import { CountCard } from "../partials/CountCard";
import StudentListing from "../../partials/StudentItems";

interface iProp {
    item: any;
    onBack: any;
}
const SingleGuardianMessage: FC<iProp> = ({ item, onBack }) => {
    const loading = false;
    if (item)
        return (
            <>
                <div className="row">
                    <div className="col-md-8 col-12">
                        <div className="element-box no-bg bg-white">
                            <h5 className="element-header">
                                <button onClick={() => onBack()} className="btn btn-default">
                                    <i style={{ fontSize: "1.5em" }} className="os-icon os-icon-arrow-left2 text-primary"></i>
                                </button>
                                Message Detail
                            </h5>
                            <strong>Message</strong> <br />
                            <p>{item.message}</p>
                            <strong>Date & Time</strong>
                            <p>{cleanDate(item.created_at, false)}</p>
                            <strong>Status</strong>
                            <p>
                                {item.status ? <span className="badge badge-success text-uppercase">Sent</span> : <span className="badge badge-danger text-uppercase">Failed</span>}
                                {!item.status && <span>{item.sms_message}</span>}
                            </p>
                            <h6 className="element-header">Students</h6>
                            <StudentListing items={item.students} />
                        </div>
                    </div>
                    <div className="col-md-4 col-12">
                        <div className="row">
                            <div className="col-12">
                                <h6 className="element-header">Message Summary</h6>
                            </div>
                            <div className="col-md-12 col-12 mb-4">
                                <Doughnut
                                    data={{
                                        labels: ["Successful", "Failed"],
                                        datasets: [
                                            {
                                                data: [item.successful_phone.length, item.invalid_phone.length],
                                                backgroundColor: ["#3ee36f", "lightcoral"],
                                                hoverBackgroundColor: ["#3ee36f", "lightcoral"],
                                            },
                                        ],
                                    }}
                                    height={60}
                                    width={60}
                                    options={{
                                        cutoutPercentage: 80,
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <h6 className="element-header">Teacher Summary</h6>
                            </div>
                            <div className="col-12">
                                <CountCard title="Total Student Selected" loading={loading} value={item.students.length} cssClass="bg-light-green" />
                            </div>

                            <div className="col-12">
                                <h6 className="element-header">SMS Summary</h6>
                            </div>

                            <div className="col-12">
                                <CountCard title="Successful Numbers" loading={loading} value={item.successful_phone.length} cssClass="bg-darkseagreen" />
                            </div>
                            <div className="col-md-6 col-12">
                                <CountCard title="Invalid Numbers" loading={loading} value={item.invalid_phone.length} cssClass="bg-lightcoral" />
                            </div>
                            <div className="col-md-6 col-12">
                                <CountCard title="SMS Page" loading={loading} value={item.smsPage} cssClass="bg-light-blue" />
                            </div>
                            {item.successful_phone.length > 0 && (
                                <div className="col-12 fade-in">
                                    <h6 className="element-header">Successful Phones</h6>
                                    <div className="box-parent">
                                        {item.successful_phone.map((phone: string) => (
                                            <div key={phone} className="box">
                                                <strong>{phone}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {item.invalid_phone.length > 0 && (
                                <div className="col-12 fade-in">
                                    <h6 className="element-header">Invalid Phones</h6>
                                    <div className="box-parent">
                                        {item.invalid_phone.map((phone: string) => (
                                            <div key={phone} className="box">
                                                <strong>{phone}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );

    return null;
};

export default SingleGuardianMessage;
