import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import Helmet from "react-helmet";
import { CleanMessage, GetAppName } from "../../../../context/App";
import { GET_LEVELS } from "../../../../queries/Level.query";
import Select from "react-select";
import { toast } from "react-toastify";
import { GET_CLASSES_MINI } from "../../../../queries/Class.query";
import { GET_STUDENT_IN_CLASS, PROMOTE_STUDENT } from "../../../../queries/Student.query";
import LoadingState from "../../../partials/loading";
import PromotionList from "./List";

const NoRecord = (props: any) => (
    <div className="text-center" style={{ marginTop: "6em" }}>
        <h4 style={{ color: "gray" }}>No Record</h4>
        <p style={{ color: "#334152" }}>{props.title} is empty!</p>
    </div>
);

const PromoteStudent = () => {
    // GET LEVEL
    const { loading } = useQuery(GET_LEVELS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setLevels(d.GetLevels.docs.map((r: any) => ({ value: r.id, label: r.name })));
        }
    });

    // Get classes
    const [getClasses, { loading: gettingClass }] = useLazyQuery(GET_CLASSES_MINI, {
        onCompleted: (d) => {
            if (stage === "from") {
                setFromClasses(d.GetClasses.docs.map((r: any) => ({ value: r.id, label: r.name })));
            } else {
                setToClasses(d.GetClasses.docs.map((r: any) => ({ value: r.id, label: r.name })));
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    // Get student of same class
    const [getStudents, { loading: fetching }] = useLazyQuery(GET_STUDENT_IN_CLASS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setSelected(d.GetStudentOfSameClass.docs);
        }
    });

    const [promoteFunc, { loading: promoting }] = useMutation(PROMOTE_STUDENT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d.PromoteStudents) {
                toast.success("Student promotion completed successfully!");
                setSelected([]);
            } else {
                toast.error("failed");
            }
        }
    });

    const title = "Promote Student";
    const [levels, setLevels] = useState([]);
    const [selected, setSelected] = useState<Array<any>>([]);
    const [exempted, setExempted] = useState<Array<any>>([]);
    const [fromClasses, setFromClasses] = useState([]);
    const [toClasses, setToClasses] = useState([]);
    const [stage, setStage] = useState("from");
    // filter
    const [selectedFilter, setSelectedFilter] = useState<string>("");
    const [exemptedFilter, setExemptedFilter] = useState<string>("");
    const [classId, setClassId] = useState<string>("");

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
                        <div className="element-box no-bg bg-white" style={{ minHeight: "80vh" }}>
                            <h5 className="element-header">{title}</h5>
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="text-center">
                                        <h5>Move From</h5>
                                    </div>
                                    <div className="mt-4 mb-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Select
                                                    options={levels}
                                                    onChange={async (i: any) => {
                                                        setStage("from");
                                                        await getClasses({ variables: { level: i.value } });
                                                    }}
                                                    isLoading={loading}
                                                    placeholder="Select Level"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <Select
                                                    options={fromClasses}
                                                    onChange={async (i: any) =>
                                                        await getStudents({ variables: { classId: i.value } })
                                                    }
                                                    isLoading={gettingClass}
                                                    placeholder="Select Class"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ minHeight: "40vh" }}>
                                    <LoadingState loading={fetching} />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5 className="element-header">Selected Students</h5>

                                            {selected.length === 0 && <NoRecord title="Selected Student list" />}
                                            {selected.length > 0 && (
                                                <>
                                                    <input
                                                        defaultValue={selectedFilter}
                                                        className="form-control mb-2"
                                                        type="search"
                                                        placeholder="Filter list..."
                                                        onChange={({ currentTarget: { value } }) =>
                                                            setSelectedFilter(value)
                                                        }
                                                    />

                                                    <PromotionList
                                                        items={
                                                            selectedFilter !== ""
                                                                ? selected.filter((x) =>
                                                                      x.full_name.includes(selectedFilter)
                                                                  )
                                                                : selected
                                                        }
                                                        background="#d8f3dc"
                                                        onRemove={(item: any) => {
                                                            // get index
                                                            const _index = selected.findIndex(
                                                                (x: any) => x.id === item.id
                                                            );
                                                            if (_index !== -1) {
                                                                const __selected = [...selected];
                                                                __selected.splice(_index, 1);
                                                                // add to exempted
                                                                const __exempted = [...exempted];
                                                                __exempted.push(item);
                                                                setSelected(__selected);
                                                                setExempted(__exempted);
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <h5 className="element-header">Exempted Students</h5>
                                            {exempted.length === 0 && <NoRecord title="Exempted Student list" />}
                                            {exempted.length > 0 && (
                                                <>
                                                    <input
                                                        className="form-control mb-2"
                                                        type="search"
                                                        defaultValue={exemptedFilter}
                                                        onChange={({ currentTarget: { value } }) =>
                                                            setExemptedFilter(value)
                                                        }
                                                        placeholder="Filter list..."
                                                    />

                                                    <PromotionList
                                                        background="#fff3b0"
                                                        items={
                                                            exemptedFilter !== ""
                                                                ? exempted.filter((x) =>
                                                                      x.full_name.includes(exemptedFilter)
                                                                  )
                                                                : exempted
                                                        }
                                                        onRemove={(item: any) => {
                                                            const _index = exempted.findIndex(
                                                                (x: any) => x.id === item.id
                                                            );
                                                            if (_index !== -1) {
                                                                const __exempted = [...exempted];
                                                                __exempted.splice(_index, 1);
                                                                // add to exempted
                                                                const __selected = [...selected];
                                                                __selected.push(item);
                                                                setSelected(__selected);
                                                                setExempted(__exempted);
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="text-center">
                                        <i
                                            style={{ fontSize: "3em" }}
                                            className="os-icon os-icon-arrow-down6 text-primary"
                                        ></i>
                                        <h5>Move to</h5>
                                    </div>
                                    <div className="mt-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Select
                                                    options={levels}
                                                    onChange={async (i: any) => {
                                                        setStage("to");
                                                        await getClasses({ variables: { level: i.value } });
                                                    }}
                                                    isLoading={loading}
                                                    placeholder="Select Level"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <Select
                                                    options={toClasses}
                                                    onChange={(i: any) => setClassId(i.value)}
                                                    isLoading={gettingClass}
                                                    placeholder="Select Class"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 mb-4 text-right">
                                        <button
                                            onClick={async () => {
                                                const students = selected.map((c) => c.id);
                                                await promoteFunc({ variables: { students, classId } });
                                            }}
                                            disabled={loading || promoting}
                                            className="btn btn-block btn-primary"
                                        >
                                            {!promoting && <span>PROMOTE {selected.length} STUDENT(S)</span>}
                                            {promoting && "Please wait ..."}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromoteStudent;
