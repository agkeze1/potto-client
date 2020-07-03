/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../context/App";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../queries/Level.query";
import { GET_CLASSES } from "../../queries/Class.query";
import LoadingState from "../partials/loading";
import Select from "react-select";
import { GET_CLASS_TIMETABLE } from "../../queries/Timetable.query";
import TimetableList from "./partials/TimetableList";
import { toast } from "react-toastify";
import { EventEmitter } from "../../events/EventEmitter";
import { ACTION_EVENT } from "./../../events/index";

const ViewTimetable: FC<IProps> = ({ history }) => {
    const [ShowTimetable, SetShowTimetable] = useState<boolean>(false);
    const [showFilter, SetShowFilter] = useState<boolean>(true);

    const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
    const [levels, SetLevel] = useState<any>([]);
    const [classes, SetClasses] = useState<any>([]);
    const [activeLevel, SetActiveLevel] = useState<any>({});
    const [timetableInput, SetTimetableInput] = useState<any>();

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Get  School of logged in user
    const { school } = authService.GetUser();

    // Get Levels for level input
    const { loading: lLoading, refetch } = useQuery(GET_LEVELS, {
        variables: {
            school: school.id,
        },
        onError: (err) => {
            toast.error(CleanMessage(err.message));
            SetShowLevelsRefresh(true);
        },
        onCompleted: (data) => {
            if (data && data.GetLevels) {
                SetLevel(
                    data.GetLevels.docs.map((level: any) => ({
                        label: level.name,
                        value: level.id,
                    }))
                );
                SetShowLevelsRefresh(false);
            }
        },
        notifyOnNetworkStatusChange: true,
    });

    // Get classes for class input
    const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            if (data)
                SetClasses(
                    data.GetClasses.docs.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );
        },
    });

    // Fetch classes for Class input on Level change
    useEffect(() => {
        if (activeLevel?.id) {
            SetClasses(undefined);
            GetClasses({ variables: { level: activeLevel?.id } });
        }
    }, [activeLevel, SetClasses, GetClasses]);

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
                                <div className="element-box">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-12">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
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
                                            >
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        {/* Level input */}
                                                        <label>
                                                            Level <br />
                                                        </label>
                                                        <Select
                                                            isLoading={lLoading}
                                                            options={levels}
                                                            value={{
                                                                label: activeLevel?.name || <span className="text-gray">Select...</span>,
                                                                value: activeLevel?.id,
                                                            }}
                                                            onChange={(item: any) => {
                                                                SetActiveLevel({
                                                                    name: item?.label,
                                                                    id: item?.value,
                                                                });
                                                                SetTimetableInput({
                                                                    ...timetableInput,
                                                                    current_class: undefined,
                                                                });
                                                            }}
                                                        />
                                                        {showLevelsRefresh && (
                                                            <button
                                                                onClick={() => {
                                                                    SetShowLevelsRefresh(false);
                                                                    refetch();
                                                                }}
                                                                className="btn btn-primary btn-sm px-1 my-2"
                                                                type="submit"
                                                            >
                                                                Reload Level
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6">
                                                        {/* Class Input */}
                                                        <label>
                                                            Class <br />
                                                        </label>
                                                        <Select
                                                            options={classes}
                                                            value={{
                                                                label: timetableInput?.current_class?.name || <span className="text-gray">Select...</span>,
                                                                value: timetableInput?.current_class?.id,
                                                            }}
                                                            isLoading={cLoading}
                                                            onChange={(item: any) => {
                                                                SetTimetableInput({
                                                                    ...timetableInput,
                                                                    current_class: {
                                                                        name: item.label,
                                                                        id: item.value,
                                                                    },
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-12 mt-3">
                                                        <div className="buttons-w">
                                                            <button className="btn btn-primary px-3" type="submit">
                                                                View Timetable
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
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
                                        {" "}
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
