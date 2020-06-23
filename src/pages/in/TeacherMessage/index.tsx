import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, cleanDate } from "./../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import LoadingState from "../../partials/loading";
import { GET_TEACHER_MESSAGE } from "../../../queries/teacher-message.query";
import TeacherMessageList from "./TeacherMessageList";
import { NavLink } from "react-router-dom";
import Pagination from "../../partials/Pagination";
import TeacherListing from "./TeacherListing";
import { CountCard } from "../partials/CountCard";
import { Doughnut } from "react-chartjs-2";

const TeacherMessage = () => {
    const title = "Teacher's Messaging";
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [item, setItem] = useState<any>(undefined);

    const { loading, fetchMore, data } = useQuery(GET_TEACHER_MESSAGE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { page, limit },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetTeacherMessageLog: fetchMoreResult.GetTeacherMessageLog };
            },
        });
    }, [page, limit, fetchMore]);

    return (
        <>
            <Helmet>
                <title>
                    {title} | {GetAppName()}
                </title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">{title}</h5>
                        <LoadingState loading={loading} />
                        <div className="row">
                            {data && !item && (
                                <>
                                    <div className="col-12 fade-in">
                                        <div className="element-box" style={{ minHeight: "480px" }}>
                                            <TeacherMessageList items={data.GetTeacherMessageLog.docs} onSelect={(__item: any) => setItem(__item)} />
                                        </div>
                                    </div>
                                    <div className="col-12 fade-in">
                                        <div className="element-box no-bg bg-white">
                                            <Pagination length={data.GetTeacherMessageLog.totalDocs} {...data.GetTeacherMessageLog} onPageClicked={(page: number) => setPage(page)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {data && item && (
                                <div className="col-12 fade-in">
                                    <div className="row">
                                        <div className="col-md-8 col-12">
                                            <div className="element-box no-bg bg-white">
                                                <h5 className="element-header">
                                                    <button onClick={() => setItem(undefined)} className="btn btn-default">
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
                                                {item.excluded.length > 0 && (
                                                    <>
                                                        <h6 className="element-header">Excluded Teachers</h6>
                                                        <TeacherListing items={item.excluded} />
                                                    </>
                                                )}
                                                <h6 className="element-header">Teacher</h6>
                                                <TeacherListing items={item.teachers} />
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <h6 className="element-header">Message Summary</h6>
                                                </div>
                                                <div className="col-md-12 col-12 mb-4">
                                                    <div className="row justify-content-center">
                                                        <div className="col-9">
                                                            <Doughnut
                                                                data={{
                                                                    labels: ["Sent", "Failed"],
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
                                                    </div>
                                                    <div className="row justify-content-center">
                                                        <div className="col-9">
                                                            <Doughnut
                                                                data={{
                                                                    labels: ["Teacher Selected", "Excluded"],
                                                                    datasets: [
                                                                        {
                                                                            data: [item.teachers.length, item.excluded.length],
                                                                            backgroundColor: ["#3ee36f", "#0582cc"],
                                                                            hoverBackgroundColor: ["#3ee36f", "#0582cc"],
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
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <h6 className="element-header">Teacher Summary</h6>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <CountCard title="Selected Teachers" loading={loading} value={item.teachers.length} cssClass="bg-light-green" />
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <CountCard title="Excluded Teachers" loading={loading} value={item.excluded.length} cssClass="bg-light-blue" />
                                                </div>
                                                <div className="col-12">
                                                    <h6 className="element-header">SMS Summary</h6>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <CountCard title="Total Numbers" loading={loading} value={item.all_phone.length} cssClass="bg-gainsboro" />
                                                </div>
                                                <div className="col-md-6 col-12">
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fab">
                <NavLink to="/in/messaging/teachers/new" className="btn btn-primary btn-round">
                    <i className="os-icon os-icon-users"></i> <span>New Message</span>
                </NavLink>
            </div>
        </>
    );
};

export default TeacherMessage;
