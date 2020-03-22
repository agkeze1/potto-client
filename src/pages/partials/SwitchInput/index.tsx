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
      <div className="row">
        <div className="col-3">
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
                height: "22px"
              }}
            >
              <span
                className={`react-switch-button`}
                style={{
                  width: "33px",
                  height: "33px",
                  marginTop: "-2px",
                  border: isOn ? "1px solid #16a820" : "1px solid darkgray"
                }}
              />
            </label>
          </div>
        </div>
        <div className="col-7" style={{ marginTop: "23px" }}>
          <span style={{ cursor: "pointer" }} onClick={handleToggle}>
            {label}
          </span>
        </div>
      </div>
    </>
  );
};

export default SwitchInput;
