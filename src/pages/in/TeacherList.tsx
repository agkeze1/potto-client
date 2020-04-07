import React, { useState, useEffect, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import { NavLink } from "react-router-dom";
import ImageModal from "../partials/ImageModal";
import TeacherTTAccordion from "../partials/TeacherTTAccordion";
import { useQuery } from "@apollo/react-hooks";
import { TEACHER_LIST } from "../../queries/Teacher.query";
import { authService } from "../../services/Auth.Service";
import { IProps } from "../../models/IProps";
import { IMessage } from "../../models/IMessage";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";
import { IImageProp } from "../../models/IImageProp";
import Pagination from "../partials/Pagination";

const TeacherList: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [page, SetPage] = useState<number>(1);
  const [limit] = useState<number>(25);
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined"
  });

  const subjects = [
    { label: "English language JSS1", value: 1 },
    { label: "Mathematics JSS2", value: 2 },
    { label: "Inter Science SS1", value: 3 }
  ];

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }
  const { loading, data, fetchMore } = useQuery(TEACHER_LIST, {
    variables: { page, limit },
    onError: err =>
      SetMessage({
        message: err.message,
        failed: true
      })
  });

  useEffect(() => {
    fetchMore({
      variables: { page, limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          GetTeachers: fetchMoreResult.GetTeachers
        };
      }
    });
  }, [page, limit]);

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
                    className="btn btn-primary "
                    data-target="#exampleModal1"
                    id="#newMax"
                    data-toggle="modal"
                    type="button"
                  >
                    Create New
                  </button>
                </span>
                <h5 className="element-header">Teacher List</h5>
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
                <LoadingState loading={loading} />
                <AlertMessage
                  failed={message?.failed}
                  message={message?.message}
                />
                {data && data.GetTeachers && (
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
                                  <tr>
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
                                              teacher.last_name
                                          });
                                        }}
                                        className="user-with-avatar clickable"
                                        data-target="#imageModal"
                                        data-toggle="modal"
                                      >
                                        <img
                                          src={teacher.image}
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
                                        }}
                                      >
                                        <i className="os-icon os-icon-eye"></i>
                                      </a>
                                      <a href="#" title="Edit">
                                        <i className="os-icon os-icon-edit"></i>
                                      </a>
                                      <a
                                        className="danger"
                                        href="#"
                                        title="Delete"
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
                        {/* <div className="text-center pt-5 fade-in">
                    <h2 className="text-danger">No Teacher record found!</h2>
                  </div> */}
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

            {/* Profile Section */}
            {showProfile && (
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

      {/* Modal for Image */}
      <ImageModal image={activeImg?.image} name={activeImg?.name} />
    </>
  );
};

export default TeacherList;
