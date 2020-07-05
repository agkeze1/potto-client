import React, { useState, FC } from "react";
import DatePicker from "react-datepicker";
import StudentCheckExemptedList from "../GraduateStudent/items-exempted";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_STUDENT_REG } from "../../../queries/Student.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import LoadingState from "../../partials/loading";

interface iProp {
    onSubmit: any;
}

const NewExemption: FC<iProp> = ({ onSubmit }) => {
    const [model, setModel] = useState<any>({ desc: "", start: new Date(), end: null });
    const [students, setStudents] = useState<Array<any>>([]);
    const [reg, setReg] = useState("");

    const [getStudentFunc, { loading }] = useLazyQuery(GET_STUDENT_REG, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            const { doc } = d.GetStudentByRegNo;
            const _items = [...students];
            _items.unshift(doc);
            setStudents(_items);
        },
    });
    return (
        <form
            onSubmit={(event) => {
                event?.preventDefault();
                if (students.length) {
                    onSubmit({ ...model, students: students.map((f) => f.id) });
                }
            }}
        >
            <div className="form-row">
                <div className="col">
                    <label htmlFor="from">Start from</label>
                    <DatePicker
                        className="form-control"
                        required
                        selected={model?.start}
                        dateFormat="dd, MMMM yyyy"
                        placeholderText="-- Select --"
                        onChange={(time) => {
                            setModel({
                                ...model,
                                start: time || new Date(),
                            });
                        }}
                    />
                </div>
                <div className="col">
                    <label htmlFor="tend">End date</label>
                    <DatePicker
                        className="form-control"
                        required
                        selected={model.end}
                        minDate={model.start}
                        dateFormat="dd, MMMM yyyy"
                        placeholderText="-- Select --"
                        onChange={(time) => {
                            setModel({
                                ...model,
                                end: time || new Date(),
                            });
                        }}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="desc">Description </label>
                <textarea onChange={({ currentTarget: { value } }) => setModel({ ...model, desc: value })} required className="form-control" name="desc" id="desc" rows={4}></textarea>
            </div>
            <h6 className="element-header">Add Students</h6>
            <div className="form-row">
                <div className="col">
                    <input onChange={({ currentTarget: { value } }) => setReg(value)} placeholder="enter student's reg no" className="form-control" type="search" name="reg" id="reg" />
                </div>
                <div className="col-1">
                    <button
                        disabled={loading}
                        onClick={async () => {
                            if (reg) {
                                await getStudentFunc({ variables: { reg } });
                            } else {
                                toast.info("Enter a valid reg no to continue.", {
                                    position: "bottom-right",
                                });
                            }
                        }}
                        type="button"
                        className="btn btn-primary"
                    >
                        Add
                    </button>
                </div>
                <LoadingState loading={loading} />
            </div>
            <StudentCheckExemptedList
                items={students}
                onCheck={(item: any) => {
                    const index = students.findIndex((c) => c.id === item.id);
                    if (index !== -1) {
                        const _items = [...students];
                        _items.splice(index, 1);
                        setStudents(_items);
                    }
                }}
            />
            {students.length === 0 && (
                <div className="text-center fade-in mt-3">
                    <h5 className="text-primary">No Student selected!</h5>
                    <p>Enter student's reg no and click "Add"</p>
                </div>
            )}
            <div className="form-group text-right">
                <button type="submit" className="btn btn-primary">
                    Submit Form
                </button>
            </div>
        </form>
    );
};

export default NewExemption;
