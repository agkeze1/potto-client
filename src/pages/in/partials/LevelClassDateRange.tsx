import React, { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../../queries/Level.query";
import { GET_CLASSES } from "../../../queries/Class.query";
import Select from "react-select";
import LoadingState from "../../partials/loading";
import DatePicker from "react-datepicker";

interface IProps {
  onLevelChange?: any;
  onClassChange?: any;
  onFromChange?: any;
  onToChange?: any;
  onSubmit?: any;
  schoolId: string;
  buttonText: string;
}

const LevelClassDateRange: FC<IProps> = ({
  onLevelChange,
  onClassChange,
  onFromChange,
  onToChange,
  onSubmit,
  schoolId,
  buttonText,
}) => {
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>();
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [activeClass, SetActiveClass] = useState<any>({});
  const [data, SetData] = useState<any>();

  // Get Levels for level input
  const { loading: lLoading } = useQuery(GET_LEVELS, {
    variables: {
      school: schoolId,
    },
    onError: (err) => {
      toast.error(CleanMessage(err.message));
      SetShowLevelsRefresh(true);
    },
    onCompleted: (data) => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
        SetShowLevelsRefresh(false);
      }
    },
  });

  // Get Levels on Reload level button click
  const [GetLevels, { loading: llLoading }] = useLazyQuery(GET_LEVELS, {
    variables: {
      school: schoolId,
    },
    onError: (err) => {
      toast.error(CleanMessage(err.message));
      SetShowLevelsRefresh(true);
    },
    onCompleted: (data) => {
      if (data && data.GetLevels) {
        SetLevel(
          data.GetLevels.docs.map((level: any) => ({
            label: level.name,
            value: level.id,
          }))
        );
        SetShowLevelsRefresh(false);
      }
    },
  });

  // Get classes for class input
  const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      if (data)
        SetClasses(
          data.GetClasses.docs.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
    },
  });

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (activeLevel?.id) {
      //   SetClasses(undefined);
      GetClasses({
        variables: { level: activeLevel?.id },
      });
    }
  }, [activeLevel, GetClasses]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          _class: activeClass,
          fromDate: data?.fromDate,
          toDate: data?.toDate,
        });
      }}
    >
      <div className="row">
        {/* Leve */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          {/* Level input */}
          <label>
            Level <br />
          </label>
          <Select
            options={levels}
            value={{
              label: activeLevel?.name || (
                <span className="text-gray">Select...</span>
              ),
              value: activeLevel?.id,
            }}
            onChange={(item: any) => {
              SetActiveLevel({
                name: item?.label,
                id: item?.value,
              });
              SetActiveClass(undefined);
              onLevelChange(item);
            }}
          />
          {showLevelsRefresh && (
            <button
              onClick={() => {
                SetShowLevelsRefresh(false);
                GetLevels();
              }}
              className="btn btn-primary btn-sm px-1 my-2"
              type="submit"
            >
              Reload Level
            </button>
          )}
          <LoadingState loading={lLoading || llLoading} />
        </div>
        {/* Class */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          {/* Class Input */}
          <label>
            Class <br />
          </label>
          <Select
            options={classes}
            value={{
              label: activeClass?.label || (
                <span className="text-gray">Select...</span>
              ),
              value: activeClass?.value,
            }}
            onChange={(item: any) => {
              SetActiveClass({
                label: item.label,
                value: item.value,
              });
              onClassChange(item);
            }}
          />
          <LoadingState loading={cLoading} />
        </div>
        {/* From Day */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          {/* From Date*/}
          <label>From </label>
          <br />
          <DatePicker
            placeholderText="day, month year"
            selected={data?.fromDate}
            onChange={(date) => {
              SetData({
                ...data,
                fromDate: date,
              });
              onFromChange(date);
            }}
            className="form-control"
            dateFormat="d, MMMM yyyy"
          />
        </div>
        {/* To Day */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          {/* To Date */}
          <label>To </label>
          <br />
          <DatePicker
            placeholderText="day, month year"
            selected={data?.toDate}
            onChange={(date) => {
              SetData({
                ...data,
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
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LevelClassDateRange;
