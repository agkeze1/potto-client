/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from "react";
import ImageModal from "../../partials/ImageModal";
import IconInput from "./../../partials/IconInput";
import LoadingState from "../../partials/loading";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TEACHER, TEACHER_LIST } from "../../../queries/Teacher.query";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../context/App";
import { NavLink } from "react-router-dom";

interface IProps {
  items: Array<any>;
  onView: any;
  onRemove: any;
}

const TeacherItems: FC<IProps> = ({ items, onRemove, onView }) => {
  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const [active, setActive] = useState<any>(undefined);
  const [edit, setEdit] = useState<any>(undefined);
  // Update Teacher

  const [UpdateTeacher, { loading }] = useMutation(UPDATE_TEACHER, {
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      toast.success(data.UpdateTeacher.message);
      document.getElementById("btnModal")?.click();
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TEACHER_LIST,
        variables: { page: 1, limit: 25 },
      });

      const index = q.GetTeachers.docs.findIndex(
        (i: any) => i.id === data.UpdateTeacher.doc.id
      );

      q.GetTeachers.docs.splice(index, 1);
      q.GetTeachers.docs.unshift(data.UpdateTeacher.doc);

      //update
      cache.writeQuery({
        query: TEACHER_LIST,
        variables: { page: 1, limit: 25 },
        data: { GetTeachers: q.GetTeachers },
      });
    },
  });

  if (items.length)
    return (
      <>
        <div className="element-box-tp">
          <div className="table-responsive">
            <table className="table table-padded">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((teacher: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>
                      <div
                        onClick={() => setActive(teacher)}
                        className="user-with-avatar clickable"
                        data-target="#imageModal"
                        data-toggle="modal"
                      >
                        <img
                          src={teacher.image || "../avatar.png"}
                          alt="passport"
                        />
                      </div>
                    </td>
                    <td>
                      <NavLink
                        to={{
                          pathname: `/in/teacher/${teacher.id}`,
                        }}
                      >
                        {teacher.name}
                      </NavLink>
                    </td>
                    <td>{teacher.gender}</td>
                    <td>
                      {teacher.email || (
                        <label className="text-danger">None supplied</label>
                      )}
                    </td>
                    <td>{teacher.phone}</td>
                    <td className="row-actions text-center">
                      <NavLink
                        to={{
                          pathname: `/in/teacher/${teacher.id}`,
                        }}
                        title="View profile"
                      >
                        <i className="os-icon os-icon-eye"></i>
                      </NavLink>
                      <a
                        href="#"
                        title="Edit"
                        onClick={() => {
                          setEdit({
                            firstname: teacher.first_name,
                            middlename: teacher.middle_name,
                            lastname: teacher.last_name,
                            email: teacher.email,
                            phone: teacher.phone,
                            gender: teacher.gender,
                            address: teacher.address,
                            dob: teacher.dob,
                          });
                          if (edit) {
                            setTimeout(() => {
                              document.getElementById("btnModal")?.click();
                            }, 0);
                          }
                        }}
                      >
                        <i className="os-icon os-icon-edit"></i>
                      </a>
                      <a
                        className="danger"
                        href="#"
                        title="Delete"
                        onClick={async () => {
                          let del = window.confirm(
                            `Are you sure you want to delete "${teacher.name}"?`
                          );
                          if (del) {
                            onRemove(teacher);
                          }
                        }}
                      >
                        <i className="os-icon os-icon-ui-15"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hidden button to lunch edit modal */}
          <button
            type="button"
            id="btnModal"
            data-target="#editModal"
            data-toggle="modal"
            style={{ display: "none" }}
          ></button>
          {/*Image  Modal*/}
        </div>
        <ImageModal image={active?.image} name={active?.name} />
        {edit && (
          <div
            aria-hidden="true"
            className="modal fade"
            id="editModal"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Teacher Info <hr />
                  </h5>

                  <button className="close" data-dismiss="modal" type="button">
                    <span aria-hidden="true"> &times;</span>
                  </button>
                </div>
                <div className="modal-body element-box pb-2">
                  <LoadingState loading={loading} />
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await UpdateTeacher({
                        variables: {
                          id: active.id,
                          model: edit,
                        },
                      });
                    }}
                  >
                    <div className="row">
                      {/* First Name input */}
                      <div className="col-sm-6">
                        <IconInput
                          placeholder="Enter first name"
                          label="First Name"
                          icon="os-icon-email-2-at2"
                          required={true}
                          type="text"
                          initVal={edit.firstname}
                          onChange={(firstname: string) => {
                            setEdit({
                              ...edit,
                              firstname,
                            });
                          }}
                        />
                      </div>
                      {/* Middle Name input */}
                      <div className="col-sm-6">
                        <IconInput
                          placeholder="Enter middle name"
                          label="Middle Name"
                          icon="os-icon-phone"
                          required={true}
                          type="text"
                          initVal={edit.middlename}
                          onChange={(middlename: string) => {
                            setEdit({
                              ...edit,
                              middlename,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* Last Name input */}
                      <div className="col-sm-6">
                        <IconInput
                          placeholder="Enter last name"
                          label="Last Name"
                          icon="os-icon-phone"
                          required={true}
                          type="text"
                          initVal={edit.lastname}
                          onChange={(lastname: string) => {
                            setEdit({
                              ...edit,
                              lastname,
                            });
                          }}
                        />
                      </div>
                      {/* Email input */}
                      <div className="col-sm-6">
                        <IconInput
                          placeholder="Enter email"
                          label="Email"
                          icon="os-icon-email-2-at2"
                          required={false}
                          type="email"
                          initVal={edit.email}
                          onChange={(email: string) => {
                            setEdit({
                              ...edit,
                              email,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* Phone input */}
                      <div className="col-sm-6">
                        <IconInput
                          placeholder="Enter phone number"
                          label="Phone Number"
                          icon="os-icon-phone"
                          required={true}
                          type="text"
                          initVal={edit.phone}
                          onChange={(phone: string) => {
                            setEdit({
                              ...edit,
                              phone,
                            });
                          }}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="">Date of Birth </label>
                        <br />
                        <DatePicker
                          selected={new Date(edit.dob)}
                          onChange={(date) =>
                            setEdit({
                              ...edit,
                              dob: date,
                            })
                          }
                          className="form-control"
                          dateFormat="d, MMMM yyyy"
                        />
                      </div>
                    </div>
                    {/* Gender input */}
                    <div className="form-group">
                      <label htmlFor="departmental">Gender</label>
                      <Select
                        options={genders}
                        value={{
                          label: edit.gender || (
                            <span className="text-gray">Select...</span>
                          ),
                          value: edit.gender,
                        }}
                        onChange={(item: any) => {
                          setEdit({
                            ...edit,
                            gender: item.label,
                          });
                        }}
                      />
                    </div>
                    {/* Address Input */}
                    <IconInput
                      placeholder="Enter address"
                      label="Address"
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      initVal={edit.address}
                      onChange={(address: string) => {
                        setEdit({
                          ...edit,
                          address,
                        });
                      }}
                    />
                    <div className="buttons-w mt-3 mb-5">
                      <button
                        className="btn btn-primary px-5 mt-3"
                        type="submit"
                      >
                        Update Teacher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  return (
    <div
      className="element-box no-bg bg-white"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
        minHeight: "450px",
      }}
    >
      <h4 className="text-danger">No Teacher found!</h4>
      <p>Teacher not available try creating a new teacher.</p>
    </div>
  );
};

export default TeacherItems;
