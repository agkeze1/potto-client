/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
import Days from "../../../data/days.json";

interface iProp {
    items: Array<any>;
    onItem: any;
}

const TimetableAttendance: FC<iProp> = ({ items, onItem }) => {
    const getDay = (day: string): string => {
        if (day) {
            const _item = Days.days.find((c) => c.value === day);
            if (_item) return _item.label;
        }
        return day;
    };
    if (items.length)
        return (
            <div className="row">
                <h6 className="element-header">Assigned timetable</h6>
                {items.map((item: any, idx: number) => (
                    <div key={idx} className="col-12">
                        <h6 className="element-header">{getDay(item.day)}</h6>
                        <div className="row">
                            {item.timetable_list.map((time: any, index: number) => (
                                <div key={index} className="col-12">
                                    <a onClick={() => onItem(time)} className="element-box el-tablo no-bg bg-white" href="javascript:void(0)">
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
            <h3 className="text-info">No Record</h3>
            <p>Select another teacher to view assigned timetable</p>
        </div>
    );
};

export default TimetableAttendance;
