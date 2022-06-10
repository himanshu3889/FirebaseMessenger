import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../../store/AppContext";


export default function GuestRoute({ component }) {
  const [isLoggedIn] = useContext(AppContext);

  console.log("Inside guest route");
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return component;
}
