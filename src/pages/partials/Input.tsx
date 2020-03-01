import React, { FC } from "react";

interface InputProp {
  name: string;
  onChange: any;
  placeholder: string;
  icon?: string;
  type: string;
  required: boolean;
  label: string;
}
const Input: FC<InputProp> = ({
  name,
  onChange,
  placeholder,
  icon,
  type,
  required,
  label
}) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={type}
        onChange={({ target }) => onChange(target.value)}
        required={required}
        name={name}
        className="form-control"
        placeholder={placeholder}
      />
      <div className={`pre-icon os-icon ${icon}`}></div>
    </div>
  );
};

export default Input;
