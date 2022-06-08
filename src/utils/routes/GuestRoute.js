import React from 'react'
import {Navigate} from 'react-router-dom'

export default function GuestRoute({ component }) {
  console.log("Inside auth route");
  return <Navigate to="/" />;
  // return component;
}
