import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, setUserData } from "../../services/server/slice/authSlice";
import { loginUser } from "../../services/functions/loginServices";

const Redirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const rawData = query.get("data");

  useEffect(() => {
    try {
      const data = JSON.parse(decodeURIComponent(rawData));
      dispatch(setToken(data?.result?.token));
      dispatch(setUserData(data?.result));
      loginUser(data?.result);
      navigate("/");
    } catch (e) {
      window.location.href = `https://one.rdfmis.com/`;
    }
  }, [rawData]);

  return;
};

export default Redirect;
