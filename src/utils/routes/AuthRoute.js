import React from 'react'
import { Navigate } from "react-router-dom";
import Home from '../../pages/Home';

export default function AuthRoute({component}) {
  console.log("Inside auth route");
  return <Navigate to="/" />;
  // return component;
    }
  
