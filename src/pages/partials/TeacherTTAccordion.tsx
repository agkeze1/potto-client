import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

import "react-accessible-accordion/dist/fancy-example.css";

interface props {
  day: String;
}

const TeacherTTAccordion: React.FC<props> = ({ day }) => {
  return (
    <Accordion
      allowMultipleExpanded={true}
      preExpanded={["AccordionItem"]}
      className="mb-2"
    >
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <span className="element-header">
              <b className="text-uppercase">{day}</b>
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel style={{ background: "white" }}>
          <div className="text-center element-box no-bg no-shadow">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Time</th>
                    <th>Level</th>
                    <th>Date Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>English language</td>
                    <td>8:30AM - 9:20AM</td>
                    <td>SS1 - B</td>
                    <td>
                      13th Oct. 2020 -{" "}
                      <span className="smaller">( 3:29PM )</span>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Intro tech</td>
                    <td>10:30AM - 9:20AM</td>
                    <td>JSS3 - B</td>
                    <td>
                      8th May. 2020 -{" "}
                      <span className="smaller">( 9:29AM )</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TeacherTTAccordion;
