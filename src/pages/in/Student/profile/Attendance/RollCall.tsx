import React, { useState } from "react";

const RollCall = () => {
  // const {loading,data} = useQuery()
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Status</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>21st Jan. 2020</td>
              <td>
                <label className="badge badge-success-inverted">Attended</label>
              </td>
              <td>Device Component</td>
            </tr>
            <tr>
              <td>2</td>
              <td>29st Jan. 2020</td>
              <td>
                <label className="badge badge-danger-inverted">Absent</label>
              </td>
              <td>Device Component</td>
            </tr>
            <tr>
              <td>3</td>
              <td>6th Feb. 2020</td>
              <td>
                <label className="badge badge-warning-inverted">Exempted</label>
              </td>
              <td>Device Component</td>
            </tr>
          </tbody>
        </table>
      </div>
      !
    </>
  );
};

export default RollCall;
