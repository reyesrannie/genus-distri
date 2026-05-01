import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { decodeUser } from "../functions/saveUser";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../../screen/login/Login";
import SystemNavigation from "../constant/SystemNavigation";
import { filterNavigationByAccess } from "../constant/checkValue";
import Redirect from "../../screen/redirect/Redirect"
const Routing = () => {
  const user = decodeUser();

  const { navigation } = SystemNavigation();

  const filterNavigation = filterNavigationByAccess(
    navigation,
    user?.role?.access_permission
  );

  const routes = useRoutes([
    { path: "/login", element: !user ? <Login /> : <Navigate to="/" /> },
    { path: "/redirect", element: <Redirect /> },

    {
      path: "/",
      element: <ProtectedRoute isAuthenticated={user} />,
      children: filterNavigation?.map((route) => ({
        path: route?.route?.replace("/", ""),
        element: route?.element,
        children: route?.children?.map((childRoute) => ({
          path: childRoute?.segment,
          element: childRoute?.element,
        })),
      })),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return routes;
};

export default Routing;
