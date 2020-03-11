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
                background: isOn ? "#06D6A0" : "",
                width: "60px",
                height: "25px"
              }}
            >
              <span
                className={`react-switch-button`}
                style={{ width: "35px", height: "35px" }}
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
