import React, { FC } from "react";
import LoadingState from "../../partials/loading";

interface IProps {
  title: string;
  loading: any;
  value: any;
  cssClass?: string;
}
export const CountCard: FC<IProps> = ({ loading, value, cssClass, title }) => {
  return (
    <a className={`element-box el-tablo mt-0 bg-white ${cssClass}`} href="#">
      <LoadingState loading={loading} />
      {!loading && (
        <>
          <div className="label">{title}</div>
          <div className="value">{value}</div>
        </>
      )}
    </a>
  );
};
