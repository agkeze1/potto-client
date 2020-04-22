import React, { useState, useEffect, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink, Redirect } from "react-router-dom";
import ImageModal from "../partials/ImageModal";
import TeacherTTAccordion from "../partials/TeacherTTAccordion";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  TEACHER_LIST,
  REMOVE_TEACHER,
  UPDATE_TEACHER,
} from "../../queries/Teacher.query";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { IMessage } from "../../models/IMessage";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import { IImageProp } from "../../models/IImageProp";
import Pagination from "../partials/Pagination";
import IconInput from "../partials/IconInput";
import ImageUpload from "../partials/ImageUpload";
import gender from "../../data/gender.json";
import DatePicker from "react-datepicker";
import Select from "react-select";

const TeacherList: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  const [activeTeacherId, SetActiveTeacherId] = useState<string>();
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [page, SetPage] = useState<number>(1);
  const [limit] = useState<number>(25);
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });

  // For Teacher profile
  const [editTeacher, SetEditTeacher] = useState<any>({});
  const [activeTeacher, SetActiveTeacher] = useState<any>({});

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Fetch List of Teachers
  const { loading, data, fetchMore } = useQuery(TEACHER_LIST, {
    variables: { page, limit },
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
  });

  useEffect(() => {
    fetchMore({
      variables: { page, limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          GetTeachers: fetchMoreResult.GetTeachers,
        };
      },
    });
  }, [page, limit]);

  // Remove Teacher
  const [RemoveTeacher, { loading: rLoading }] = useMutation(REMOVE_TEACHER, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TEACHER_LIST,
        variables: { page, limit },
      });

      const index = q.GetTeachers.docs.findIndex(
        (i: any) => i.id === data.RemoveTeacher.doc.id
      );

      q.GetTeachers.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: TEACHER_LIST,
        variables: { page, limit },
        data: { GetTeachers: q.GetTeachers },
      });
    },
  });

  // Update Teacher
  const [UpdateTeacher, { loading: uLoading }] = useMutation(UPDATE_TEACHER, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateTeacher.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: TEACHER_LIST,
        variables: { page, limit },
      });

      const index = q.GetTeachers.docs.findIndex(
        (i: any) => i.id === data.UpdateTeacher.doc.id
      );

      q.GetTeachers.docs.splice(index, 1);
      q.GetTeachers.docs.unshift(data.UpdateTeacher.doc);

      //update
      cache.writeQuery({
        query: TEACHER_LIST,
        variables: { page, limit },
        data: { GetTeachers: q.GetTeachers },
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Teacher List | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
            {!showProfile && (
              <>
                <span className="element-actions mt-n2">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      history.push("/in/new-teacher");
                    }}
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Teacher List</h5>
                {data && data.GetTeachers.docs.length > 0 && (
                  <div className="element-box">
                    <div className="row justify-content-center">
                      <div className="col-lg-12">
                        <label htmlFor="">Filter Teacher</label>
                      </div>
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-sm-12 col-md-8 col-lg-10">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <div className="os-icon os-icon-search"></div>
                                </div>
                              </div>
                              <input
                                className="form-control"
                                placeholder="Enter teacher's email or phone"
                              />
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-4 col-lg-2">
                            <div className="buttons-w">
                              <button className="btn btn-primary">
                                Search Teacher
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <LoadingState loading={loading || rLoading} />
                <AlertMessage
                  failed={message?.failed}
                  message={message?.message}
                />
                <AlertMessage
                  failed={rMessage?.failed}
                  message={rMessage?.message}
                />
                {data && data.GetTeachers.docs.length > 0 && (
                  <div className="row justify-content-center ">
                    <div className="col-lg-12 pt-5">
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
                              {data.GetTeachers.docs.map(
                                (teacher: any, index: number) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div
                                        onClick={() => {
                                          SetActiveImg({
                                            image: teacher.image,
                                            name:
                                              teacher.first_name +
                                              " " +
                                              teacher.middle_name +
                                              " " +
                                              teacher.last_name,
                                          });
                                        }}
                                        className="user-with-avatar clickable"
                                        data-target="#imageModal"
                                        data-toggle="modal"
                                      >
                                        <img
                                          src={teacher.image || "/avatar.png"}
                                          alt="passport"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      {teacher.first_name +
                                        " " +
                                        teacher.middle_name +
                                        " " +
                                        teacher.last_name}
                                    </td>
                                    <td>{teacher.gender}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.phone}</td>
                                    <td className="row-actions text-center">
                                      <a
                                        href="#"
                                        title="View profile"
                                        onClick={() => {
                                          SetShowProfile(true);
                                          SetActiveTeacher(teacher);
                                        }}
                                      >
                                        <i className="os-icon os-icon-eye"></i>
                                      </a>
                                      <a
                                        href="#"
                                        title="Edit"
                                        onClick={() => {
                                          SetUMessage(undefined);
                                          SetActiveTeacherId(teacher.id);
                                          SetEditTeacher({
                                            firstname: teacher.first_name,
                                            middlename: teacher.middle_name,
                                            lastname: teacher.last_name,
                                            email: teacher.email,
                                            phone: teacher.phone,
                                            gender: teacher.gender,
                                            address: teacher.address,
                                            dob: teacher.dob,
                                          });
                                          if (editTeacher) {
                                            setTimeout(() => {
                                              document
                                                .getElementById("btnModal")
                                                ?.click();
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
                                            `Are you sure you want to delete "${
                                              teacher.first_name +
                                              " " +
                                              teacher.middle_name +
                                              " " +
                                              teacher.last_name
                                            }"?`
                                          );
                                          if (del) {
                                            await RemoveTeacher({
                                              variables: {
                                                id: teacher.id,
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        <i className="os-icon os-icon-ui-15"></i>
                                      </a>
                                    </td>
                                  </tr>
                                )
                              )}
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
                      </div>
                    </div>

                    {/* Pagination */}
                    {data && (
                      <div className="col-lg fade-in">
                        <div className="element-box">
                          <Pagination
                            length={data.GetTeachers.totalDocs}
                            {...data.GetTeachers}
                            onPageClicked={(page: number) => {
                              SetPage(page);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {data && data.GetTeachers.docs.length === 0 && (
              <div className="text-center pt-5 fade-in">
                <h3 className="text-danger"> No Teacher record found!</h3>
              </div>
            )}

            {/* Profile Section */}
            {showProfile && activeTeacher && (
              <div>
                <div className="content-box">
                  <div className="element-wrapper">
                    <h5 className="element-header">Teacher Profile</h5>
                    <div className="element-box">
                      <div className="text-left">
                        <NavLink
                          to="#"
                          onClick={() => {
                            SetShowProfile(false);
                          }}
                        >
                          <i
                            className="icon-lg os-icon os-icon-arrow-left6"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </NavLink>
                      </div>
                      <div className="text-right">
                        <NavLink to="#">
                          <i className="icon-lg os-icon os-icon-edit"></i>
                        </NavLink>
                      </div>
                      <div className="text-center mb-5">
                        <img
                          className="avatar pb-3"
                          alt="Passport"
                          src="/3.jpeg"
                        />

                        <h2 className="up-header ">Douglas Elenu</h2>
                        <h6 className="up-sub-header">
                          douglas@gmail.com
                          <i
                            className="os-icon os-icon-check-circle text-success ml-2"
                            title="Email verified"
                          ></i>
                        </h6>
                      </div>

                      <div className="os-tabs-w">
                        <div className="os-tabs-controls">
                          <ul className="nav nav-tabs smaller">
                            {/* Basic Info Tab */}
                            <li className="nav-item text-uppercase">
                              <a
                                className="nav-link active"
                                data-toggle="tab"
                                href="#basic-info"
                              >
                                Basic Info
                              </a>
                            </li>

                            {/* Timetable Tab */}
                            <li className="nav-item text-uppercase">
                              <a
                                className="nav-link"
                                data-toggle="tab"
                                href="#timetable"
                              >
                                Timetable
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="tab-content">
                          {/* Basic Information */}
                          <div className="tab-pane active" id="basic-info">
                            <div className="text-center element-box no-bg no-shadow">
                              <ul className="pro-details">
                                <li>
                                  <span>Gender</span> | <b>Male</b>
                                </li>
                                <li>
                                  <span>Date of Birth</span> |{" "}
                                  <b>8th May 2001 </b>
                                  <i>(20yrs)</i>
                                </li>
                                <li>
                                  <span>Date of Admission</span> |{" "}
                                  <b>12th April 2017</b>
                                </li>
                                <li>
                                  <span>Phone number</span> | <b>09033422324</b>
                                </li>
                                <li>
                                  <span>Employment date</span> |{" "}
                                  <b>12th May 2017</b>
                                </li>
                                <li>
                                  <span>Address</span> |{" "}
                                  <b>
                                    12 Ugochuckwu st. New Haven, Enugu state
                                  </b>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Timetable */}
                          <div className="tab-pane" id="timetable">
                            <div className="text-center element-box no-bg no-shadow">
                              <TeacherTTAccordion day="Monday" />
                              <TeacherTTAccordion day="Tuesday" />
                              <TeacherTTAccordion day="Wednesday" />
                              <TeacherTTAccordion day="Thursday" />
                              <TeacherTTAccordion day="Friday" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*Image  Modal*/}
      <ImageModal image={activeImg?.image} name={activeImg?.name} />

      {/* Edit Teacher Modal */}
      {editTeacher.dob && (
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
              <div className="modal-body pb-2">
                <LoadingState loading={uLoading} />
                <AlertMessage
                  message={uMessage?.message}
                  failed={uMessage?.failed}
                />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Scroll to top of page
                    scrollTop();
                    UpdateTeacher({
                      variables: {
                        id: activeTeacherId,
                        model: editTeacher,
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
                        initVal={editTeacher.firstname}
                        onChange={(firstname: string) => {
                          SetEditTeacher({
                            ...editTeacher,
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
                        initVal={editTeacher.middlename}
                        onChange={(middlename: string) => {
                          SetEditTeacher({
                            ...editTeacher,
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
                        initVal={editTeacher.lastname}
                        onChange={(lastname: string) => {
                          SetEditTeacher({
                            ...editTeacher,
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
                        initVal={editTeacher.email}
                        onChange={(email: string) => {
                          SetEditTeacher({
                            ...editTeacher,
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
                        initVal={editTeacher.phone}
                        onChange={(phone: string) => {
                          SetEditTeacher({
                            ...editTeacher,
                            phone,
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="">Date of Birth </label>
                      <br />
                      <DatePicker
                        selected={new Date(editTeacher.dob)}
                        onChange={(date) =>
                          SetEditTeacher({
                            ...editTeacher,
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
                      options={gender.gender}
                      value={{
                        label: editTeacher.gender || (
                          <span className="text-gray">Select...</span>
                        ),
                        value: editTeacher.gender,
                      }}
                      onChange={(item: any) => {
                        SetEditTeacher({
                          ...editTeacher,
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
                    initVal={editTeacher.address}
                    onChange={(address: string) => {
                      SetEditTeacher({
                        ...editTeacher,
                        address,
                      });
                    }}
                  />
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
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
};

export default TeacherList;
