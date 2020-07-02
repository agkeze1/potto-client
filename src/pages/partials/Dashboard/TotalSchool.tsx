import React, { useState } from "react";
import { CountCard } from "../../in/partials/CountCard";
import { useQuery } from "@apollo/react-hooks";
import { DASHBOARD } from "../../../queries/Dashboard.query";
import { authService } from "../../../services/Auth.Service";
import { EventEmitter } from "../../../events/EventEmitter";
import { ACTION_EVENT } from "./../../../events/index";

const TotalSchool = () => {
    const [total, setTotal] = useState(0);
    const { superAdmin } = authService.GetUser();

    const { loading } = useQuery(DASHBOARD.TOTAL_SCHOOL, {
        onCompleted: (d) => {
            setTotal(d.TotalSchools);
        },
    });
    EventEmitter.subscribe(ACTION_EVENT.SCHOOL.CREATED, () => {
        const count = total + 1;
        setTotal(count);
    });
    if (superAdmin) return <CountCard title="Total Schools" loading={loading} value={total} cssClass="bg-white bg-gainsboro" />;
    return null;
};

export default TotalSchool;
