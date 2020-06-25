import React, { useState, FC } from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "./../../../context/App";
import MessageEditor from "../../partials/MessagingEditor";
import Select from "react-select";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ALL_TEACHERS_SHORT } from "./../../../queries/Teacher.query";
import { toast } from "react-toastify";
import TeacherExemptedList from "./exempted";
import { NavLink } from "react-router-dom";
import { SEND_TEACHER_MESSAGE, GET_TEACHER_MESSAGE } from "../../../queries/teacher-message.query";
import LoadingState from "../../partials/loading";

interface iProp {
    history: any;
}

const SendTeacherMessage: FC<iProp> = ({ history }) => {
    const title = "Send Message to Teachers";
    const [teachers, setTeachers] = useState([]);
    const [exempted, setExempted] = useState([]);

    const { loading } = useQuery(GET_ALL_TEACHERS_SHORT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => setTeachers(d.GetAllTeachers.docs),
    });

    const [sendFunc, { loading: sLoading }] = useMutation(SEND_TEACHER_MESSAGE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.SendTeachersMessage.message);
            history.push("/in/messaging/teachers");
        },
        update: (cache, { data: { SendTeachersMessage } }) => {
            // read
            const result: any = cache.readQuery({
                query: GET_TEACHER_MESSAGE,
                variables: { page: 1, limit: 25 },
            });
            // update
            result.GetTeacherMessageLog.docs.unshift(SendTeachersMessage.doc);
            result.GetTeacherMessageLog.totalDocs++;

            // write update back
            cache.writeQuery({
                query: GET_TEACHER_MESSAGE,
                variables: { page: 1, limit: 25 },
                data: { GetTeacherMessageLog: result.GetTeacherMessageLog },
            });
        },
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {GetAppName()}
                </title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <div className="row">
                            <div className="col-12 col-md-12">
                                <div className="element-box no-bg bg-white">
                                    <h5 className="element-header">
                                        <NavLink title="Back" to="/in/messaging/teachers">
                                            <i className="os-icon os-icon-arrow-left6 mr-4"></i>
                                        </NavLink>
                                        {title}
                                    </h5>
                                    <div className="col-12">
                                        <label htmlFor="teacher">Select teacher to Exempt</label>
                                        <Select
                                            options={teachers.map((i: any) => ({
                                                value: i.id,
                                                label: i.name,
                                            }))}
                                            isLoading={loading}
                                            id="teacher"
                                            isMulti={false}
                                            isSearchable={true}
                                            onChange={(item: any) => {
                                                const _item = teachers.find((c: any) => c.id === item.value);

                                                // add
                                                if (_item) {
                                                    const _items = [...exempted];
                                                    _items.push(_item);
                                                    setExempted(_items);
                                                }
                                                // remove
                                                const _itemIndex = teachers.findIndex((c: any) => c.id === item.value);
                                                if (_itemIndex !== -1) {
                                                    const _items = [...teachers];
                                                    _items.splice(_itemIndex, 1);
                                                    setTeachers(_items);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {exempted.length > 0 && (
                                <div className="col-12 fade-in">
                                    <h5 className="element-header">Exempted Teachers</h5>
                                    <TeacherExemptedList
                                        items={exempted}
                                        onCheck={(item: any) => {
                                            const _item = exempted.find((c: any) => c.id === item.id);

                                            // add
                                            if (_item) {
                                                const _items = [...teachers];
                                                _items.push(_item);
                                                setTeachers(_items);
                                            }
                                            // remove
                                            const _itemIndex = exempted.findIndex((c: any) => c.id === item.id);
                                            if (_itemIndex !== -1) {
                                                const _items = [...exempted];
                                                _items.splice(_itemIndex, 1);
                                                setExempted(_items);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            <div className="col-12 col-md-12">
                                <div className="element-box no-bg bg-white">
                                    <h5 className="element-header">Message Area</h5>
                                    <MessageEditor
                                        total={teachers.length}
                                        onSubmit={async (message: string) => {
                                            if (teachers.length) {
                                                await sendFunc({
                                                    variables: {
                                                        model: {
                                                            teachers: teachers.map((c: any) => c.id),
                                                            excluded: exempted.map((c: any) => c.id),
                                                            message,
                                                        },
                                                    },
                                                });
                                            } else {
                                                toast.info("Bad data! Select teacher to proceed.");
                                            }
                                        }}
                                    />
                                    <LoadingState loading={sLoading} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SendTeacherMessage;
