import React, { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_LEVELS } from "../../../queries/Level.query";
import { GET_CLASSES } from "../../../queries/Class.query";
import Select from "react-select";
import LoadingState from "../../partials/loading";

interface IProps {
  onLevelChange?: any;
  onClassChange?: any;
  onSubmit?: any;
  schoolId: string;
}

const LevelClass: FC<IProps> = ({
  onLevelChange,
  onClassChange,
  onSubmit,
  schoolId,
}) => {
  const [levels, SetLevel] = useState<any>([]);
  const [classes, SetClasses] = useState<any>([]);
  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>();
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [activeClass, SetActiveClass] = useState<any>({});

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
        if (onSubmit) onSubmit();
      }}
    >
      <div className="element-box px-5">
        <h5 className="element-header">Inputs</h5>
        <div className="row">
          <div className="col-12">
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
                if (onLevelChange) onLevelChange(item);
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
          <div className="col-12 mt-3">
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
                if (onClassChange) onClassChange(item);
              }}
            />
            <LoadingState loading={cLoading} />
          </div>
          <div className="col-12 my-3">
            <div className="buttons-w">
              <button className="btn btn-primary px-3" type="submit">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LevelClass;
