import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import Select from "react-select";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../../queries/Level.query";
import { toast } from "react-toastify";
import { GET_STUDENT_OFF, GRADUATE_STUDENTS } from "../../../queries/Student.query";
import LoadingState from "../../partials/loading";
import StudentCheckList from "./items";
import StudentCheckExemptedList from "./items-exempted";

const GraduateStudent = () => {
    const title = "Graduate Student";
    const [levels, setLevels] = useState([]);
    const [dueStudents, setDueStudent] = useState<Array<any>>([]);
    const [excludedStudents, setExcludedStudent] = useState<Array<any>>([]);
    const [level, setLevel] = useState();

    // fetch level
    const { loading: levelLoading } = useQuery(GET_LEVELS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d.GetLevels) {
                setLevels(
                    d.GetLevels.docs.map((l: any) => ({
                        value: l.id,
                        label: l.name,
                    }))
                );
            }
        },
    });

    const [getStudentFunc, { loading }] = useLazyQuery(GET_STUDENT_OFF, {
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d.GetStudentsForGraduation) {
                setDueStudent(d.GetStudentsForGraduation.docs);
                setExcludedStudent([]);
            }
        },
    });

    const isStudentIn = (item: any): boolean => {
        const index = dueStudents.findIndex((c: any) => c.id.toString() === item.id.toString());
        return index !== -1;
    };

    const moveStudent = (item: any): void => {
        if (isStudentIn(item)) {
            // move student out
            const _items = [...excludedStudents, item];
            setExcludedStudent(_items);

            //
            const _index = dueStudents.findIndex((c: any) => c.id === item.id);
            const __due = [...dueStudents];
            __due.splice(_index, 1);
            setDueStudent(__due);
        } else {
            // move student back in
            const _items = [...dueStudents, item];
            setDueStudent(_items);

            //
            const _index = excludedStudents.findIndex((c: any) => c.id === item.id);
            const __due = [...excludedStudents];
            __due.splice(_index, 1);
            setExcludedStudent(__due);
        }
    };

    const [graduateFunc, { loading: gLoading }] = useMutation(GRADUATE_STUDENTS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d.GraduateStudents) {
                setDueStudent([]);
                setExcludedStudent([]);
                toast.success(d.GraduateStudents.message);
                setLevel(undefined);
            }
        },
    });

    useEffect(() => {
        if (level) getStudentFunc({ variables: { level } });
    }, [getStudentFunc, level]);

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
                        <div className="row">
                            <div className="col-md-6 col-12 ">
                                <div className="element-box pb-4">
                                    <label htmlFor="level">Select level to proceed</label>
                                    <Select isLoading={levelLoading} placeholder="-Please Level-" isMulti={false} id="level" options={levels} onChange={(item: any) => setLevel(item.value)} />
                                    <LoadingState loading={loading} />
                                </div>
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="row justify-content-end">
                                    <div className="col-6 text-center">
                                        <div className="element-box">
                                            <p>Students to Graduate</p>
                                            <h1 className="text-success">{dueStudents.length}</h1>
                                        </div>
                                    </div>
                                    <div className="col-6 text-center">
                                        <div className="element-box">
                                            <p>Exempted Students</p>
                                            <h1 className="text-info">{excludedStudents.length}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            {excludedStudents.length > 0 && (
                                <div className="fade-in">
                                    <h5 className="element-header">Exempted Students</h5>
                                    <StudentCheckExemptedList items={excludedStudents} onCheck={(item: any) => moveStudent(item)} />
                                </div>
                            )}
                        </div>
                        {dueStudents.length > 0 && (
                            <>
                                <div className="fade-in">
                                    <div className="element-box no-bg bg-white">
                                        <label htmlFor="offLevel">Select student to exempt</label>
                                        <Select
                                            id="offLevel"
                                            placeholder="-Please Level-"
                                            isMulti={false}
                                            options={dueStudents.map((i: any) => ({ value: i.id, label: i.full_name }))}
                                            onChange={(item: any) => {
                                                const _item = dueStudents.find((c: any) => c.id === item.value);
                                                moveStudent(_item);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="fade-in">
                                    <h5 className="element-header">Graduating Students</h5>
                                    <StudentCheckList items={dueStudents} onCheck={(item: any) => moveStudent(item)} />
                                    <div className="text-right">
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to proceed?")) {
                                                    const users = dueStudents.map((_: any) => _.id); // select on students' ids
                                                    await graduateFunc({ variables: { users } });
                                                }
                                            }}
                                            type="button"
                                            className="btn btn-primary"
                                        >
                                            Proceed <i className="os-icon os-icon-arrow-right7"></i>
                                        </button>
                                        <LoadingState loading={gLoading} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GraduateStudent;
