import React from "react";
import { decodeUser } from "./saveUser";
import dayjs from "dayjs";

export const cutOffGet = () => {
  const userData = decodeUser();
  const cutOffTime = userData?.cut_off[0]?.time;

  const timeToday = dayjs(new Date()).format("hh:mm:ss");
  const minData =
    timeToday >= cutOffTime
      ? dayjs(new Date()).add(1, "day")
      : dayjs(new Date());

  return minData;
};
