import React, { FC } from "react";
import { IImageProp } from "../../models/IImageProp";

const ImageModal: FC<IImageProp> = ({ image, name }) => {
  return (
    // Modal for Image
    <div
      aria-hidden="true"
      className="modal fade"
      id="imageModal"
      role="dialog"
    >
      <div className="modal-dialog modal-sm" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button className="close" data-dismiss="modal" type="button">
              <span aria-hidden="true"> &times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="pt-avatar-w text-center">
              <img alt="image" src={image} />
            </div>
            <hr />
            <div className="pt-user-name text-center pb-3">{name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
