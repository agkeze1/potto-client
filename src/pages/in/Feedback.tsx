/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Helmet from "react-helmet";
import { GetAppName } from "../../context/App";
import Select from "react-select";

const Feedback = () => {
    const role = [
        { label: "Complaint", value: 1 },
        { label: "Suggestion", value: 2 },
    ];
    return (
        <>
            <Helmet>
                <title>Feedback | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <h5 className="element-header">Feedback</h5>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group">
                                                    <label htmlFor="departmental">Filter Feedback Type</label>
                                                    <Select isMulti={true} options={role} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="element-box-tp">
                                            <div className="table-responsive">
                                                <table className="table table-padded">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Type</th>
                                                            <th>Subject</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>Complaint</td>
                                                            <td>Something is not working</td>
                                                            <td>22nd May 2019</td>
                                                            <td>
                                                                <span className="badge badge-success-inverted">Attended</span>
                                                            </td>
                                                            <td className="row-actions text-center">
                                                                <a href="#" title="View content" data-target="#ContentModal" data-toggle="modal">
                                                                    <i className="os-icon os-icon-eye"></i>
                                                                </a>
                                                                <a className="danger" href="#" title="Mark un-attended">
                                                                    <i className="os-icon os-icon-x-circle"></i>
                                                                </a>
                                                                <a className="danger" href="#" title="Delete">
                                                                    <i className="os-icon os-icon-ui-15"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>Suggestion</td>
                                                            <td>Pls can you include edit on Navigation group.</td>
                                                            <td>12th Jan. 2020</td>
                                                            <td>
                                                                <span className="badge badge-danger-inverted">Not Attended</span>
                                                            </td>
                                                            <td className="row-actions text-center">
                                                                <a href="#" title="View content">
                                                                    <i className="os-icon os-icon-eye"></i>
                                                                </a>
                                                                <a className="text-success" href="#" title="Mark attended">
                                                                    <i className="os-icon os-icon-check-circle"></i>
                                                                </a>
                                                                <a className="danger" href="#" title="Delete">
                                                                    <i className="os-icon os-icon-ui-15"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* <div className="text-center pt-5 fade-in">
                        <h2 className="text-danger">No Navigation Group found!</h2>
                      </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback ContentModal Modal */}
            <div aria-hidden="true" className="modal fade" id="ContentModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Feedback Content</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> ×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Discharge best employed your phase each the of shine. Be met even reason consider logbook redesigns.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
