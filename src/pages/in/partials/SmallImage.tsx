import React, { FC } from "react";

interface IProps {
  imgPath?: string;
  altText?: string;
  onClick?: any;
}

const SmallImage: FC<IProps> = ({ imgPath, altText, onClick }) => {
  return (
    <>
      <img
        className="avatar img-sm clickable"
        src={imgPath || "/avatar.png"}
        onClick={() => onClick()}
        alt={altText || "passport"}
        data-target="#imageModal"
        data-toggle="modal"
      />
    </>
  );
};

export default SmallImage;
