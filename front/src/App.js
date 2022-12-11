import "./App.css";
import AuthComponent from "./app/components/AuthComponent";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useSelector } from "react-redux";
import { isAuthenticated } from "./app/redux/silces/AuthSilce";
import RegisterFirstTime from "./app/components/RegisterFirstTime";
import Task from "./app/components/Task";

const App = () => {
  const isAuth = useSelector(isAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              !isAuth ? <AuthComponent /> : <Navigate replace to={"/tache"} />
            }
          />
          <Route
            exact
            path="/register"
            element={
              !isAuth ? (
                <RegisterFirstTime />
              ) : (
                <Navigate replace to={"/tache"} />
              )
            }
          />

          <Route
            exact
            path="/tache"
            element={isAuth ? <Task /> : <Navigate replace to={"/"} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
