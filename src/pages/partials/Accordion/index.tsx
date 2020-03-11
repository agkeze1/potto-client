import React from "react";
import "./accordion.css";
import "./accordion.js";

const Accordion = () => {
  return (
    <>
      <button className="accordion">Section 1</button>
      <div className="panel">
        <p>Lorem ipsum...</p>
      </div>

      <button className="accordion">Section 2</button>
      <div className="panel">
        <p>Lorem ipsum...</p>
      </div>

      <button className="accordion">Section 3</button>
      <div className="panel">
        <p>Lorem ipsum...</p>
      </div>
    </>
  );
};

export default Accordion;
