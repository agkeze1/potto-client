import React, { FC } from "react";
import Select from "react-select";

interface Item {
  label: string;
  value: string;
}
interface InputProp {
  icon?: string;
  required?: boolean;
  label?: string;
  items: Array<Item>;
  onSelect: any;
  disabled?: boolean;
}
const Dropdown: FC<InputProp> = ({
  icon,
  label,
  items,
  onSelect,
  disabled
}) => {
  return (
    <div className="form-group">
      <label htmlFor=""> {label}</label>
      <Select
        options={items}
        onChange={(i: any) => onSelect(i)}
        isDisabled={disabled}
      />
      {icon && <div className={`pre-icon os-icon ${icon}`}></div>}
    </div>
  );
};

export default Dropdown;
