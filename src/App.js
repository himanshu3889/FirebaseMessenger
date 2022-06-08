import "./assets/css/style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import routes from "./utils/routes/routes";
import GuestRoute from "./utils/routes/GuestRoute";
import AuthRoute from "./utils/routes/AuthRoute";
import { Routes, Route, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  return (
    <div>
      <Header />
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
              // console.log(route)
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
      </Routes>

      <Footer />
    </div>
  );
}
