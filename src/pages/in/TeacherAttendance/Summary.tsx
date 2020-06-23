import React, { FC } from "react";
import { Accordion, AccordionItemHeading, AccordionItemButton, AccordionItem, AccordionItemPanel } from "react-accessible-accordion";
import { toPrettyTime, cleanDate } from "../../../context/App";

interface iProp {
    items: Array<any>;
}

const TeacherAttendanceSummary: FC<iProp> = ({ items }) => {
    if (items.length)
        return (
            <div>
                {items.map((item: any, idx: number) => (
                    <Accordion allowMultipleExpanded={true} key={idx} preExpanded={["accordion__panel-0"]} className="mb-2">
                        <AccordionItem>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <span className="element-header">
                                        <b className="text-uppercase">{item.subject.title}</b>
                                    </span>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel style={{ background: "white" }}>
                                {item.classes.map((_class: any, index: number) => (
                                    <React.Fragment key={index}>
                                        <h6 className="element-header">
                                            {_class.current_class.name} | Total Attendance: <span className="text-primary">{_class.total}</span> | Total Tardiness:{" "}
                                            <span className="text-danger">{toPrettyTime(_class.totalMinutes)}</span>
                                        </h6>
                                        <div className="text-center element-box no-bg no-shadow">
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Date</th>
                                                            <th>Tardiness</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {_class.items.map((_f: any, fIndex: number) => (
                                                            <tr key={fIndex}>
                                                                <td>
                                                                    <strong>{fIndex + 1}</strong>
                                                                </td>
                                                                <td>{cleanDate(new Date(parseInt(_f.date)).toISOString(), false, false)}</td>

                                                                <td className="text-danger">{toPrettyTime(_f.totalMinutes)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        );

    return (
        <div className="text-center pb-5" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h3 className="text-info">No Record</h3>
            <p>Select teacher to view the attendance report</p>
        </div>
    );
};
export default TeacherAttendanceSummary;
