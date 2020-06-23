/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { FC } from "react";
import days from "../../../data/days.json";

interface iProp {
    items: Array<any>;
}

const TeacherTimetableListing: FC<iProp> = ({ items }) => {
    const getLongDay = (day: string): string => {
        const _day = days.days.find((c) => c.value === day);
        if (_day) return _day.label;
        return day;
    };

    if (items.length)
        return (
            <div className="row">
                {items.map((item: any, idx: number) => (
                    <div key={idx} className="col-12">
                        <h6 className="element-header text-uppercase">{getLongDay(item.day)}</h6>
                        <div className="row">
                            {item.timetable_list.map((time: any, index: number) => (
                                <div key={index} className="col-12 col-md-4">
                                    <a className="element-box el-tablo no-bg bg-white" href="javascript:void(0)">
                                        <h6 className="element-header">
                                            {time.period.from_time} - {time.period.to_time} {time.period.total === 1 && <span className="badge badge-primary text-uppercase">single period</span>}
                                            {time.period.total === 2 && <span className="badge badge-primary text-uppercase">double period</span>}
                                        </h6>
                                        <strong>{time.assigned_class.name}</strong> <br />
                                        <span className="value">{time.subject.title}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

    return (
        <div className="element-box text-center pb-5" style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h3 className="text-info">No Record Found!</h3>
            <p>No timetable has been assigned to you.</p>
        </div>
    );
};

export default TeacherTimetableListing;
