import React from "react";
import Gallery from "../../pages/Gallery";
import Home from "../../pages/Home";
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
];
