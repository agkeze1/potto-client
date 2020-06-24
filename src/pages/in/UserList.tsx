/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE, CleanMessage } from "../../context/App";
import ImageModal from "../partials/ImageModal";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { USER_LIST, REMOVE_USER, UPDATE_USER } from "../../queries/User.query";
import { IImageProp } from "../../models/IImageProp";
import LoadingState from "../partials/loading";
import IconInput from "../partials/IconInput";
import Select from "react-select";
import gender from "../../data/gender.json";
import Pagination from "../partials/Pagination";
import { toast } from "react-toastify";

const UserList: FC<IProps> = ({ history }) => {
    const [activeUserId, SetActiveUserId] = useState<string>();
    const [editUser, SetEditUser] = useState<any>({});

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
    // const { school } = authService.GetUser();

    const scrollTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    // Fetch List of Users
    const { loading, data, fetchMore } = useQuery(USER_LIST, {
        variables: { page, limit },
        onError: (err) => toast.error(CleanMessage(err.message)),
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    GetUsers: fetchMoreResult.GetUsers,
                };
            },
        });
    }, [page, limit, fetchMore]);

    // Remove User
    const [RemoveUser, { loading: rLoading }] = useMutation(REMOVE_USER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: USER_LIST,
                variables: { page, limit },
            });

            const index = q.GetUsers.docs.findIndex((i: any) => i.id === data.RemoveUser.doc.id);

            q.GetUsers.docs.splice(index, 1);

            //update
            cache.writeQuery({
                query: USER_LIST,
                variables: { page, limit },
                data: { GetUsers: q.GetUsers },
            });
        },
    });

    // Update User
    const [UpdateUser, { loading: uLoading }] = useMutation(UPDATE_USER, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => toast.info(CleanMessage(data.UpdateUser.message)),
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: USER_LIST,
                variables: { page, limit },
            });

            const index = q.GetUsers.docs.findIndex((i: any) => i.id === data.UpdateUser.doc.id);

            q.GetUsers.docs.splice(index, 1);
            q.GetUsers.docs.unshift(data.UpdateUser.doc);

            //update
            cache.writeQuery({
                query: USER_LIST,
                variables: { page, limit },
                data: { GetUsers: q.GetUsers },
            });
        },
    });

    return (
        <>
            <Helmet>
                <title>User Management | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <span className="element-actions mt-n2">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {
                                    history.push("/in/new-user");
                                }}
                            >
                                Create New
                            </button>
                        </span>
                        <h5 className="element-header">User List</h5>
                        {data && data.GetUsers.docs.length > 0 && (
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
                                                    <input className="form-control" placeholder="Enter User name or phone to search" />
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
                        )}
                        <LoadingState loading={loading || rLoading} />

                        <div className="row justify-content-center ">
                            {/* User list */}
                            {data && data.GetUsers.docs.length > 0 && (
                                <>
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
                                                        {data.GetUsers.docs.map((user: any, index: number) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
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
                                                                        <img src={user.image || "/avatar.png"} alt="Img" />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {user.name} <br />
                                                                    {user.admin && <span className="badge badge-success-inverted">Admin</span>}
                                                                </td>
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

                                                                    <a
                                                                        href="#"
                                                                        title="Edit"
                                                                        onClick={() => {
                                                                            SetActiveUserId(user.id);
                                                                            SetEditUser({
                                                                                name: user.name,
                                                                                phone: user.phone,
                                                                                gender: user.gender,
                                                                            });
                                                                            if (editUser) {
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
                                                                            let del = window.confirm(`Are you sure you want to delete "${user.name}"?`);
                                                                            if (del) {
                                                                                await RemoveUser({
                                                                                    variables: {
                                                                                        id: user.id,
                                                                                    },
                                                                                });
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
                                        </div>

                                        {/* Hidden button to lunch edit modal */}
                                        <button type="button" id="btnModal" data-target="#editModal" data-toggle="modal" style={{ display: "none" }}></button>
                                    </div>
                                    {/* Pagination */}
                                    {data && (
                                        <div className="col-12 fade-in">
                                            <div className="element-box">
                                                <Pagination
                                                    length={data.GetUsers.docs.length}
                                                    {...data.GetUsers}
                                                    onPageClicked={(page: number) => {
                                                        SetPage(page);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {/* No User record found */}
                            {data && data.GetUsers.docs.length === 0 && (
                                <div className="text-center pt-5 fade-in">
                                    <h3 className="text-danger"> No User record found!</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/*Image  Modal*/}
            <ImageModal image={activeImg?.image} name={activeImg?.name} />

            {editUser && (
                <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                    <div className="modal-dialog modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Edit User Info <hr />
                                </h5>

                                <button className="close" data-dismiss="modal" type="button">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body pb-2">
                                <LoadingState loading={uLoading} />
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        // Scroll to top of page
                                        scrollTop();
                                        UpdateUser({
                                            variables: {
                                                id: activeUserId,
                                                model: editUser,
                                            },
                                        });
                                    }}
                                >
                                    <div className="row">
                                        {/* Name input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter name"
                                                label="Name"
                                                icon="os-icon-email-2-at2"
                                                required={true}
                                                type="text"
                                                initVal={editUser.name}
                                                onChange={(name: string) => {
                                                    SetEditUser({
                                                        ...editUser,
                                                        name,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Phone number input */}
                                        <div className="col-12">
                                            <IconInput
                                                placeholder="Enter Phone number"
                                                label="Phone number"
                                                icon="os-icon-phone"
                                                required={true}
                                                type="text"
                                                initVal={editUser.phone}
                                                onChange={(phone: string) => {
                                                    SetEditUser({
                                                        ...editUser,
                                                        phone,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* Gender input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="departmental">Gender</label>
                                                <Select
                                                    options={gender.gender}
                                                    value={{
                                                        label: editUser.gender || <span className="text-gray">Select...</span>,
                                                        value: editUser.gender,
                                                    }}
                                                    onChange={(item: any) => {
                                                        SetEditUser({
                                                            ...editUser,
                                                            gender: item.label,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 buttons-w mt-3 mb-5">
                                            <button className="btn btn-primary px-5 mt-3" type="submit">
                                                Update User
                                            </button>
                                        </div>
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

export default UserList;
