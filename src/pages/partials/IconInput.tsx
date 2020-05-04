import React, { FC } from "react";

interface props {
  icon: string;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
  onChange?: any;
  classStyle?: string;
  initVal?: string;
  disabled?: boolean;
}

const IconInput: FC<props> = ({
  icon,
  placeholder,
  label,
  required,
  type,
  onChange,
  classStyle,
  initVal,
  disabled,
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
          className={`form-control ${classStyle}`}
          placeholder={placeholder}
          required={required}
          value={initVal}
          disabled={disabled}
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
