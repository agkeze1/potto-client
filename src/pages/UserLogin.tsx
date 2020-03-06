import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { GetAppName } from "../context/App";
import { NavLink, Redirect } from "react-router-dom";
import Input from "./partials/Input";
// import AlertMessage from "../partial/AlertMessage";
// import Input from "../partial/Input";
// import LoadingState from "../partial/Loading";
// import { IMessage } from "../model/IMessage";
// import { authService } from "../services/Auth.Service";
// import { useMutation, useQuery } from "@apollo/react-hooks";
// import { USER_LOGIN, HAS_ADMIN } from "../queries/user.query";

interface LoginProps {
  location: any;
  history: any;
}

const UserLogin: React.FC<LoginProps> = ({ location, history }) => {
  document.body.className = "auth-wrapper";

  //   const [message, SetMessage] = useState<IMessage>();
  //   const [email, SetEmail] = useState();
  //   const [password, SetPassword] = useState();

  return (
    <>
      <Helmet>
        <title> Login | {GetAppName()}</title>
      </Helmet>
      <div className="all-wrapper menu-side with-pattern">
        <div className="auth-box-w">
          <div className="logo-w">
            <a href="/">
              <img alt="logo" width="80" src="logo192.png" />
            </a>
            <h6 className="mt-2">Potto</h6>
          </div>
          <h4 className="auth-header">Login</h4>
          <form className="pb-4">
            {/* Email input */}
            <Input
              name="email"
              placeholder="Enter email or phone"
              label="Email / Phone"
              onChange={(item: string) => {}}
              icon="os-icon-user-male-circle"
              required={true}
              type="email"
            />

            {/* Password input */}
            <Input
              name="password"
              placeholder="Enter password"
              label="Password"
              onChange={(item: string) => {}}
              icon="os-icon-fingerprint"
              required={true}
              type="password"
            />
            <div className="buttons-w pb-3">
              <button type="submit" className="btn btn-primary">
                Login
                <div className="os-icon os-icon-arrow-right7"></div>
              </button>
              <NavLink className="btn btn-link" to="#">
                Forgot password?
              </NavLink>
            </div>
          </form>
          <a
            className="text-center font-sm footer pb-3"
            href="http://afari.com"
          >
            <img src="/img/lloydant.png" alt="" className="logo-footer mr-2" />
            Powered by Afari
          </a>
        </div>
      </div>
    </>
  );
};
export default UserLogin;
