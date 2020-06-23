import React from "react";
import Helmet from "react-helmet";
import { GetAppName, CleanMessage } from "./../../../context/App";
import { teacherAuthService } from "../../../services/teacher.auth.service";
import { useQuery } from "@apollo/react-hooks";
import { GET_TEACHER_TIMETABLE_SINGLE } from "../../../queries/Timetable.query";
import { toast } from "react-toastify";
import TeacherTimetableListing from "./items";
import LoadingState from "../../partials/loading";

const TeacherTimetable = () => {
    const teacher = teacherAuthService.GetTeacher();

    const { loading, data } = useQuery(GET_TEACHER_TIMETABLE_SINGLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        variables: { teacher: teacher.id },
    });
    return (
        <>
            <Helmet>
                <title> Timetable | {GetAppName()}</title>
            </Helmet>
            <div className="content-i">
                <div className="content-box">
                    <div className="element-wrapper">
                        <h5 className="element-header">Timetable</h5>
                        <LoadingState loading={loading} />
                        {!loading && <TeacherTimetableListing items={data.GetTeacherTimetables.docs} />}
                    </div>
                </div>
            </div>
        </>
    );
};
export default TeacherTimetable;
