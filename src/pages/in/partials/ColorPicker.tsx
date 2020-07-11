import React, { useState, FC } from "react";
import { BlockPicker } from "react-color";

interface IProps {
  icon: string;
  placeholder: string;
  label: string;
  onChange: any;
  classStyle?: string;
  initVal?: string;
  initColor?: string;
}

const ColorPicker: FC<IProps> = ({
  icon,
  placeholder,
  label,
  onChange,
  classStyle,
  initVal,
  initColor,
}) => {
  const [showPicker, SetShowPicker] = useState<boolean>();
  const [colour, SetColour] = useState<string>(
    initColor ? initColor : "#D9E3F0"
  );

  const popover: any = {
    position: "absolute",
    zIndex: "2",
  };
  const cover: any = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };
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
          style={{ backgroundColor: colour }}
          placeholder={placeholder}
          value={initVal}
          onFocus={() => {
            SetShowPicker(true);
          }}
        />
      </div>
      {showPicker ? (
        <div style={popover}>
          <div
            style={cover}
            onClick={() => {
              SetShowPicker(false);
            }}
          />
          <BlockPicker
            color={colour}
            onChangeComplete={(clr: any) => {
              SetColour(clr.hex);
              onChange(clr.hex);
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default ColorPicker;
