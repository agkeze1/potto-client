import React, { FC } from "react";

interface props {
  icon: string;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
  onChange?: any;
}

const IconInput: FC<props> = ({
  icon,
  placeholder,
  label,
  required,
  type,
  onChange
}) => {
  return (
    <>
      <label htmlFor="email">{label}</label>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <div className={`os-icon ${icon}`}></div>
          </div>
        </div>
        <input
          className="form-control"
          placeholder={placeholder}
          required={required}
          onChange={({ target }) => {
            if (onChange) onChange(target.value);
          }}
          type={type}
        />
      </div>
    </>
  );
};

export default IconInput;
