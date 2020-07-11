import React, { useState, FC } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import {
  NEW_GUARDIAN,
  GET_GUARDIAN_BY_MOBILE,
  GET_GUARDIAN_TYPES,
} from "../../../../queries/Guardian.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../../context/App";
import { ADD_GUARDIAN } from "../../../../queries/Student.query";
import title from "../../../../data/title.json";
import gender from "../../../../data/gender.json";
import state from "../../../../data/state.json";
import Select from "react-select";
import LoadingState from "../../../partials/loading";
import IconInput from "../../../partials/IconInput";
import ImageUpload from "../../../partials/ImageUpload";
import { NavLink } from "react-router-dom";

interface IProp {
  student: any;
}

const Guardian: FC<IProp> = ({ student }) => {
  const [activeStudent, SetActiveStudent] = useState<any>(student);

  // For New Guardian of Student
  const [showNewGuardian, SetShowNewGuardian] = useState<boolean>(false);
  const [guardianExists, SetGuardianExists] = useState<boolean>(false);
  const [guardianPhone, SetGuardianPhone] = useState<string>();
  const [returnedGuard, SetReturnedGuard] = useState<any>({});

  const [showGTRefresh, SetShowGTRefresh] = useState<boolean>(false);
  const [newGuardian, SetNewGuardian] = useState<any>({});

  const [guardType, SetGuardType] = useState<any>([]);

  // For lga under a state
  const [locals, SetLocals] = useState<any>([]);

  // Create New Guardian
  const [NewGuardian, { loading: nGLoading }] = useMutation(NEW_GUARDIAN, {
    onError: (err) => {
      toast.error(CleanMessage(err.message));
    },
    onCompleted: (data) => {
      if (data && activeStudent) {
        const guardians = activeStudent?.guardians;
        guardians.unshift(data.NewGuardian.doc);
        SetActiveStudent({
          ...activeStudent,
          guardians,
        });
        SetShowNewGuardian(false);
      }
    },
  });

  // Get Guardian by Phone number
  const [GetGuardByPhone, { loading: gLoading }] = useLazyQuery(
    GET_GUARDIAN_BY_MOBILE,
    {
      onError: (err) => {
        if (err.message.includes("Guardian not found.")) {
          document.getElementById("btnGuardModal")?.click();
          SetGuardianExists(false);
          SetShowNewGuardian(true);
        } else {
          toast.error(CleanMessage(err.message));
        }
      },
      onCompleted: (data) => {
        if (data && data.GetGuardianByMobile.doc) {
          SetGuardianExists(true);
          SetReturnedGuard(data.GetGuardianByMobile.doc);
        }
      },
    }
  );

  // Add Existing Guardian to Student
  const [AddNewGuardian, { loading: aGLoading }] = useMutation(ADD_GUARDIAN, {
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      if (data && activeStudent) {
        SetActiveStudent({
          ...activeStudent,
          guardians: data.AddStudentGuardian.doc.guardians,
        });
        toast.success(data.AddStudentGuardian.message);

        setTimeout(() => {
          document.getElementById("btnGuardModal")?.click();
        }, 1000);
      }
    },
  });

  // Get Guardian Types for input
  const [GetGuardianTypes, { loading: gTLoading }] = useLazyQuery(
    GET_GUARDIAN_TYPES,
    {
      onError: (err) => {
        toast.error(CleanMessage(err.message));
        SetShowGTRefresh(true);
      },
      onCompleted: (data) => {
        if (data) {
          SetGuardType(
            data.GetGuardianTypes.docs.map((type: any) => ({
              label: type.name,
              value: type.id,
            }))
          );
        }
      },
    }
  );

  return (
    <>
      {!showNewGuardian && (
        <div>
          <div className="text-center ">
            <div className="row">
              <div className="col-12">
                <button
                  className="btn btn-primary float-right"
                  id="btnGuardModal"
                  data-target="#guardianPhoneModal"
                  data-toggle="modal"
                  onClick={() => {
                    SetGuardianExists(false);
                  }}
                >
                  <i className="os-icon os-icon-plus-circle mr-2"></i>
                  New
                </button>
              </div>
              {activeStudent?.guardians?.length > 0 && (
                <>
                  {activeStudent?.guardians?.map((guard: any) => (
                    <div className="col-sm-6 col-md-4 col-lg-3">
                      <div className="element-box no-bg">
                        <img
                          className="avatar"
                          src={guard.image || "/avatar.png"}
                          alt=""
                          style={{
                            width: "150px",
                            height: "150px",
                          }}
                        />
                        <hr />
                        <NavLink
                          title="View Profile"
                          to={{
                            pathname: `/in/guardian/${guard.id}`,
                          }}
                        >
                          {guard.full_name.toUpperCase()}
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {activeStudent?.guardians?.length === 0 && (
                <div className="col-12 mb-5">
                  <label className="text-danger">
                    No guardian record found!
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Guardian  */}
      {showNewGuardian && (
        <div className="content-i">
          <div className="content-box">
            <div className="element-wrapper">
              <h5 className="element-header">New Guardian</h5>

              <div className="row justify-content-center element-box no-bg no-shadow">
                <div className="col-lg-10 pt-5">
                  <h5 className="element-header">Basic Information</h5>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      NewGuardian({
                        variables: {
                          student: activeStudent.id,
                          model: {
                            ...newGuardian,
                            phone: guardianPhone,
                          },
                        },
                      });
                    }}
                  >
                    <div className="row mb-3">
                      <div className="col-sm-6">
                        {/* Title input */}
                        <label>Title</label>
                        <Select
                          options={title.titles}
                          onChange={(title: any) => {
                            SetNewGuardian({
                              ...newGuardian,
                              title: title.label,
                            });
                          }}
                          icon="phone"
                        />
                      </div>
                      <div className="col-sm-6">
                        {/* Relationship input */}
                        <label>Relationship</label>
                        <Select
                          options={guardType}
                          onChange={(type: any) => {
                            SetNewGuardian({
                              ...newGuardian,
                              type: type.value,
                            });
                          }}
                          icon="phone"
                        />
                        {showGTRefresh && (
                          <button
                            onClick={() => {
                              SetShowGTRefresh(false);
                              GetGuardianTypes();
                            }}
                            className="btn btn-primary btn-sm px-2 my-2"
                            type="button"
                          >
                            Reload Relationships
                          </button>
                        )}
                        <LoadingState loading={gTLoading} />
                      </div>
                    </div>
                    {/* Full name input */}
                    <IconInput
                      placeholder="Enter full name"
                      label="Full Name"
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      onChange={(name: string) => {
                        SetNewGuardian({
                          ...newGuardian,
                          name,
                        });
                      }}
                    />
                    <div className="row">
                      <div className="col-sm-6">
                        {/* Phone number input */}
                        <IconInput
                          placeholder="Enter phone number"
                          label="Phone Number"
                          icon="os-icon-ui-09"
                          required={true}
                          type="text"
                          initVal={guardianPhone}
                          disabled={true}
                          onChange={(phone: string) => {
                            SetNewGuardian({
                              ...newGuardian,
                              phone,
                            });
                          }}
                        />
                      </div>
                      <div className="col-sm-6">
                        {/* Email input */}
                        <IconInput
                          placeholder="Enter email"
                          label="Email"
                          icon="os-icon-ui-09"
                          required={false}
                          type="text"
                          onChange={(email: string) => {
                            SetNewGuardian({
                              ...newGuardian,
                              email,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-6">
                        {/* Gender input */}
                        <label>Gender</label>
                        <Select
                          options={gender.gender}
                          onChange={(gender: any) => {
                            SetNewGuardian({
                              ...newGuardian,
                              gender: gender.label,
                            });
                          }}
                          icon="phone"
                        />
                      </div>
                      <div className="col-sm-6">
                        {/* State of Origin input */}
                        <label>State of Origin</label>
                        <Select
                          options={state.map((item: any, index: number) => ({
                            label: item.state.name,
                            value: index + "",
                          }))}
                          onChange={(item: any) => {
                            SetNewGuardian({
                              ...newGuardian,
                              state: item.label,
                            });
                            SetLocals(
                              state[item.value].state.locals.map(
                                (item: any) => ({
                                  value: item.name,
                                  label: item.name,
                                })
                              )
                            );
                          }}
                          icon="phone"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        {/* LGA */}
                        <label>LGA</label>
                        <Select
                          options={locals}
                          onChange={(item: any) =>
                            SetNewGuardian({
                              ...newGuardian,
                              lga: item.value,
                            })
                          }
                          icon="phone"
                        />
                      </div>
                      <div className="col-sm-6">
                        {/* Hometown input */}
                        <IconInput
                          placeholder="Enter Hometown"
                          label="Hometown"
                          icon="os-icon-ui-09"
                          required={true}
                          type="text"
                          onChange={(hometown: string) => {
                            SetNewGuardian({
                              ...newGuardian,
                              hometown,
                            });
                          }}
                        />
                      </div>
                    </div>
                    {/* Address input */}
                    <IconInput
                      placeholder="Enter address"
                      label="Address"
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      onChange={(address: string) => {
                        SetNewGuardian({
                          ...newGuardian,
                          address,
                        });
                      }}
                    />
                    <label>Passport</label>
                    <ImageUpload
                      title="Browse passport..."
                      onData={(image: string) => {
                        SetNewGuardian({
                          ...newGuardian,
                          image,
                        });
                      }}
                    />
                    <LoadingState loading={nGLoading} />
                    <div className="buttons-w mt-3 mb-5">
                      <button
                        onClick={() => {
                          SetShowNewGuardian(false);
                        }}
                        className="btn btn-secondary px-5 mt-3"
                        type="submit"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary px-5 mt-3"
                        type="submit"
                      >
                        Save Guardian
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guardian Phone Modal */}
      <div
        aria-hidden="true"
        className="modal fade"
        id="guardianPhoneModal"
        role="dialog"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Student's Guardian <hr />
              </h5>
              <button className="close" data-dismiss="modal" type="button">
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body pb-2">
              {!guardianExists && activeStudent && (
                <div className="element-box no-shadow">
                  <div className="row pb-4">
                    <div className="col-12 text-center">
                      <img
                        src={activeStudent.passport || "/avatar.png"}
                        alt=""
                        className="mb-2"
                        style={{
                          borderRadius: "50%",
                          width: "150px",
                          height: "150px",
                        }}
                      />
                      <h5>{activeStudent.full_name}</h5>
                      <label>{activeStudent.reg_no}</label>
                      <hr />
                    </div>
                  </div>
                  <LoadingState loading={gLoading} />
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      GetGuardByPhone({
                        variables: {
                          mobile: guardianPhone,
                        },
                      });
                    }}
                  >
                    <div className="row">
                      {/* Phone number input */}
                      <div className="col-12">
                        <IconInput
                          placeholder="Enter Guardian Phone number"
                          label="Guardian Phone"
                          icon="os-icon-phone"
                          required={true}
                          type="text"
                          onChange={(mobile: string) => {
                            SetGuardianPhone(mobile);
                          }}
                        />
                      </div>
                      <div className="col-12 buttons-w mb-5">
                        <button className="btn btn-primary px-5" type="submit">
                          Continue
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {guardianExists && (
                <div className="element-box no-shadow">
                  <div className="row pb-4">
                    <div className="col-12 text-center">
                      <img
                        src={returnedGuard.image || "/avatar.png"}
                        alt=""
                        className="mb-2"
                        style={{
                          borderRadius: "50%",
                          width: "150px",
                          height: "150px",
                        }}
                      />
                      <h5>{returnedGuard.name}</h5>
                      <label htmlFor="">{returnedGuard.phone}</label>
                      <hr />
                      <LoadingState loading={aGLoading} />
                      <b>Guardian with entered phone number already exists.</b>
                      <label htmlFor="">
                        Do you want to use this Guardian?
                      </label>

                      <div className="text-center mt-3">
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => {
                            SetReturnedGuard(undefined);
                            SetGuardianExists(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-success ml-2"
                          onClick={() => {
                            AddNewGuardian({
                              variables: {
                                id: activeStudent.id,
                                guardianId: returnedGuard.id,
                              },
                            });
                          }}
                        >
                          Use Guardian
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guardian;
