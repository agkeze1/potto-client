import React from "react";
import { Redirect, Route } from "react-router-dom";
import { teacherAuthService } from "../services/teacher.auth.service";

interface IProp {
    component: any;
    path: string;
}

const PrivateRouteTeacher: React.FC<IProp> = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            teacherAuthService.IsAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/teacher/login",
                        state: { from: props.location },
                        search: `?redirect=${props.location.pathname}`,
                    }}
                />
            )
        }
    />
);

export default PrivateRouteTeacher;
