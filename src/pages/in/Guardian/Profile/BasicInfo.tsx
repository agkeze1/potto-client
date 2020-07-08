import React, { FC } from "react";
import { CLEAN_DATE } from "../../../../context/App";

interface IProp {
  guardian: any;
}
const BasicInfo: FC<IProp> = ({ guardian }) => {
  return (
    <div className="text-center element-box no-bg no-shadow">
      <ul className="pro-details">
        <li>
          <span>Gender</span> | <b>{guardian.gender}</b>
        </li>
        <li>
          <span>Phone</span> | <b>{guardian.phone}</b>
        </li>
        <li>
          <span>Email</span> | <b>{guardian.email}</b>
        </li>
        <li>
          <span>State of Origin</span> | <b>{guardian.state}</b>
        </li>
        <li>
          <span>LGA</span> | <b>{guardian.lga}</b>
        </li>
        <li>
          <span>Hometown</span> | <b>{guardian.hometown}</b>
        </li>
        <li>
          <span>Residential Address</span> | <b>{guardian.address}</b>
        </li>
        <li>
          <span>Date Created</span> | <b>{CLEAN_DATE(guardian.created_at)}</b>
        </li>
      </ul>
    </div>
  );
};

export default BasicInfo;
