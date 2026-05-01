import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef } from "react";

import "../styles/MobileNavigation.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SystemNavigation from "../../services/constant/SystemNavigation";
import {
  setHiddenNavigation,
  setIsButtomNavActivate,
} from "../../services/server/slice/drawerSlice";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { navigation } = SystemNavigation();
  const isButtomNavActivate = useSelector(
    (state) => state.drawer.isButtomNavActivate
  );

  const paperRef = useRef(null);
  useEffect(() => {
    const checkScroll = () => {
      if (paperRef.current) {
        dispatch(
          setHiddenNavigation(
            paperRef.current.scrollHeight > paperRef.current.clientHeight
          )
        );
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll); // Recheck on resize
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const currentPath = location?.pathname.split("/").slice(1)[0];

  return (
    <Paper
      ref={paperRef}
      className={`mobile-navigation-paper ${isButtomNavActivate ? "open" : ""}`}
      elevation={3}
    >
      <BottomNavigation
        className={`mobile-navigation-buttom-navigation ${
          isButtomNavActivate ? "open" : ""
        }`}
        showLabels
        value={`/${currentPath}`}
      >
        {navigation?.map((route, index) => (
          <BottomNavigationAction
            key={route.route || index}
            label={route.title}
            icon={route.icon}
            value={route.route}
            onClick={() => {
              navigate(route?.route);
              dispatch(setIsButtomNavActivate(false));
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation;
