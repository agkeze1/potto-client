import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { FC, useState } from "react";
import Select from "react-select";
import { CLEAN_DATE, GetAge, cleanDate, CleanMessage } from "../../../../context/App";
import { GET_CLASSES } from "../../../../queries/Class.query";
import { toast } from "react-toastify";
import { UPDATE_STUDENT_CLASS } from "../../../../queries/Student.query";
import LoadingState from "../../../partials/loading";

interface IProp {
    student: any;
}
const BasicInfo: FC<IProp> = ({ student }) => {
    const [classes, setClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState<any>(undefined);
    const [item, setItem] = useState(student);

    const { loading } = useQuery(GET_CLASSES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            if (d.GetClasses) {
                const { docs } = d.GetClasses;
                setClass(
                    docs.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                    }))
                );
            }
        },
        variables: { level: item.current_class.level.id },
    });

    const [changeFunc, { loading: _loading }] = useMutation(UPDATE_STUDENT_CLASS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            if (d.UpdateStudentCurrentClass) {
                const { doc, message } = d.UpdateStudentCurrentClass;
                toast.success(message);
                setItem(doc);
                document.getElementById("close-modal-class")?.click();
            }
        },
    });
    return (
        <>
            <div className="text-center element-box no-bg no-shadow">
                <ul className="pro-details">
                    <li>
                        <span>Gender</span> | <b>{item.gender}</b>
                    </li>
                    <li>
                        <span>Date of Birth</span> | <b>{cleanDate(item.dob, true, false)}</b>
                        <span className="badge badge-primary ml-2 p-1">{GetAge(item.dob)}Yrs</span>
                    </li>
                    <li>
                        <span>Date Created</span> | <b>{CLEAN_DATE(item.created_at)}</b>
                    </li>
                    <li>
                        <span>Level</span> | <b>{item.current_class?.level?.name}</b>
                    </li>
                    <li>
                        <span>Class</span> | <b>{item.current_class?.name}</b> |
                        <button data-target="#classModal" data-keyboard="true" data-backdrop="static" data-toggle="modal" className="btn btn-primary btn-sm ml-3">
                            Change Class
                        </button>
                    </li>
                    <li>
                        <span>State of Origin</span> | <b>{item.state}</b>
                    </li>
                    <li>
                        <span>LGA</span> | <b>{item.lga}</b>
                    </li>
                    <li>
                        <span>Address</span> | <b>{item.address}</b>
                    </li>
                </ul>
            </div>
            <div aria-hidden="true" className="modal fade" id="classModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="regModalLabel">
                                UPDATE STUDENT CLASS
                            </h5>
                            <button className="close" id="close-modal-class" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body element-box no-shadow pb-2 bg-white no-bg">
                            <span>Current Class:</span>
                            <h5>{item.current_class.name}</h5>
                            <hr />
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    if (item.current_class.id === selectedClass?.value) {
                                        toast.info("Select a different class!");
                                        return;
                                    } else {
                                        await changeFunc({ variables: { id: student.id, _class: selectedClass.value } });
                                    }
                                }}
                                method="post"
                            >
                                <div className="form-group">
                                    <label htmlFor="_class">New Class</label>
                                    <Select onChange={(item: any) => setSelectedClass(item)} isLoading={loading} options={classes} placeholder="Select class" name="_class" />
                                    <LoadingState loading={_loading} />
                                </div>
                                <div className="mt-5 text-right">
                                    <button type="submit" className="btn btn-primary">
                                        Update Class
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasicInfo;
