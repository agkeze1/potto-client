import React, { FC, useState } from "react";
import LoadingState from "./loading";
import { imageService } from "../../services/Image.service";
import { toast } from "react-toastify";

interface Image {
    title: string;
    accept?: string;
    onData?: any;
}

const ImageUpload: FC<Image> = ({ title = "Choose File", accept = "image/*", onData }) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="custom-file">
                <input
                    type="file"
                    className="custom-file-input"
                    accept={accept}
                    multiple={false}
                    onChange={async (evt) => {
                        if (evt.target.files?.length) {
                            // upload service
                            setLoading(true);
                            const data = await imageService.Upload(evt.target.files[0]);
                            setLoading(false);
                            if (data) {
                                onData(data);
                                toast.success("Image uploaded successfully");
                            } else {
                                throw new Error("Unable to upload image!");
                            }
                        } else {
                            toast.info("No file selected!");
                        }
                    }}
                    id="customFile"
                />
                <label className="custom-file-label" htmlFor="customFile">
                    {title}
                </label>
            </div>
            <LoadingState loading={loading} />
        </>
    );
};

export default ImageUpload;
