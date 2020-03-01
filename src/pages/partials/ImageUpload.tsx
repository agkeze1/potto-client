import React, { FC, useState } from "react";
import AlertMessage from "./AlertMessage";
import LoadingState from "./loading";
import { imageService } from "../../services/Image.service";
import { IMessage } from "../../models/IMessage";

interface Image {
  title: string;
  accept?: string;
  onData?: any;
}

const ImageUpload: FC<Image> = ({
  title = "Choose File",
  accept = "image/*",
  onData
}) => {
  const [msg, setMessage] = useState<IMessage>();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>();

  return (
    <>
      <div className="custom-file">
        <input
          type="file"
          className="custom-file-input"
          accept={accept}
          multiple={false}
          onChange={async evt => {
            setMessage(undefined);
            if (evt.target.files?.length) {
              // upload service
              setLoading(true);
              const data = await imageService.Upload(evt.target.files[0]);
              setLoading(false);
              if (data) {
                onData(data);
                setImage(data);
                setMessage({
                  message: "Image uploaded successfully",
                  failed: false
                });
              } else {
                throw new Error("Unable to upload image!");
              }
            } else {
              setMessage({
                message: "No file selected!",
                failed: true
              });
            }
          }}
          id="customFile"
        />
        <label className="custom-file-label" htmlFor="customFile">
          {title}
        </label>
      </div>
      <AlertMessage message={msg?.message} failed={msg?.failed} />
      <LoadingState loading={loading} />
    </>
  );
};

export default ImageUpload;
