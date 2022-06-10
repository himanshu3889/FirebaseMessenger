import React from "react";
import Gallery from "../../pages/Gallery";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
export default [
  {
    path: "/",
    exact: true,
    element: <Home />,
    protected: null,
  },
  {
    path: "/gallery",
    element: <Gallery />,
    protected: 'auth',
  },
  {
    path: "/login",
    element: <Login />,
    protected: 'guest',
  },
  {
    path: "/signup",
    element: <Signup />,
    protected: 'guest',
  },
];
