/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "../../../context/App";
import ImageModal from "../../partials/ImageModal";
import SwitchInput from "../../partials/SwitchInput";
import IconInput from "../../partials/IconInput";
import { IImageProp } from "../../../models/IImageProp";
import { authService } from "../../../services/Auth.Service";
import { IProps } from "../../../models/IProps";
import { GET_LEVELS } from "../../../queries/Level.query";
import gender from "../../../data/gender.json";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_CLASSES } from "../../../queries/Class.query";
import LoadingState from "../../partials/loading";
import state from "../../../data/state.json";
import Select from "react-select";
import Pagination from "../../partials/Pagination";
import DatePicker from "react-datepicker";
import {
  SEARCH_STUDENTS,
  REMOVE_STUDENT,
  UPDATE_STUDENT,
} from "../../../queries/Student.query";
import { GET_SUB_BY_LEVEL } from "../../../queries/Subject.query";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const StudentList: FC<IProps> = ({ history }) => {
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });

  const [showFilter, SetShowFilter] = useState<boolean>(true);

  // For lga under a state
  const [locals, SetLocals] = useState<any>([]);

  const [activeStudentId, SetActiveStudentId] = useState<string>();
  const [editStudent, SetEditStudent] = useState<any>({});

  const [showLevelsRefresh, SetShowLevelsRefresh] = useState<boolean>(false);
  const [showClassesRefresh, SetShowClassesRefresh] = useState<boolean>(false);
  const [levels, SetLevel] = useState<any>([]);
  const [activeLevel, SetActiveLevel] = useState<any>({});
  const [classes, SetClasses] = useState<any>([]);
  //Filters
  const [searchInput, SetSearchInput] = useState<any>();

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(25);

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Get School of logged in user
  const { school } = authService.GetUser();

  // Get Levels for level input
  const { loading: lLoading, data: lData, refetch: refetchLevels } = useQuery(
    GET_LEVELS,
    {
      variables: { school: school.id },
      onError: (err) => {
        toast.error(CleanMessage(err.message));
        SetShowLevelsRefresh(true);
      },
      onCompleted: () => {
        if (lData && lData.GetLevels) {
          SetLevel(
            lData.GetLevels.docs.map((level: any) => ({
              label: level.name,
              value: level.id,
            }))
          );
          SetShowLevelsRefresh(false);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Get classes for class input
  const [GetClasses, { loading: cLoading }] = useLazyQuery(GET_CLASSES, {
    onError: (err) => {
      toast.error(CleanMessage(err.message));
      SetShowClassesRefresh(true);
    },
    onCompleted: (data) => {
      if (data)
        SetClasses(
          data.GetClasses.docs.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      SetShowClassesRefresh(false);
    },
  });

  // Get Students
  const [SearchStudents, { loading, data, fetchMore }] = useLazyQuery(
    SEARCH_STUDENTS,
    {
      onError: (err) => toast.error(CleanMessage(err.message)),
    }
  );

  // Fetch More students on Page change
  useEffect(() => {
    if (fetchMore)
      fetchMore({
        variables: { page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            SearchStudents: fetchMoreResult.SearchStudents,
          };
        },
      });
  }, [page, fetchMore]);

  // Fetch classes for Class input on Level change
  useEffect(() => {
    if (searchInput?.level?.id) {
      SetClasses(undefined);
      GetClasses({ variables: { level: searchInput?.level?.id } });
    }
  }, [searchInput, GetClasses]);

  // Remove Student
  const [RemoveStudent, { loading: rLoading }] = useMutation(REMOVE_STUDENT, {
    onError: (err) => toast.error(CleanMessage(err.message)),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: SEARCH_STUDENTS,
        variables: {
          variables: {
            regNo: searchInput?.regNo,
            level: searchInput?.level?.id,
            _class: searchInput?._class?.id,
            page,
            limit,
          },
        },
      });

      const index = q.SearchStudents.docs.findIndex(
        (i: any) => i.id === data.RemoveStudent.doc.id
      );

      q.SearchStudents.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
        data: { SearchStudents: q.SearchStudents },
      });
    },
  });

  // Update Student
  const [UpdateStudent, { loading: uLoading }] = useMutation(UPDATE_STUDENT, {
    onError: (err) => toast.error(CleanMessage(err.message)),
    onCompleted: (data) => {
      toast.success(data.UpdateStudent.message);
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
      });

      const index = q.SearchStudents.docs.findIndex(
        (i: any) => i.id === data.UpdateStudent.doc.id
      );

      q.SearchStudents.docs.splice(index, 1);
      q.SearchStudents.docs.unshift(data.UpdateStudent.doc);

      //update
      cache.writeQuery({
        query: SEARCH_STUDENTS,
        variables: {
          regNo: searchInput?.regNo,
          level: searchInput?.level?.id,
          _class: searchInput?._class?.id,
          page,
          limit,
        },
        data: { SearchStudents: q.SearchStudents },
      });
    },
  });

  // Get List of subjects of Student level
  const [GetSubByLevel, { loading: sLoading, data: sData }] = useLazyQuery(
    GET_SUB_BY_LEVEL,
    {
      onError: (err) => {
        toast.error(CleanMessage(err.message));
      },
    }
  );

  return (
    <>
      <Helmet>
        <title>Student List | {GetAppName()}</title>
      </Helmet>
      <div className="content-box">
        <div className="element-wrapper">
          <span className="element-actions" style={{ marginTop: "-1.5rem" }}>
            <SwitchInput
              isOn={showFilter}
              handleToggle={() => {
                SetShowFilter(!showFilter);
              }}
              label="Show Filter"
            />
          </span>
          <h5 className="element-header">Student List</h5>
          {showFilter && (
            <>
              <div className="element-box">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <span className="element-actions mt-n2">
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => {
                          history.push("/in/new-student");
                        }}
                      >
                        <i className="os-icon os-icon-ui-22"></i>
                        <span>Create New</span>
                      </button>
                    </span>

                    <h5 className="element-header">Filter Student</h5>
                  </div>
                  <div className="col-lg-4">
                    {/* Reg No input */}
                    <IconInput
                      placeholder="Enter student reg.no"
                      label="Search by Reg. no"
                      icon="os-icon-ui-09"
                      required={true}
                      type="text"
                      initVal={searchInput?.regNo}
                      onChange={(regNo: string) => {
                        SetActiveLevel(undefined);
                        SetClasses(undefined);
                        SetSearchInput({
                          ...searchInput,
                          level: undefined,
                          _class: undefined,
                          regNo,
                        });
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
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
                        SetSearchInput({
                          ...searchInput,
                          regNo: "",
                          _class: undefined,
                          level: {
                            name: item.label,
                            id: item.value,
                          },
                        });
                      }}
                    />
                    {showLevelsRefresh && (
                      <button
                        onClick={() => {
                          SetShowLevelsRefresh(false);
                          refetchLevels();
                        }}
                        className="btn btn-primary btn-sm px-1 my-2"
                        type="submit"
                      >
                        Reload Level
                      </button>
                    )}
                    <LoadingState loading={lLoading} />
                  </div>
                  <div className="col-lg-4">
                    {/* Current Class input */}
                    <label>
                      Class <br />
                    </label>
                    <Select
                      options={classes}
                      value={{
                        label: searchInput?._class?.name || (
                          <span className="text-gray">Select...</span>
                        ),
                        value: searchInput?._class?.id,
                      }}
                      onChange={(item: any) => {
                        SetSearchInput({
                          ...searchInput,
                          regNo: "",
                          level: undefined,
                          _class: {
                            name: item.label,
                            id: item.value,
                          },
                        });
                      }}
                    />
                    {showClassesRefresh && (
                      <button
                        onClick={() => {
                          SetShowClassesRefresh(false);
                          GetClasses({
                            variables: { level: searchInput?._class?.id },
                          });
                        }}
                        className="btn btn-primary btn-sm px-1 my-2"
                        type="submit"
                      >
                        Reload Classes
                      </button>
                    )}
                    <LoadingState loading={cLoading} />
                  </div>
                  <div className="col-lg-12">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (searchInput) {
                          SearchStudents({
                            variables: {
                              regNo: searchInput?.regNo,
                              level: searchInput?.level?.id,
                              _class: searchInput?._class?.id,
                              page,
                              limit,
                            },
                          });
                        } else {
                          toast.error("No search field entered!");
                        }
                      }}
                    >
                      <i className="os-icon os-icon-search mr-2"></i>
                      Search record
                    </button>
                  </div>
                </div>
              </div>{" "}
            </>
          )}

          {/* Students list */}
          <div className="row justify-content-center ">
            <div className="col-12">
              <LoadingState loading={loading || rLoading} />
            </div>

            {data && data.SearchStudents.docs.length > 0 && (
              <>
                <div className="col-lg-12">
                  <div className="element-box no-bg bg-white">
                    <div className="table-responsive">
                      <h6 className="element-header">
                        Student List of{" "}
                        <b className="text-primary">
                          ({" "}
                          {
                            data?.SearchStudents?.docs[0]?.current_class?.level
                              ?.name
                          }
                          {" - "}
                          {searchInput?._class?.name})
                        </b>
                      </h6>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Fullname</th>
                            <th>Reg. No</th>
                            <th>Class</th>
                            <th>Gender</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.SearchStudents?.docs.map(
                            (stu: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div
                                    onClick={() => {
                                      SetActiveImg({
                                        image: stu.passport,
                                        name: stu.full_name,
                                      });
                                    }}
                                    className="user-with-avatar clickable"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    <img
                                      src={stu.passport || "/avatar.png"}
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td>{stu.full_name}</td>
                                <td>{stu.reg_no}</td>
                                <td>{stu.current_class?.name}</td>
                                <td>{stu.gender}</td>
                                <td className="row-actions text-center">
                                  <NavLink
                                    to={{
                                      pathname: `/in/student/${stu.id}`,
                                    }}
                                    title="View profile"
                                    onClick={() => {
                                      GetSubByLevel({
                                        variables: {
                                          level: stu.current_class?.level?.id,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="os-icon os-icon-eye"></i>
                                  </NavLink>
                                  <a
                                    href="#"
                                    title="Edit"
                                    onClick={() => {
                                      SetActiveStudentId(stu.id);
                                      SetEditStudent({
                                        firstname: stu.first_name,
                                        middlename: stu.middle_name,
                                        surname: stu.surname,
                                        regNo: stu.reg_no,
                                        gender: stu.gender,
                                        address: stu.address,
                                        dob: stu.dob,
                                        state: stu.state,
                                        lga: stu.lga,
                                      });
                                      if (editStudent) {
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
                                        `Are you sure you want to delete "${stu.full_name}"?`
                                      );
                                      if (del) {
                                        await RemoveStudent({
                                          variables: {
                                            id: stu.id,
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
                <div className="col-12 fade-in">
                  <div className="element-box">
                    <Pagination
                      length={data?.SearchStudents?.totalDocs}
                      {...data?.SearchStudents}
                      onPageClicked={(page: number) => {
                        setPage(page);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {data && data?.SearchStudents?.docs.length === 0 && (
              <div className="text-center pt-5 fade-in">
                <h3 className="text-danger"> No Student record found!</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal image={activeImg?.image} name={activeImg?.name} />

      {/* Edit Student Modal */}
      {editStudent.dob && (
        <div
          aria-hidden="true"
          className="modal fade"
          id="editModal"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Student's Info <hr />
                </h5>
                <button className="close" data-dismiss="modal" type="button">
                  <span aria-hidden="true"> &times;</span>
                </button>
              </div>
              <div className="modal-body element-box pb-2">
                <LoadingState loading={uLoading} />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Scroll to top of page
                    scrollTop();
                    UpdateStudent({
                      variables: {
                        id: activeStudentId,
                        model: editStudent,
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
                        initVal={editStudent.firstname}
                        onChange={(firstname: string) => {
                          SetEditStudent({
                            ...editStudent,
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
                        initVal={editStudent.middlename}
                        onChange={(middlename: string) => {
                          SetEditStudent({
                            ...editStudent,
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
                        initVal={editStudent.surname}
                        onChange={(surname: string) => {
                          SetEditStudent({
                            ...editStudent,
                            surname,
                          });
                        }}
                      />
                    </div>
                    {/* Reg. Number input */}
                    <div className="col-sm-6">
                      <IconInput
                        placeholder="Enter Reg. umber"
                        label="Reg. Number"
                        icon="os-icon-email-2-at2"
                        required={true}
                        type="text"
                        initVal={editStudent.regNo}
                        onChange={(regNo: string) => {
                          SetEditStudent({
                            ...editStudent,
                            regNo,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Gender input */}
                      <div className="form-group">
                        <label htmlFor="departmental">Gender</label>
                        <Select
                          options={gender.gender}
                          value={{
                            label: editStudent.gender,
                            value: editStudent.gender,
                          }}
                          onChange={(item: any) => {
                            SetEditStudent({
                              ...editStudent,
                              gender: item.label,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="">Date of Birth </label>
                      <br />
                      <DatePicker
                        selected={new Date(editStudent.dob)}
                        onChange={(date) =>
                          SetEditStudent({
                            ...editStudent,
                            dob: date,
                          })
                        }
                        className="form-control"
                        dateFormat="d, MMMM yyyy"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="departmental">State</label>
                        {/* State of Origin input */}
                        <Select
                          options={state.map((item: any, index: number) => ({
                            label: item.state.name,
                            value: index + "",
                          }))}
                          value={{
                            label: editStudent.state,
                            value: editStudent.state,
                          }}
                          onChange={(item: any) => {
                            SetEditStudent({
                              ...editStudent,
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
                          label="State of Origin"
                          icon="phone"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="departmental">LGA</label>
                        {/* LGA input */}
                        <Select
                          options={locals}
                          value={{
                            label: editStudent.lga,
                            value: editStudent.lga,
                          }}
                          onChange={(item: any) =>
                            SetEditStudent({
                              ...editStudent,
                              lga: item.label,
                            })
                          }
                          label="LGA"
                          icon="phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Input */}
                  <IconInput
                    placeholder="Enter address"
                    label="Address"
                    icon="os-icon-ui-09"
                    required={true}
                    type="text"
                    initVal={editStudent.address}
                    onChange={(address: string) => {
                      SetEditStudent({
                        ...editStudent,
                        address,
                      });
                    }}
                  />
                  <div className="buttons-w mt-3 mb-5">
                    <button className="btn btn-primary px-5 mt-3" type="submit">
                      Update Student
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

export default StudentList;
