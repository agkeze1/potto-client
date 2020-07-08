import React, { FC } from "react";

interface IProps {
  imgPath?: string;
  altText?: string;
  onClick?: any;
}

const LargeImage: FC<IProps> = ({ imgPath, altText, onClick }) => {
  return (
    <>
      <img
        className="avatar img-lg clickable"
        src={imgPath || "/avatar.png"}
        onClick={() => onClick()}
        alt={altText || "passport"}
      />
    </>
  );
};

export default LargeImage;
