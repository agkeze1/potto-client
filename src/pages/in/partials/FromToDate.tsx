import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";

interface IProps {
  onSubmit: any;
  onFromChange: any;
  onToChange: any;
}

const FromToDate: FC<IProps> = ({ onSubmit, onFromChange, onToChange }) => {
  const [dateRange, SetDateRange] = useState<any>();

  return (
    <div className="element-box">
      <h6 className="element-header">Select Date Range</h6>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Date Section */}
        <div className="row">
          <div className="col-md-6">
            {/* From Date*/}
            <label>From </label>
            <br />
            <DatePicker
              placeholderText="day, month year"
              selected={dateRange?.fromDate}
              onChange={(date) => {
                SetDateRange({
                  ...dateRange,
                  fromDate: date,
                });
                onFromChange(date);
              }}
              className="form-control"
              dateFormat="d, MMMM yyyy"
            />
          </div>
          <div className="col-md-6">
            {/* To Date */}
            <label>To </label>
            <br />
            <DatePicker
              placeholderText="day, month year"
              selected={dateRange?.toDate}
              onChange={(date) => {
                SetDateRange({
                  ...dateRange,
                  toDate: date,
                });
                onToChange(date);
              }}
              className="form-control"
              dateFormat="d, MMMM yyyy"
            />
          </div>
          <div className="col-12 mt-3">
            <div className="buttons-w">
              <button className="btn btn-primary px-3" type="submit">
                View Attendance
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FromToDate;
