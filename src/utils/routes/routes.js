import React from "react";
import ForgotPassword from "../../pages/ForgotPassword";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Profile from "../../pages/Profile";
import Signup from "../../pages/Signup";

const routes = [
  {
    path: "/",
    exact: true,
    element: <Home />,
    protected: "auth",
  },
  {
    path: "/profile",
    element: <Profile />,
    protected: "auth",
  },

  {
    path: "/login",
    element: <Login />,
    protected: "guest",
  },
  {
    path: "/signup",
    element: <Signup />,
    protected: "guest",
  },
  {
    path: "/resetPassword",
    element: <ForgotPassword />,
    protected: "guest",
  },
];

export default routes;
