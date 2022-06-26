import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


export default function GuestRoute({ component }) {
  const [isLoggedIn] = useContext(AuthContext);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return component;
}
