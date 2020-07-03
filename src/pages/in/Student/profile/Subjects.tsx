import React, { FC } from "react";

interface IProps {
  subjects: any;
  selected?: boolean;
}

const Subjects: FC<IProps> = ({ subjects, selected }) => (
  <div className="text-center element-box no-bg no-shadow">
    <div className="text-right">
      {/* Subjects */}
      <label
        className={
          selected ? "badge badge-success-inverted" : "btn btn-sm btn-secondary"
        }
        style={{ padding: "4px 5px" }}
      >
        {selected ? "Selected" : "General"}
      </label>
    </div>
    {subjects?.length > 0 && (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sub.code}</td>
                <td>{sub.title}</td>
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
