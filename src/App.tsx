import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import FirstSchool from "./pages/FirstSchool";
import In from "./pages/in";
import "react-datepicker/dist/react-datepicker.css";

// import toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import SecuredRoute from "./pages/in/partials/SecuredRoute";
import TeacherLogin from "./pages/teacher-corner/Login";
import PrivateRouteTeacher from "./context/PrivateRouteTeacher";
import TeacherCorner from "./pages/teacher-corner";
import TeacherPasswordReset from "./pages/teacher-corner/PasswordReset";
import TeacherNewPassword from "./pages/teacher-corner/TeacherNewPassword";
import ForgotPassword from "./pages/auth/forget-password";
import UserNewPassword from "./pages/auth/new-password";

function App() {
    return (
        <>
            <Switch>
                <Route exact path="/" component={UserLogin} />
                <Route exact path="/login" component={UserLogin} />
                <Route path="/default_school" component={FirstSchool} />
                <Route path="/signup" component={UserSignup} />
                <Route path="/auth/password-reset" component={ForgotPassword} />
                <Route path="/auth/new-password" component={UserNewPassword} />
                <SecuredRoute path="/in" component={In} />
                <Route path="/teacher/login" component={TeacherLogin} />
                <PrivateRouteTeacher path="/teacher/app" component={TeacherCorner} />
                <Route path="/teacher/reset-password" component={TeacherPasswordReset} />
                <Route path="/teacher/new-password" component={TeacherNewPassword} />
            </Switch>
            <ToastContainer position="top-center" />
        </>
    );
}

export default App;
