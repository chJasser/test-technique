import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login, setLoggedInUser } from "../redux/silces/AuthSilce";
import ResetPasswordForm from "./ResetPasswordForm";

import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import jwt_decode from "jwt-decode";

export default function AuthComponent() {
  const [token, setToken] = React.useState(null);
  const search = useLocation().search;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    // get access token
    setToken(new URLSearchParams(search).get("token"));
    if (token !== null) {
      dispatch(login(token));
      const decoded = jwt_decode(token);
      dispatch(setLoggedInUser(decoded));
      const timer = setTimeout(() => {
        navigate("/tache");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [token, search, navigate, dispatch]);

  const form = useSelector((state) => state.authSilce.form);

  const renderSwitch = () => {
    switch (form) {
      case "signin":
        return <SigninForm />;
      case "signup":
        return <SignupForm />;
      case "resetpassword":
        return <ResetPasswordForm />;
      default:
        return <SigninForm />;
    }
  };
  return <div>{renderSwitch()}</div>;
}
