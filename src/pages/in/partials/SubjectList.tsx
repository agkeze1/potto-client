import React, { FC } from "react";

interface IProps {
  subjects: any;
}

export const SubjectList: FC<IProps> = ({ subjects }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      {subjects?.length > 0 && (
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Title</th>
          </tr>
        </thead>
      )}

      <tbody>
        {subjects?.map((sub: any, index: number) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{sub.code}</td>
            <td>{sub.title}</td>
          </tr>
        ))}
        {subjects?.length === 0 && (
          <tr>
            <td colSpan={3}>
              <h5>No subjects found!</h5>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
