import React, { FC } from "react";

interface iProp {
    src: string;
    alt: string;
    width?: number;
}

const Image: FC<iProp> = ({ src, alt, width = 50 }) => (
    <div className="avatar-w">
        <img src={src || "/avatar.png"} className="avatar" style={{ width: `${width}px`, height: `${width}px` }} alt={alt} />
    </div>
);

export default Image;
