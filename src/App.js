import React, { useEffect, useState } from "react";
// import "./assets/css/style.css";
import Loading from "./components/Loading";
import NotFound from "./pages/404";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "./utils/routes/routes";
import GuestRoute from "./utils/routes/GuestRoute";
import AuthRoute from "./utils/routes/AuthRoute";
import { auth } from "./configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "./store/AuthContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setIsLoading(false);
      } else {
        setUser({});
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });
  }, []);

  const location = useLocation();

  if (isLoading) return <Loading />;
  return (
    <AuthContext.Provider value={[isLoggedIn, user]}>
      <main className="">
        <Routes key={location.pathname} location={location}>
          {routes.map((route, index) => {
            if (route.protected === "guest") {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={<GuestRoute component={route.element} />}
                />
              );
            }

            if (route.protected === "auth") {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={<AuthRoute component={route.element} />}
                />
              );
            }

            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                element={route.element}
              />
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}
