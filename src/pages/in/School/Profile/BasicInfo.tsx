import React, { FC } from "react";
import { CLEAN_DATE } from "../../../../context/App";

interface IProp {
  school: any;
}
const BasicInfo: FC<IProp> = ({ school }) => {
  return (
    <div className="text-center element-box no-bg no-shadow">
      <ul className="pro-details">
        <li>
          <span>Address</span> | <b>{school.address}</b>
        </li>
        <li>
          <span>Contact Phone</span> | <b>{school.contact_phone}</b>
        </li>
        <li>
          <span>Contact Email</span> | <b>{school.contact_email}</b>
        </li>
        <li>
          <span>Contact Address</span> | <b>{school.contact_address}</b>
        </li>
        <li>
          <span>Date Created</span> | <b>{CLEAN_DATE(school.created_at)}</b>
        </li>
        <li>
          <span>Primary Color</span> | <b>{school.primary_color}</b>
        </li>

        <li>
          <span>Secondary Color</span> | <b>{school.secondary_color}</b>
        </li>
      </ul>
    </div>
  );
};

export default BasicInfo;
