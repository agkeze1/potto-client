import React from "react";
import "./loading.css";

// template
interface LoadingProp {
  loading: boolean;
}

const LoadingState: React.FC<LoadingProp> = ({ loading }) => {
  if (loading)
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  return null;
};

export default LoadingState;
