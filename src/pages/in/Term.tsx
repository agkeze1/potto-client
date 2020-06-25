/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage, cleanDate } from "../../context/App";
import { NEW_TERM, TERM_LIST, REMOVE_TERM, UPDATE_TERM, GET_ACTIVE_TERM, NEW_ACTIVE_TERM } from "../../queries/Term.query";
import { IProps } from "../../models/IProps";
import { authService } from "../../services/Auth.Service";
import { useMutation, useQuery } from "@apollo/react-hooks";
import LoadingState from "../partials/loading";
import IconInput from "../partials/IconInput";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import Select from "react-select";

const Term: FC<IProps> = ({ history }) => {
    const [newTerm, SetNewTerm] = useState<string>();
    const [editTerm, SetEditTerm] = useState<any>({});
    const [activeTerm, SetActiveTerm] = useState<any>();
    const [newActiveTerm, SetNewActiveTerm] = useState<any>();
    const [terms, SetTerms] = useState<any>();

    // Check if user is authenticated
    if (!authService.IsAuthenticated()) {
        history.push("/login");
    }

    // Create New Term
    const [NewTerm, { loading }] = useMutation(NEW_TERM, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => toast.success(data.NewTerm.message),
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: TERM_LIST,
            });

            q.GetTerms.docs.unshift(data.NewTerm.doc);

            //update
            cache.writeQuery({
                query: TERM_LIST,
                data: { GetTerms: q.GetTerms },
            });
        },
    });

    // Remove Term
    const [RemoveTerm, { loading: rLoading }] = useMutation(REMOVE_TERM, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: TERM_LIST,
            });

            const index = q.GetTerms.docs.findIndex((i: any) => i.id === data.RemoveTerm.doc.id);

            q.GetTerms.docs.splice(index, 1);

            //update
            cache.writeQuery({
                query: TERM_LIST,
                data: { GetTerms: q.GetTerms },
            });
        },
    });

    // Update Term
    const [UpdateTerm, { loading: uLoading }] = useMutation(UPDATE_TERM, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            toast.success(data.UpdateTerm.message);
        },
        update: (cache, { data }) => {
            const q: any = cache.readQuery({
                query: TERM_LIST,
            });

            const index = q.GetTerms.docs.findIndex((i: any) => i.id === data.UpdateTerm.doc.id);

            q.GetTerms.docs.splice(index, 1);
            q.GetTerms.docs.unshift(data.UpdateTerm.doc);

            //update
            cache.writeQuery({
                query: TERM_LIST,
                data: { GetTerms: q.GetTerms },
            });
        },
    });

    // Get list of Terms
    const { loading: lLoading, data: lData } = useQuery(TERM_LIST, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            if (data) {
                const terms = data.GetTerms.docs.map((term: any) => ({
                    label: term?.name,
                    value: term?.id,
                }));
                SetTerms(terms);
            }
        },
    });

    // Get Active Term
    const { loading: atLoading } = useQuery(GET_ACTIVE_TERM, {
        onError: (err) => {
            if (err.message !== "GraphQL error: Bad request! No active term found!") toast.error(CleanMessage(err.message));
        },
        onCompleted: (data) => {
            if (data) {
                SetActiveTerm(data.GetActiveTerm.doc);
            }
        },
    });

    // New Active Term
    const [NewActiveTerm, { loading: nATLoading }] = useMutation(NEW_ACTIVE_TERM, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (data) => {
            if (data) {
                SetNewActiveTerm(data.NewActiveTerm.doc);
                toast.info(CleanMessage(data.NewActiveTerm.message));
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Term | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <span className="element-actions">
                                    <button className="btn btn-primary btn-sm" title="Set Active Term" data-target="#activeTermModal" data-toggle="modal">
                                        <i className="os-icon os-icon-check-square mr-2"></i>
                                        Set Active Term
                                    </button>
                                </span>
                                <h5 className="element-header">
                                    Term {/* Active Term */}
                                    <LoadingState loading={atLoading} />
                                    {activeTerm && (
                                        <label className="badge badge-primary-inverted icon-pointer p-2" title="Click to Edit Active Term" data-target="#activeTermModal" data-toggle="modal">
                                            <i className="os-icon os-icon-check-square mr-2"></i>
                                            Active Term - <b> {activeTerm.term.name}</b> - {cleanDate(activeTerm.startDate)}
                                        </label>
                                    )}
                                </h5>
                                <div className=" justify-content-center">
                                    {/* New Term */}
                                    <div className="element-box">
                                        <LoadingState loading={loading} />
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                await NewTerm({
                                                    variables: {
                                                        name: newTerm,
                                                    },
                                                });
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-12">
                                                    {/* Term input */}
                                                    <IconInput
                                                        placeholder="Enter Term name"
                                                        label="New Term "
                                                        icon="os-icon-ui-09"
                                                        required={true}
                                                        type="text"
                                                        onChange={(name: string) => {
                                                            SetNewTerm(name);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <div className="buttons-w">
                                                        <button className="btn btn-primary" type="submit">
                                                            Save New
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Term List */}
                                    <LoadingState loading={lLoading || rLoading} />
                                    {lData && lData.GetTerms.docs.length > 0 && (
                                        <div className="element-box-tp ">
                                            <div className="table-responsive">
                                                <table className="table table-padded">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Term</th>
                                                            <th className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lData.GetTerms.docs.map((term: any, index: number) => (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{term.name}</td>
                                                                <td className="row-actions text-center">
                                                                    <a
                                                                        href="#"
                                                                        title="Edit"
                                                                        data-target="#editModal"
                                                                        data-toggle="modal"
                                                                        onClick={() => {
                                                                            SetEditTerm({
                                                                                id: term.id,
                                                                                name: term.name,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <i className="os-icon os-icon-edit"></i>
                                                                    </a>
                                                                    <a
                                                                        className="danger"
                                                                        href="#"
                                                                        title="Delete"
                                                                        onClick={async () => {
                                                                            let del = window.confirm(`Are you sure you want to delete "${term.name}"?`);
                                                                            if (del) {
                                                                                await RemoveTerm({
                                                                                    variables: {
                                                                                        id: term.id,
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
                                    )}
                                    {lData && lData.GetTerms.docs.length === 0 && (
                                        <div className="text-center pt-5 fade-in">
                                            <h3 className="text-danger"> No Term record found!</h3>
                                        </div>
                                    )}

                                    {/* List of Archived Terms */}
                                    <div className="element-box mt-5">
                                        <h6 className="element-header">Archived Active Terms</h6>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Term</th>
                                                        <th>Start Date</th>
                                                        <th className="text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>
                                                            Ist Term
                                                            {/* {term.id === activeTerm?.term?.id && (
                                <label className="badge badge-success-inverted ml-2">
                                  Active
                                </label>
                              )} */}
                                                        </td>
                                                        <td>3rd Aug. 2019</td>
                                                        <td className="row-actions text-center">
                                                            <a href="#" title="Set as Active" onClick={() => {}}>
                                                                <i className="os-icon os-icon-check-square"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Term Modal */}
            <div aria-hidden="true" className="modal fade" id="editModal" role="dialog">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Edit Term <hr />
                            </h5>
                            <button className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body element-box no-shadow pb-5">
                            <LoadingState loading={uLoading} />
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await UpdateTerm({
                                        variables: {
                                            id: editTerm.id,
                                            name: editTerm.name,
                                        },
                                    });
                                }}
                            >
                                <div className="row">
                                    <div className="col-12">
                                        {/* Term input */}
                                        <IconInput
                                            placeholder="Enter Term name"
                                            label="Term "
                                            icon="os-icon-ui-09"
                                            required={true}
                                            type="text"
                                            initVal={editTerm?.name}
                                            onChange={(name: string) => {
                                                SetEditTerm({
                                                    ...editTerm,
                                                    name,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="buttons-w">
                                            <button className="btn btn-primary" type="submit">
                                                Update Term
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Set Active Term Modal */}
            <div aria-hidden="true" className="modal fade" id="activeTermModal" role="dialog">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Set Active Term <hr />
                            </h5>
                            <button className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body element-box no-shadow pb-5">
                            <LoadingState loading={nATLoading} />
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await NewActiveTerm({
                                        variables: {
                                            model: newActiveTerm,
                                        },
                                    });
                                }}
                            >
                                <div>
                                    {/* From Date*/}
                                    <label>Start Date </label>
                                    <br />
                                    <DatePicker
                                        placeholderText="day, month year"
                                        selected={newActiveTerm?.startDate}
                                        onChange={(date) => {
                                            SetNewActiveTerm({
                                                ...newActiveTerm,
                                                startDate: date,
                                            });
                                        }}
                                        className="form-control"
                                        dateFormat="d, MMMM yyyy"
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>Term </label>
                                    <br />
                                    <Select
                                        options={terms}
                                        onChange={(term: any) => {
                                            SetNewActiveTerm({
                                                ...newActiveTerm,
                                                term: term.value,
                                            });
                                        }}
                                    />
                                </div>
                                <button className="btn btn-primary mt-3" type="submit">
                                    <i className="os-icon os-icon-check-square mr-2"></i>
                                    Set Active
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Term;
