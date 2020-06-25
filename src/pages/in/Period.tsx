/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import { IProps } from "../../models/IProps";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import DatePicker from "react-datepicker";
import SwitchInput from "../partials/SwitchInput";
import { IMessage } from "../../models/IMessage";
import {
  GET_PERIODS,
  NEW_PERIOD,
  UPDATE_PERIOD,
  REMOVE_PERIOD,
} from "../../queries/Period.query";
import AlertMessage from "../partials/AlertMessage";
import LoadingState from "../partials/loading";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { authService } from "../../services/Auth.Service";

const Period: FC<IProps> = ({ history }) => {
  const [showNewPeriod, SetShowNewPeriod] = useState<boolean>(true);
  const [newPeriod, SetNewPeriod] = useState<any>({
    isBreak: false,
  });
  const [editPeriod, SetEditPeriod] = useState<any>({});

  const [newMessage, SetNewMessage] = useState<IMessage>();
  const [lMessage, SetLMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  // Fetch List of Periods
  const { loading, data, refetch: refetchPeriodList } = useQuery(GET_PERIODS, {
    onError: (err) =>
      SetLMessage({
        message: err.message,
        failed: true,
      }),
  });

  // Save New Period
  const [NewPeriod, { loading: nLoading }] = useMutation(NEW_PERIOD, {
    onError: (err) =>
      SetNewMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetNewMessage({
        message: data.NewPeriod.message,
        failed: false,
      });
      refetchPeriodList();
    },
  });

  // Update Period
  const [UpdatePeriod, { loading: uLoading }] = useMutation(UPDATE_PERIOD, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdatePeriod.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_PERIODS,
      });

      const index = q.GetSchoolPeriodList.docs.findIndex(
        (i: any) => i.id === data.UpdatePeriod.doc.id
      );

      q.GetSchoolPeriodList.docs.splice(index, 1);
      q.GetSchoolPeriodList.docs.unshift(data.UpdatePeriod.doc);

      //update
      cache.writeQuery({
        query: GET_PERIODS,
        data: { GetSchoolPeriodList: q.GetSchoolPeriodList },
      });
    },
  });

  // Remove Period
  const [RemovePeriod, { loading: rLoading }] = useMutation(REMOVE_PERIOD, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: GET_PERIODS,
      });

      const index = q.GetSchoolPeriodList.docs.findIndex(
        (i: any) => i.id === data.RemovePeriod.doc.id
      );

      q.GetSchoolPeriodList.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: GET_PERIODS,
        data: { GetSchoolPeriodList: q.GetSchoolPeriodList },
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Period | {GetAppName()}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="content-i">
            <div className="content-box">
              <div className="element-wrapper">
                <h5 className="element-header">Period</h5>
                {/* New Period */}
                <div className="element-box">
                  <span className="element-actions">
                    <a
                      href="#"
                      title="toggle collapse"
                      onClick={() => {
                        SetShowNewPeriod(!showNewPeriod);
                      }}
                    >
                      <i
                        className={`os-icon os-icon-chevron-${
                          showNewPeriod ? "down" : "up"
                        } icon-lg`}
                      ></i>
                    </a>
                  </span>
                  <h6
                    className={`element-header ${!showNewPeriod ? "mb-0" : ""}`}
                  >
                    New Period
                  </h6>
                  {showNewPeriod && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        SetNewMessage(undefined);
                        await NewPeriod({
                          variables: {
                            model: newPeriod,
                          },
                        });
                      }}
                    >
                      <div className="row justify-content-center">
                        <div className="col-12">
                          <LoadingState loading={nLoading} />
                          <AlertMessage
                            message={newMessage?.message}
                            failed={newMessage?.failed}
                          />
                        </div>
                        <div className="col-md-4">
                          {/* From Time input */}
                          <label>From Time</label>
                          <br />
                          <DatePicker
                            className="form-control"
                            required
                            selected={newPeriod?.from}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="12:00 AM"
                            onChange={(time) => {
                              SetNewPeriod({
                                ...newPeriod,
                                from: time,
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          {/* To Time input */}
                          <label>To Time</label>
                          <br />
                          <DatePicker
                            className="form-control"
                            required
                            selected={newPeriod?.to}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="12:00 AM"
                            onChange={(time) => {
                              SetNewPeriod({
                                ...newPeriod,
                                to: time,
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4" style={{ marginTop: "15px" }}>
                          {/* Is Break switch */}
                          <SwitchInput
                            isOn={newPeriod?.isBreak}
                            handleToggle={() => {
                              SetNewPeriod({
                                ...newPeriod,
                                isBreak: !newPeriod?.isBreak,
                              });
                            }}
                            label="Is Break?"
                          />
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-primary px-5"
                            type="submit"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                <LoadingState loading={loading || rLoading} />

                {/* Get Period list message */}
                <AlertMessage
                  message={lMessage?.message}
                  failed={lMessage?.failed}
                />

                {/* Remove Period message */}
                <AlertMessage
                  message={rMessage?.message}
                  failed={rMessage?.failed}
                />

                {/* Period List */}
                {data?.GetSchoolPeriodList.docs.length > 0 && (
                  <div className="element-box">
                    <h6 className="">Period List</h6>
                    <hr />
                    <div className="row">
                      {data.GetSchoolPeriodList.docs.map(
                        (prd: any, index: number) => (
                          <div
                            key={index}
                            className={`col-sm-2 p-3 text-center ${
                              prd.break ? "brk-period" : "period"
                            } period`}
                          >
                            <label className="mb-2">
                              <strong>{prd.from + " - " + prd.to}</strong>
                            </label>
                            {prd.break && (
                              <h5 className="text-primary">Break</h5>
                            )}
                            <hr />
                            <div className="justify-content-center">
                              <a
                                href="#"
                                className="round-icon"
                                title="Edit"
                                data-target="#editModal"
                                data-toggle="modal"
                                onClick={() => {
                                  SetEditPeriod({
                                    ...prd,
                                    from_date: new Date(prd.from_date),
                                    to_date: new Date(prd.to_date),
                                  });
                                }}
                              >
                                <i className="os-icon os-icon-ui-49"></i>
                              </a>
                              <a
                                href="#"
                                className="round-icon"
                                title="Delete"
                                onClick={async () => {
                                  let del = window.confirm(
                                    `Are you sure you want to delete Period "${
                                      prd.from + " - " + prd.to
                                    }"?`
                                  );
                                  if (del) {
                                    await RemovePeriod({
                                      variables: {
                                        id: prd.id,
                                      },
                                    });
                                  }
                                }}
                              >
                                <i className="os-icon os-icon-trash-2 text-danger"></i>
                              </a>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {data?.GetSchoolPeriodList.docs.length === 0 && (
                  <div className="text-center pt-5 fade-in">
                    <h5 className="text-danger"> No Period found!</h5>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Period Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="editModal"
        role="dialog"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Period <hr />
              </h5>
              <button className="close" data-dismiss="modal" type="button">
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body element-box no-shadow pb-5">
              <LoadingState loading={uLoading} />
              <AlertMessage
                message={uMessage?.message}
                failed={uMessage?.failed}
              />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  SetUMessage(undefined);
                  await UpdatePeriod({
                    variables: {
                      id: editPeriod.id,
                      model: {
                        from: editPeriod.from_date,
                        to: editPeriod.to_date,
                        isBreak: editPeriod.break,
                      },
                    },
                  });
                }}
              >
                <div className="row">
                  <div className="col-12">
                    {/* From Time input */}
                    <label>From Time</label>
                    <br />
                    <DatePicker
                      className="form-control"
                      required
                      selected={editPeriod?.from_date}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="12:00 AM"
                      onChange={(time) => {
                        SetEditPeriod({
                          ...editPeriod,
                          from_date: time,
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    {/* To Time input */}
                    <label>To Time</label>
                    <br />
                    <DatePicker
                      className="form-control"
                      required
                      selected={editPeriod?.to_date}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="12:00 AM"
                      onChange={(time) => {
                        SetEditPeriod({
                          ...editPeriod,
                          to_date: time,
                        });
                      }}
                    />
                  </div>
                  <div
                    className="col-12"
                    style={{ marginTop: "20px", padding: "0 20px" }}
                  >
                    {/* Is Break switch */}
                    <SwitchInput
                      isOn={editPeriod?.break}
                      handleToggle={() => {
                        SetNewPeriod({
                          ...editPeriod,
                          break: !editPeriod?.break,
                        });
                      }}
                      label="Is Break?"
                    />
                  </div>
                  <div className="col-12">
                    <div className="buttons-w">
                      <button className="btn btn-primary" type="submit">
                        Update Period
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Period;
