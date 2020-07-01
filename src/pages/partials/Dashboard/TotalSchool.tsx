import React, { useState } from "react";
import { CountCard } from "../../in/partials/CountCard";
import { useQuery } from "@apollo/react-hooks";
import { DASHBOARD } from "../../../queries/Dashboard.query";
import { authService } from "../../../services/Auth.Service";

const TotalSchool = () => {
    const [total, setTotal] = useState(0);
    const { superAdmin } = authService.GetUser();

    const { loading } = useQuery(DASHBOARD.TOTAL_SCHOOL, {
        onCompleted: (d) => {
            setTotal(d.TotalSchools);
        },
    });
    if (superAdmin) return <CountCard title="Total Schools" loading={loading} value={total} cssClass="bg-white bg-gainsboro" />;
    return null;
};

export default TotalSchool;
