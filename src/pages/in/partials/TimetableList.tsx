import React, { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CleanMessage, getTimetable } from "../../../context/App";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_PERIODS } from "../../../queries/Period.query";
import LoadingState from "../../partials/loading";
import { GET_CLASS_TIMETABLE } from "../../../queries/Timetable.query";

interface IProps {
  classId: string;
}

const TimetableList: FC<IProps> = ({ classId }) => {
  const [periods, SetPeriods] = useState([]);
  const [timetableData, SetTimetableData] = useState<any>([]);
  const [timetable, setTimetable] = useState<any>([]);

  const days = ["MON", "TUE", "WED", "THUR", "FRI"];
  // Fetch List of Periods
  const { loading } = useQuery(GET_PERIODS, {
    onError: (err: any) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      SetPeriods(data?.GetSchoolPeriodList.docs);

      const _items = [...timetableData];
      for (let index = 0; index < days.length; index++) {
        const day = days[index];
        const items: any[] = [];
        for (let j = 0; j < data.GetSchoolPeriodList.docs.length; j++) {
          const period = data.GetSchoolPeriodList.docs[j];
          items.push(period);
        }
        _items.push({ day: day, items });
      }
      SetTimetableData(_items);
    },
  });

  // fetch class timetable
  const [fetchTimetableFunc, { loading: fLoading }] = useLazyQuery(
    GET_CLASS_TIMETABLE,
    {
      onError: (err: any) => toast.error(CleanMessage(err.message)),
      onCompleted: (d) => {
        setTimetable(
          d.GetClassTimetable.docs.map((i: any) => ({
            ...i,
            timetable_list: i.timetable_list.map((t: any) => ({
              ...t,
              period: {
                from: new Date(t.period.from).toISOString(),
                to: new Date(t.period.to).toISOString(),
              },
            })),
          }))
        );
      },
    }
  );

  useEffect(() => {
    if (classId) fetchTimetableFunc({ variables: { _class: classId } });
  }, [classId, fetchTimetableFunc]);

  if (classId)
    return (
      <>
        <LoadingState loading={loading || fLoading} />
        <table className="table table-bordered table-lg table-v2 table-striped">
          <thead>
            <tr>
              <th className="text-center"></th>
              {periods.map((item: any, index: number) => (
                <th key={index}>
                  {item.from} - {item.to}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableData.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>
                  <b>{item.day}</b>
                </td>
                {item.items.map((child: any, cIdx: number) => (
                  <td key={cIdx}>
                    {child.break ? (
                      <span className="text-uppercase text-primary">
                        <b>Break</b>
                      </span>
                    ) : (
                      <span>
                        {getTimetable(item.day, child, timetable, function (
                          result: any
                        ) {
                          return result !== null ? (
                            <>
                              <span className="text-uppercase text-primary">
                                <b>{result.subject.code}</b>
                              </span>
                              <div className="smaller">
                                {result.teacher.name}
                              </div>
                            </>
                          ) : (
                            <span className="text-danger">Not Assigned</span>
                          );
                        })}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  return null;
};

export default TimetableList;
