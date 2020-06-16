import React, { FC, useState } from "react";
import days from "../../../data/days.json";
import { useQuery } from "@apollo/react-hooks";
import { GET_CLASS_TIMETABLE } from "../../../queries/Timetable.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import LoadingState from "../../partials/loading";

interface IProps {
  level: any;
  _class: any;
  onTimetableClick: any;
}

const DayTimetable: FC<IProps> = ({ level, _class, onTimetableClick }) => {
  const [activeRecord, SetActiveRecord] = useState<any>();

  // Get Class timetable
  const { loading, data } = useQuery(GET_CLASS_TIMETABLE, {
    variables: { _class: _class?.value },
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => SetActiveRecord(data.GetClassTimetable.docs[0]),
  });

  return (
    <div className="row">
      <LoadingState loading={loading} />
      {/* Timetable section */}
      {data && (
        <>
          <div className="col-md-4">
            <div className="element-box no-bg bg-white">
              <h6 className="element-header">Days</h6>
              {data.GetClassTimetable.docs.map((item: any, idx: number) => (
                <a
                  key={idx}
                  className={`el-tablo att-date-crd ${
                    activeRecord?.day === item.day ? "active-att-date" : ""
                  }`}
                  href="javascript:void(0)"
                  onClick={() => {
                    SetActiveRecord(undefined);
                    setTimeout(() => {
                      SetActiveRecord(item);
                    }, 0);
                  }}
                >
                  <div className="row">
                    <div className="col-10">
                      <div className="text-primary">
                        {days.days
                          .find((i: any) => i.value === item.day)
                          ?.label.toUpperCase()}
                      </div>
                    </div>
                    {/* <div className="col-2 text-center att-stu">
                          <b className="text-primary">42</b>
                        </div> */}
                  </div>
                </a>
              ))}
            </div>
          </div>
          {activeRecord && (
            <div className="col-md-8">
              <div className="element-box no-bg bg-white">
                <h6 className="element-header">Timetable</h6>
                <div className="row">
                  {activeRecord.timetable_list?.map(
                    (tt: any, index: number) => (
                      <div className="col-4">
                        <a
                          key={index}
                          className="element-box el-tablo bg-azure no-bg bdr p-3"
                          data-target="#attModal"
                          data-toggle="modal"
                          href="javascript:void(0)"
                          onClick={() => {
                            onTimetableClick();
                          }}
                        >
                          <h6 className="label element-header">
                            {tt.period?.from_time} - {tt.period?.to_time}
                          </h6>
                          <label
                            className="lalabelel"
                            style={{ marginTop: "-20px" }}
                          >
                            {tt.teacher?.name}
                          </label>
                          <div className="value text-primary">
                            {tt.subject?.code}
                          </div>
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DayTimetable;
