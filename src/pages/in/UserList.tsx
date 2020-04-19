import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE } from "../../context/App";
import ImageModal from "../partials/ImageModal";
import { IProps } from "../../models/IProps";
import { IMessage } from "../../models/IMessage";
import { authService } from "../../services/Auth.Service";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { USER_LIST, REMOVE_USER, UPDATE_USER } from "../../queries/User.query";
import { IImageProp } from "../../models/IImageProp";
import LoadingState from "../partials/loading";
import AlertMessage from "../partials/AlertMessage";

const UserList: FC<IProps> = ({ history }) => {
  const [message, SetMessage] = useState<IMessage>();
  const [rMessage, SetRMessage] = useState<IMessage>();
  const [uMessage, SetUMessage] = useState<IMessage>();

  const [activeUserId, SetActiveUserId] = useState<string>();
  const [editUser, SetEditUser] = useState<any>({});
  const [showProfile, SetShowProfile] = useState<boolean>(false);
  const [page, SetPage] = useState<number>(1);
  const [limit] = useState<number>(25);
  const [activeImg, SetActiveImg] = useState<IImageProp>({
    image: "/avatar.png",
    name: "Undefined",
  });

  // Check if user is authenticated
  if (!authService.IsAuthenticated()) {
    history.push("/login");
  }

  // Get  School ID from logged in user
  const { school } = authService.GetUser();

  const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // Fetch List of Users
  const { loading, data, fetchMore } = useQuery(USER_LIST, {
    variables: { school: school.id, page, limit },
    onError: (err) =>
      SetMessage({
        message: err.message,
        failed: true,
      }),
  });

  useEffect(() => {
    fetchMore({
      variables: { school: school.id, page, limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          GetUsers: fetchMoreResult.GetUsers,
        };
      },
    });
  }, [page, limit]);

  // Remove User
  const [RemoveUser, { loading: rLoading }] = useMutation(REMOVE_USER, {
    onError: (err) =>
      SetRMessage({
        message: err.message,
        failed: true,
      }),
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: USER_LIST,
        variables: { school: school.id, page, limit },
      });

      const index = q.GetUsers.docs.findIndex(
        (i: any) => i.id === data.RemoveUser.doc.id
      );

      q.GetUsers.docs.splice(index, 1);

      //update
      cache.writeQuery({
        query: USER_LIST,
        variables: { school: school.id, page, limit },
        data: { GetUsers: q.GetUsers },
      });
    },
  });

  // Update User
  const [UpdateUser, { loading: uLoading }] = useMutation(UPDATE_USER, {
    onError: (err) =>
      SetUMessage({
        message: err.message,
        failed: true,
      }),
    onCompleted: (data) => {
      SetUMessage({
        message: data.UpdateUser.message,
        failed: false,
      });
    },
    update: (cache, { data }) => {
      const q: any = cache.readQuery({
        query: USER_LIST,
        variables: { school: school.id, page, limit },
      });

      const index = q.GetUsers.docs.findIndex(
        (i: any) => i.id === data.UpdateUser.doc.id
      );

      q.GetUsers.docs.splice(index, 1);
      q.GetUsers.docs.unshift(data.UpdateUser.doc);

      //update
      cache.writeQuery({
        query: USER_LIST,
        variables: { school: school.id, page, limit },
        data: { GetUsers: q.GetUsers },
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>User List | {GetAppName()}</title>
      </Helmet>
      <div className="content-i">
        <div className="content-box">
          <div className="element-wrapper">
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
            <h5 className="element-header">User List</h5>
            <div className="element-box">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <label htmlFor="">Filter User</label>
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
                          placeholder="Enter User name or alias to search"
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-2">
                      <div className="buttons-w">
                        <button className="btn btn-primary">Search User</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LoadingState loading={loading} />
            <AlertMessage message={message?.message} failed={message?.failed} />
            {data && data.GetUsers && (
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
                            <th>Created At</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.GetUsers.docs.map(
                            (user: any, index: number) => (
                              <tr key={index}>
                                <td>{index}</td>
                                <td>
                                  <div
                                    onClick={() => {
                                      SetActiveImg({
                                        image: user.image,
                                        name: user.name,
                                      });
                                    }}
                                    className="user-with-avatar clickable"
                                    data-target="#imageModal"
                                    data-toggle="modal"
                                  >
                                    <img
                                      src={user.image || "/avatar.png"}
                                      alt="Img"
                                    />
                                  </div>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.gender}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{CLEAN_DATE(user.created_at)}</td>
                                <td className="row-actions text-center">
                                  {!user.admin && (
                                    <a href="#" title="Make admin">
                                      <i className="os-icon os-icon-user-check text-success"></i>
                                    </a>
                                  )}

                                  <a href="#" title="Edit">
                                    <i className="os-icon os-icon-edit"></i>
                                  </a>
                                  <a className="danger" href="#" title="Delete">
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
                    <h2 className="text-danger">No User found!</h2>
                  </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*Image  Modal*/}
      <ImageModal image={activeImg?.image} name={activeImg?.name} />
    </>
  );
};

export default UserList;
