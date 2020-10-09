/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { FC, useState, useEffect } from "react";
import Select from "react-select";
import { useLazyQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CLEAN_DATE, scrollTop } from "../../../../context/App";
import { GET_CLASS } from "../../../../queries/Class.query";
import LoadingState from "../../../partials/loading";
import { authService } from "../../../../services/Auth.Service";
import { ROLL_CALL } from "../../../../queries/attendance.query";
import LevelClassDateRange from "../../partials/LevelClassDateRange";
import { ToggleExpansion } from "../../../../context/App";
import attSort from "../../../../data/attSort.json";
import SmallImage from "../../partials/SmallImage";
import { IImageProp } from "../../../../models/IImageProp";
import ImageModal from "../../../partials/ImageModal";
import { NavLink } from "react-router-dom";

interface IProps {
    showFilter?: boolean;
}

const AttendanceResult: FC<IProps> = ({ showFilter }) => {
    const [showSummary, SetShowSummary] = useState<boolean>(true);
    const [activeLevel, SetActiveLevel] = useState<any>({});
    const [showAttendanceResult, SetShowAttendanceResult] = useState<boolean>();
    const [showLevelClass, SetShowLevelClass] = useState<boolean>(true);
    const [showAttendanceInfo, SetShowAttendanceInfo] = useState<boolean>();
    const [attendanceInput, SetAttendanceInput] = useState<any>();
    const [activeAttSort, SetActiveAttSort] = useState<number>(1);
    const [activeRecord, SetActiveRecord] = useState<any>();
    const [activeRecordAttendances, SetActiveRecordAttendances] = useState<any>();
    const [activeImg, SetActiveImg] = useState<IImageProp>({
        image: "/avatar.png",
        name: "Undefined",
    });

    // Get  School of logged in user
    const { school } = authService.GetUser();

    // Get Roll call attendance
    const [GetRollCall, { loading: rCLoading, data: rCData }] = useLazyQuery(ROLL_CALL, {
        onError: (err) => toast.error(err.message),
        onCompleted: (data) => {
            SetActiveRecord(data?.GetClassRollCallAttendances.docs[0]);
            SetActiveRecordAttendances(data?.GetClassRollCallAttendances.docs[0]?.attendances);
        },
    });

    useEffect(() => {
        let record: any[] = [];
        if (activeRecord) {
            if (activeAttSort === 1) record = activeRecord?.attendances;
            else if (activeAttSort === 2) record = activeRecord?.attendances?.filter((r: any) => r.present === true);
            else if (activeAttSort === 3) record = activeRecord?.attendances?.filter((r: any) => r.present === false);

            SetActiveRecordAttendances([...record]);
        }
    }, [activeAttSort, activeRecord]);

    // Get Class
    const [GetClass, { loading: cLoading, data: cData }] = useLazyQuery(GET_CLASS);

    return (
        <>
            {/* Level, Class and Date Range Input */}
            {showLevelClass && (
                <div className="content-box px-0">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <LevelClassDateRange
                                schoolId={school.id}
                                buttonText="View Attendance"
                                onLevelChange={(level: any) => {
                                    SetActiveLevel({
                                        name: level?.label,
                                        id: level?.value,
                                    });
                                    SetAttendanceInput({
                                        ...attendanceInput,
                                        current_class: undefined,
                                    });
                                }}
                                onClassChange={(_class: any) => {
                                    SetAttendanceInput({
                                        ...attendanceInput,
                                        current_class: {
                                            name: _class.label,
                                            id: _class.value,
                                        },
                                    });
                                }}
                                onFromChange={(fromDate: any) => {
                                    SetAttendanceInput({
                                        ...attendanceInput,
                                        fromDate,
                                    });
                                }}
                                onToChange={(toDate: any) => {
                                    SetAttendanceInput({
                                        ...attendanceInput,
                                        toDate,
                                    });
                                }}
                                onSubmit={(item: any) => {
                                    if (item?._class?.value && item?.fromDate && item?.toDate) {
                                        GetClass({
                                            variables: {
                                                id: attendanceInput?.current_class?.id,
                                            },
                                        });
                                        GetRollCall({
                                            variables: {
                                                _class: attendanceInput.current_class?.id,
                                                start: attendanceInput.fromDate,
                                                end: attendanceInput.toDate,
                                            },
                                        });
                                        SetShowAttendanceResult(true);
                                        SetShowAttendanceInfo(true);
                                        SetShowLevelClass(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAttendanceInfo && (
                <>
                    {/* Class info */}
                    {showFilter && (
                        <div className="col-12">
                            <div className="element-box bg-azure p-0 pl-3">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <LoadingState loading={cLoading} />
                                        <div className="users-list-w bdr-r">
                                            {cData?.GetClass.doc.form_teacher && (
                                                <div className="user-w">
                                                    <div className="user-avatar-w">
                                                        <div className="user-avatar">
                                                            <img alt={cData?.GetClass.doc.form_teacher?.name} src={cData?.GetClass.doc.form_teacher?.image} />
                                                        </div>
                                                    </div>
                                                    <div className="user-name">
                                                        <h6 className="user-title">
                                                            <NavLink
                                                                to={{
                                                                    pathname: `/in/teacher/${cData?.GetClass.doc.form_teacher?.id}`,
                                                                }}
                                                            >
                                                                {cData?.GetClass.doc.form_teacher?.name}
                                                            </NavLink>
                                                        </h6>
                                                        <div className="user-role text-primary">Form Teacher</div>
                                                    </div>
                                                </div>
                                            )}
                                            {!cData?.GetClass.doc.form_teacher && <h6 className="text-danger mt-3">No Form teacher</h6>}
                                        </div>
                                    </div>
                                    <div className="col-sm-6 mt-3">
                                        <label htmlFor="">
                                            Level | <b>{activeLevel?.name || "No Level"}</b>
                                        </label>
                                        <br />
                                        <label htmlFor="">
                                            Class | <b>{attendanceInput?.current_class?.name || "No Class"}</b>
                                        </label>
                                    </div>
                                    <div className="col-sm-2 mt-3">
                                        <a
                                            href="javascript:void(0)"
                                            title="Expand / Collapse"
                                            className="icon-lg m-3 float-right"
                                            onClick={() => {
                                                ToggleExpansion();
                                            }}
                                        >
                                            <i className="os-icon os-icon-maximize"></i>
                                        </a>
                                        <a
                                            href="javascript:void(0)"
                                            title="Change Class"
                                            className="icon-lg m-3 float-right"
                                            onClick={() => {
                                                SetShowLevelClass(true);
                                                SetShowAttendanceInfo(false);
                                                SetShowAttendanceResult(false);
                                            }}
                                        >
                                            <i className="os-icon os-icon-edit"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <LoadingState loading={rCLoading} />
                    {/* Attendance Result */}
                    {rCData?.GetClassRollCallAttendances.docs.length > 0 && showAttendanceResult && (
                        <>
                            {/* Date Section */}
                            <div className="col-md-4">
                                <div className="element-box bg-white mt-0">
                                    <h6 className="element-header">Date</h6>
                                    {rCData?.GetClassRollCallAttendances.docs.length > 0 &&
                                        rCData?.GetClassRollCallAttendances.docs.map((rec: any, index: number) => (
                                            <a
                                                key={index}
                                                className={`el-tablo att-date-crd ${activeRecord?.date === rec.date ? "active-att-date" : ""}`}
                                                href="javascript:void(0)"
                                                onClick={() => {
                                                    scrollTop();
                                                    SetActiveRecord(undefined);
                                                    setTimeout(() => {
                                                        SetActiveRecord(rec);
                                                        SetActiveRecordAttendances(rec?.attendances);
                                                    }, 0);
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-10">
                                                        <div className="">{CLEAN_DATE(rec.date)}</div>
                                                    </div>
                                                    <div className="col-2 text-center att-stu">
                                                        <b className="text-primary">{rec.total}</b>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </div>

                            {activeRecord && (
                                <>
                                    <div className="col-md-8">
                                        {/* Summary Section */}
                                        <div className="element-box bg-white">
                                            <span className="element-actions">
                                                <a
                                                    href="javascript:void(0)"
                                                    title="toggle collapse"
                                                    onClick={() => {
                                                        SetShowSummary(!showSummary);
                                                    }}
                                                >
                                                    <i className={`os-icon os-icon-chevron-${showSummary ? "down" : "up"} icon-lg`}></i>
                                                </a>
                                            </span>
                                            <h6
                                                className="element-header"
                                                style={{
                                                    marginBottom: showSummary ? "30px" : "0",
                                                }}
                                            >
                                                Summary
                                            </h6>
                                            {showSummary && (
                                                <div className="row">
                                                    {/* Counts */}
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo bg-darkseagreen no-bg" href="#">
                                                            <div className="label">Total Students</div>
                                                            <div className="value">{activeRecord.total}</div>
                                                        </a>
                                                    </div>
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo no-bg bg-azure" href="#">
                                                            <div className="label">Total present</div>
                                                            <div className="value text-primary">{activeRecord.stats?.present}</div>
                                                        </a>
                                                    </div>
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo no-bg bg-bisque mb-0" href="#">
                                                            <div className="label">Total absent</div>
                                                            <div className="value text-danger">{activeRecord.stats?.absent}</div>
                                                        </a>
                                                    </div>
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo no-bg bg-gold mb-0" href="#">
                                                            <div className="label">Manual</div>
                                                            <div className="value">{activeRecord.stats?.manual}</div>
                                                        </a>
                                                    </div>
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo no-bg bg-bisque mb-0" href="#">
                                                            <div className="label">Exempted</div>
                                                            <div className="value text-danger">{activeRecord.stats?.exempted}</div>
                                                        </a>
                                                    </div>
                                                    <div className="col-4">
                                                        <a className="element-box el-tablo no-bg bg-ivory mb-0" href="#">
                                                            <div className="label">Device Used</div>
                                                            <h5 className="text-primary">{activeRecord.device?.name}</h5>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Student attendance list Section */}
                                        <div className="element-box mt-0">
                                            <h6 className="element-header">Students</h6>
                                            <div className="text-center element-box no-bg no-shadow no-padding">
                                                <div className="col-md-4 float-right">
                                                    {/* Sort by Present/Absent input */}
                                                    <Select
                                                        options={attSort}
                                                        onChange={(item: any) => {
                                                            SetActiveAttSort(item?.value);
                                                        }}
                                                    />
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th className="text-left">Student</th>
                                                                <th className="text-left">Gender</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {activeRecordAttendances?.map((att: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td className="text-left">
                                                                        {" "}
                                                                        <SmallImage
                                                                            imgPath={att.student?.passport}
                                                                            onClick={() =>
                                                                                SetActiveImg({
                                                                                    image: att.student?.passport,
                                                                                    name: att.student?.full_name,
                                                                                })
                                                                            }
                                                                        />{" "}
                                                                        &nbsp;
                                                                        {att.student?.full_name}
                                                                    </td>
                                                                    <td className="text-left">{att.student?.gender}</td>
                                                                    <td>
                                                                        <label className={`badge ${att.present ? "badge-success-inverted" : "badge-danger-inverted"}`}>
                                                                            {att.present ? "Present" : "Absent"}
                                                                        </label>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {rCData?.GetClassRollCallAttendances.docs.length === 0 && showAttendanceResult && (
                        <div className="col-12 mt-3">
                            <h5 className="text-danger text-center fade-in">No Class Attendance record found!</h5>
                        </div>
                    )}{" "}
                </>
            )}

            {/* Modal for Image */}
            <ImageModal image={activeImg.image} name={activeImg.name} />
        </>
    );
};

export default AttendanceResult;
