import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

import "react-accessible-accordion/dist/fancy-example.css";

const AttAccordion = () => {
  return (
    <Accordion
      allowMultipleExpanded={true}
      preExpanded={["AccordionItem"]}
      className="mb-5"
    >
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <span className="element-header">
              <b className="text-uppercase">English Language</b>
              <span className=""> - (SS2 - A)</span> |{" "}
              <b className="mr-5">Mon. (8:30AM - 9:20AM)</b>
            </span>
            {/* Teacher */}
            <span className="element-box mr-1 px-3">
              <span className="avatar">
                <img
                  alt="teacher"
                  src="/avatar.png"
                  style={{ width: "40px", height: "40px" }}
                />
              </span>
              <span className="">John Mayers George</span>
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
                    <th>Date</th>
                    <th>Status</th>
                    <th>Device</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>21st Jan. 2020</td>
                    <td>
                      <label className="badge badge-success-inverted">
                        Attended
                      </label>
                    </td>
                    <td>Device Component</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>29st Jan. 2020</td>
                    <td>
                      <label className="badge badge-danger-inverted">
                        Absent
                      </label>
                    </td>
                    <td>Device Component</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>6th Feb. 2020</td>
                    <td>
                      <label className="badge badge-warning-inverted">
                        Exempted
                      </label>
                    </td>
                    <td>Device Component</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <span className="element-header">
              <b className="text-uppercase">Mathematics</b>
              <span className=""> - (SS2 - A)</span> |{" "}
              <b className="mr-5">Mon. (8:30AM - 9:20AM)</b>
            </span>
            {/* Teacher */}
            <span className="element-box mr-1 px-3">
              <span className="avatar">
                <img
                  alt="teacher"
                  src="/avatar.png"
                  style={{ width: "40px", height: "40px" }}
                />
              </span>
              <span className="">Mrs Okenwa Gloria</span>
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
                    <th>Date</th>
                    <th>Status</th>
                    <th>Device</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>21st Jan. 2020</td>
                    <td>
                      <label className="badge badge-success-inverted">
                        Attended
                      </label>
                    </td>
                    <td>Device Component</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>29st Jan. 2020</td>
                    <td>
                      <label className="badge badge-danger-inverted">
                        Absent
                      </label>
                    </td>
                    <td>Device Component</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>6th Feb. 2020</td>
                    <td>
                      <label className="badge badge-warning-inverted">
                        Exempted
                      </label>
                    </td>
                    <td>Device Component</td>
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

export default AttAccordion;
