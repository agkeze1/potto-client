import React from "react";
import { iPagination } from "../../models/Pagination.model";

const Pagination: React.FC<iPagination> = (props) => {
    const maxPage = 5;

    const { page, limit = 25, totalDocs, totalPages, length = 0, prevPage, nextPage, onPageClicked } = props;
    // Get page number
    const getPageNumber = () => (page - 1) * limit + 1;

    // get buttons
    const makeArrayFromDocs = () => {
        let newList = [];
        for (let i = 0; i < totalPages; i++) {
            newList.push(i);
        }

        return newList;
    };

    if (totalDocs)
        return (
            <div className="row fade-in">
                <div className="col-sm-12 col-md-4">
                    <div className="page-summary" id="example1_info" role="status" aria-live="polite">
                        showing <strong>{getPageNumber()}</strong> to <strong>{getPageNumber() + length - 1}</strong> of <strong>{totalDocs}</strong> entires
                    </div>
                </div>
                <div className="col-sm-12 col-md-8 text-right">
                    <div className="dataTables_paginate paging_simple_numbers" id="example1_paginate">
                        <ul className="pagination">
                            <li id="example1_previous" className="mr-2">
                                <button
                                    onClick={() => {
                                        if (prevPage) {
                                            onPageClicked(prevPage);
                                        }
                                        return;
                                    }}
                                    tabIndex={0}
                                    disabled={prevPage === null}
                                    className="btn btn-outline-primary"
                                >
                                    <i className="os-icon os-icon-chevron-left"></i>
                                </button>
                            </li>
                            {makeArrayFromDocs()
                                .slice(0, 10)
                                .map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => {
                                                if (item + 1 !== page) {
                                                    onPageClicked(item + 1);
                                                }
                                                return;
                                            }}
                                            tabIndex={0}
                                            className={`btn page-item ${page === item + 1 ? "btn-primary" : "btn-default"}`}
                                        >
                                            {item + 1}
                                        </button>
                                    </li>
                                ))}
                            {makeArrayFromDocs().length > maxPage && (
                                <li>
                                    <button tabIndex={0} className={`btn ${page > maxPage ? "btn-primary" : "btn-default"}`}>
                                        <i className="os-icon os-icon-more-horizontal"></i>
                                    </button>
                                </li>
                            )}
                            <li id="example1_next" className="ml-2">
                                <button
                                    disabled={nextPage === null}
                                    tabIndex={0}
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        if (nextPage) {
                                            onPageClicked(nextPage);
                                        }
                                        return;
                                    }}
                                >
                                    <i className="os-icon os-icon-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    return null;
};

export default Pagination;
