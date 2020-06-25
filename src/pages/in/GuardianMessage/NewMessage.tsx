import React, { useState, useEffect, FC } from "react";
import { GET_LEVELS } from "../../../queries/Level.query";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import Select from "react-select";
import { toast } from "react-toastify";
import { CleanMessage, GetAppName } from "./../../../context/App";
import { GET_CLASSES_MINI } from "./../../../queries/Class.query";
import MessageEditor from "../../partials/MessagingEditor";
import Helmet from "react-helmet";

interface iProp {
    onSubmit: any;
    total?: number;
}
const NewGuardianMessage: FC<iProp> = ({ onSubmit, total = 0 }) => {
    const [classList, setClassList] = useState<any>([]);
    const [single_class, setSingleClass] = useState<any>();
    const [levels, setLevels] = useState<any>([]);
    const [level, setLevel] = useState<any>();

    const { loading: levelLoading } = useQuery(GET_LEVELS, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => setLevels(d.GetLevels.docs),
    });

    const [getClassFunc, { loading: classLoading }] = useLazyQuery(GET_CLASSES_MINI, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => setClassList(d.GetClasses.docs),
    });

    useEffect(() => {
        if (level) getClassFunc({ variables: { level: level.value } });
    }, [level, getClassFunc]);

    return (
        <>
            <Helmet>New Guardian Message| {GetAppName()}</Helmet>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="element-box">
                                <label htmlFor="level">Select level</label>
                                <Select
                                    id="level"
                                    onChange={(item: any) => setLevel(item)}
                                    isLoading={levelLoading}
                                    isSearchable={true}
                                    options={levels.map((item: any) => ({ value: item.id, label: item.name }))}
                                    isMulti={false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6 fade-in">
                            <div className="element-box">
                                <label htmlFor="class_id">Select Class (Optional)</label>
                                <Select
                                    id="class_id"
                                    onChange={(item: any) => setSingleClass(item)}
                                    isLoading={classLoading}
                                    isSearchable={true}
                                    options={classList.map((item: any) => ({ value: item.id, label: item.name }))}
                                    isMulti={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="element-box no-bg bg-white">
                        <h5 className="element-header">Message Area</h5>
                        {level && !single_class && (
                            <p className="fade-in">
                                Sending message to{" "}
                                <span>
                                    <strong>{level.label}</strong>
                                </span>{" "}
                                students' guardians
                            </p>
                        )}
                        {level && single_class && (
                            <p className="fade-in">
                                Sending message to{" "}
                                <span>
                                    <strong>{single_class.label}</strong>
                                </span>{" "}
                                students' guardians
                            </p>
                        )}
                        <MessageEditor total={total} onSubmit={async (message: string) => onSubmit({ single_class: single_class.value, level: level.value, message })} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewGuardianMessage;
