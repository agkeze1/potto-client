import React, { FC } from "react";

interface IProps {
    subjects: Array<any>;
    onRemoved?: any;
}

const Subjects: FC<IProps> = ({ subjects, onRemoved }) => (
    <div className="text-center element-box no-bg no-shadow">
        {subjects?.length > 0 && (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((sub: any, index: number) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{sub.code}</td>
                                <td>{sub.title}</td>
                                <td>
                                    <button onClick={() => onRemoved(sub)} className="btn btn-light text-danger">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        {subjects?.length === 0 && (
            <div className="text-center">
                <h5 className="text-danger">No subjects found!</h5>
            </div>
        )}
    </div>
);

export default Subjects;
