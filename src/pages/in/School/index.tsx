/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from "react";
import Helmet from "react-helmet";
import { GetAppName, CLEAN_DATE, CleanMessage } from "../../../context/App";
import { IProps } from "../../../models/IProps";
import { NavLink } from "react-router-dom";
import ImageModal from "../../partials/ImageModal";
import { authService } from "../../../services/Auth.Service";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_SCHOOL_LIST, MAKE_PRIMARY } from "../../../queries/School.query";
import Pagination from "../../partials/Pagination";
import LoadingState from "../../partials/loading";
import { School } from "../../../models/School.model";
import { IImageProp } from "../../../models/IImageProp";
import { toast } from "react-toastify";

const SchoolList: FC<IProps> = ({ history }) => {
    const [page, SetPage] = useState<number>(1);
    const [limit] = useState<number>(25);
    const [activeSchId, SetActiveSchId] = useState<string>();
    const [activeImg, SetActiveImg] = useState<IImageProp>({
        image: "/avatar.png",
        name: "Undefined",
    });

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Get  School of logged in user
    const { school } = authService.GetUser();

    // Get List of schools
    const { data, loading, fetchMore } = useQuery(GET_SCHOOL_LIST, {
        variables: { page, limit },
        onError: (err) => toast.error(CleanMessage(err.message)),
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    GetSchools: fetchMoreResult.GetSchools,
                };
            },
        });
    }, [page, limit, fetchMore]);

    // Change logged in user's primary school
    const [ChangePriSchool, { loading: pLoading }] = useMutation(MAKE_PRIMARY, {
        onCompleted: (data) => {
            if (data) {
                const { doc, token } = data.MakePrimarySchool;
                authService.Login(doc, token);
                document.location.reload();
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>School List | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <span className="element-actions mt-n2">
                            <NavLink to="/in/new-school" className="btn btn-primary " type="button">
                                Create New
                            </NavLink>
                        </span>
                        <h5 className="element-header">School List</h5>

                        <LoadingState loading={loading} />
                        {data && data.GetSchools.docs.length > 0 && (
                            <>
                                <div className="element-box">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-12">
                                            <label htmlFor="">Filter School</label>
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
                                                        <input className="form-control" placeholder="Enter school ref.no, alias or name to search" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4 col-lg-2">
                                                    <div className="buttons-w">
                                                        <button className="btn btn-primary">Search School</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row justify-content-center ">
                                    <div className="col-lg-12 pt-5">
                                        <div className="element-box-tp">
                                            <div className="table-responsive">
                                                <table className="table table-padded">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Logo</th>
                                                            <th>Name</th>
                                                            <th>Alias</th>
                                                            <th>Created At</th>
                                                            <th className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.GetSchools.docs.map((rec: School, index: number) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <div
                                                                        onClick={() => {
                                                                            SetActiveImg({
                                                                                image: rec.logo,
                                                                                name: rec.alias,
                                                                            });
                                                                        }}
                                                                        className="user-with-avatar clickable"
                                                                        data-target="#imageModal"
                                                                        data-toggle="modal"
                                                                    >
                                                                        <img src={rec.logo} alt="Logo" />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {rec.name}
                                                                    {rec.id === school.id && <label className="badge badge-success-inverted ml-2">Primary</label>}
                                                                    {activeSchId === rec.id && <LoadingState loading={pLoading} />}
                                                                </td>
                                                                <td>{rec.alias}</td>
                                                                <td>{CLEAN_DATE(rec.created_at)}</td>
                                                                <td className="row-actions text-center">
                                                                    {rec.id !== school.id && (
                                                                        <a
                                                                            href="#"
                                                                            title="Make primary School"
                                                                            onClick={() => {
                                                                                SetActiveSchId(rec.id);
                                                                                ChangePriSchool({
                                                                                    variables: {
                                                                                        school: rec.id,
                                                                                    },
                                                                                });
                                                                            }}
                                                                        >
                                                                            <i className="os-icon os-icon-check-square text-primary"></i>
                                                                        </a>
                                                                    )}
                                                                    <NavLink
                                                                        title="View Profile"
                                                                        to={{
                                                                            pathname: `/in/school/${rec.id}`,
                                                                        }}
                                                                    >
                                                                        <i className="os-icon os-icon-eye"></i>
                                                                    </NavLink>
                                                                    <a className="danger" href="#" title="Delete">
                                                                        <i className="os-icon os-icon-ui-15"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    {data && (
                                        <div className="col-lg fade-in">
                                            <div className="element-box">
                                                <Pagination
                                                    length={data.GetSchools.docs.length}
                                                    {...data.GetSchools}
                                                    onPageClicked={(page: number) => {
                                                        SetPage(page);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {data && data.GetSchools.docs.length === 0 && (
                            <div className="text-center pt-5 fade-in">
                                <h5 className="text-danger">No School found!</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Schoo Logo */}
            <ImageModal image={activeImg?.image} name={activeImg?.name} />
        </>
    );
};

export default SchoolList;
