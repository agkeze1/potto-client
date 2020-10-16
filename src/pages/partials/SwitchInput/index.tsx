import React, { FC } from "react";
import "./switchInput.css";

interface SwitchProps {
  isOn: boolean;
  handleToggle: any;
  label: string;
}
const SwitchInput: FC<SwitchProps> = ({ isOn, handleToggle, label }) => {
  return (
    <>
      <div
        className="row element-box"
        style={{ padding: "0 0 10px 50px", border: "1px solid lightgray" }}
      >
        <div className="col-3" style={{ marginTop: "-10px" }}>
          <div className=" float-right">
            <input
              checked={isOn}
              onChange={handleToggle}
              className="react-switch-checkbox"
              id={`react-switch-new`}
              type="checkbox"
            />
            <label
              className="react-switch-label"
              htmlFor={`react-switch-new`}
              style={{
                background: isOn ? "#16a820" : "",
                width: "60px",
                height: "22px",
              }}
            >
              <span
                className={`react-switch-button`}
                style={{
                  width: "33px",
                  height: "33px",
                  marginTop: "-2px",
                  // border: isOn ? "1px solid #16a820" : "1px solid darkgray",
                }}
              />
            </label>
          </div>
        </div>
        <div className="col-7" style={{ marginTop: "13px" }}>
          <span style={{ cursor: "pointer" }} onClick={handleToggle}>
            <b>{label}</b>
          </span>
        </div>
      </div>
    </>
  );
};

export default SwitchInput;
