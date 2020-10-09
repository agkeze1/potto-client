/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../context/App";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import {  useLazyQuery } from "@apollo/react-hooks";
import LoadingState from "../partials/loading";
import { GET_CLASS_TIMETABLE } from "../../queries/Timetable.query";
import TimetableList from "./partials/TimetableList";
import { toast } from "react-toastify";
import { EventEmitter } from "../../events/EventEmitter";
import { ACTION_EVENT } from "./../../events/index";
import LevelClass from "./partials/LevelClass";

const ViewTimetable: FC<IProps> = ({ history }) => {
    const [ShowTimetable, SetShowTimetable] = useState<boolean>(false);
    const [showFilter, SetShowFilter] = useState<boolean>(true);

    const [activeLevel] = useState<any>({});
    const [timetableInput, SetTimetableInput] = useState<any>();

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Get  School of logged in user
    const { school } = authService.GetUser();

    const [GetTimetable, { loading: tTLoading, data: tTData, refetch: refetchFunc }] = useLazyQuery(GET_CLASS_TIMETABLE, {
        onError: (err) => toast.error(CleanMessage(err.message)),
    });

    // Toggle Timetable Expansion
    const ExpandTimetable = () => {
        const sideNav = document.getElementById("sideNav");
        const header = document.getElementById("header");

        //Toggle sideNav visibility
        if (sideNav) {
            if (sideNav.style.display === "none") {
                sideNav.style.display = "block";
            } else {
                sideNav.style.display = "none";
            }
        }

        // Toggle header visibility
        if (header) {
            if (header.style.display === "none") {
                header.style.display = "block";
            } else {
                header.style.display = "none";
            }
        }
    };

    EventEmitter.subscribe(ACTION_EVENT.TIMETABLE.CREATED, async () => await refetchFunc());

    return (
        <>
            <Helmet>
                <title>View Timetable | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        {showFilter && (
                            <>
                                <h5 className="element-header">View Timetable</h5>
                                {/* Select Level and Class Section */}
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <LevelClass
                                            schoolId={school.id}
                                            btnText="View Timetable"
                                            onLevelChange={() => {
                                                SetTimetableInput({
                                                    ...timetableInput,
                                                    current_class: undefined,
                                                });
                                            }}
                                            onClassChange={(_class: any) => {
                                                SetTimetableInput({
                                                    ...timetableInput,
                                                    current_class: {
                                                        name: _class.label,
                                                        id: _class.value,
                                                    },
                                                });
                                            }}
                                            onSubmit={() => {
                                                if (timetableInput?.current_class) {
                                                    SetShowTimetable(true);
                                                    SetShowFilter(false);
                                                    GetTimetable({
                                                        variables: {
                                                            _class: timetableInput.current_class?.id,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <LoadingState loading={tTLoading} />

                        {/* Selected Level and class timetable */}
                        {ShowTimetable && tTData?.GetClassTimetable && (
                            <div className="element-box">
                                <span className="element-actions">
                                    <a
                                        href="#"
                                        title="Change Class"
                                        className="m-3"
                                        onClick={() => {
                                            SetShowFilter(true);
                                            SetShowTimetable(false);
                                        }}
                                    >
                                        <i className="os-icon os-icon-edit"></i>
                                    </a>
                                    <a
                                        href="#"
                                        title="Toggle expasion"
                                        onClick={() => {
                                            ExpandTimetable();
                                        }}
                                    >
                                        <i className="os-icon os-icon-maximize"></i>
                                    </a>
                                </span>
                                <h6 className="element-header">
                                    <b className="text-primary mr-2">
                                
                                        {activeLevel?.name} - {timetableInput?.current_class?.name}
                                    </b>
                                    Timetable
                                </h6>
                                <div className="table-responsive">
                                    <TimetableList classId={timetableInput.current_class?.id} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewTimetable;
