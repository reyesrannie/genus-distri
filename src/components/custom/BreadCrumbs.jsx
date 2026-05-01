import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SystemNavigation from "../../services/constant/SystemNavigation";

const BreadCrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigation } = SystemNavigation();

  const renderBreadcrumbLinks = (route, index) => {
    const breadcrumbLinks = [
      <Link
        color="text.primary"
        key={index}
        href={route?.route}
        onClick={(e) => {
          e.preventDefault();
          navigate(route?.route);
        }}
        underline="hover"
      >
        {route?.title}
      </Link>,
    ];

    if (route?.children) {
      route?.children?.forEach((childRoute) => {
        location.pathname === childRoute?.route &&
          breadcrumbLinks.push(<Typography>{childRoute.title}</Typography>);
      });
    }

    return breadcrumbLinks;
  };

  return (
    <Breadcrumbs>
      <Link
        color="text.primary"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        underline="hover"
      >
        Home
      </Link>
      {navigation.map(
        (route, index) =>
          location.pathname.split("/").slice(0, 2).join("/") === route.route &&
          renderBreadcrumbLinks(route, index),
      )}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
