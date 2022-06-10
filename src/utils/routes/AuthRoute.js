import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../../store/AppContext";


export default function AuthRoute({ component }) {
  const [isLoggedIn] = useContext(AppContext);

  console.log("Inside auth route");
  if (isLoggedIn) {
    return component;
  }
  return <Navigate to="/"  />;
}
