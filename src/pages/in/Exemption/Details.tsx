import React, { FC } from "react";
import StudentSearchResult from "../Search/Students";
import { cleanDate } from "../../../context/App";
interface iProp {
    item: any;
}

const ExemptionDetails: FC<iProp> = ({ item }) => {
    if (item)
        return (
            <div className="row">
                <div className="col-12 col-md-4">
                    <h6>Start Date</h6>
                    <p>{cleanDate(item.start, true, false)}</p>
                    <hr />
                    <h6>End Date</h6>
                    <p>{cleanDate(item.end, true, false)}</p>
                    <hr />
                    <h6>Description</h6>
                    <p>{item.desc}</p>
                </div>
                <div className="col-12 col-md-8">
                    <StudentSearchResult items={item.students} />
                </div>
            </div>
        );
    return null;
};

export default ExemptionDetails;
