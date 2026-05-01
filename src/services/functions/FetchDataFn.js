import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

export const FetchDataFn = () => {
  const dispatch = useDispatch();

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const multipleFetch = async (
    data,
    valueCheck,
    getValue,
    search,
    setData,
    running,
  ) => {
    running.current = true;
    const results = [];
    for (const item of data) {
      if (!valueCheck()) {
        const searchPath = getNestedValue(item, search);
        const res = await getValue({
          status: "active",
          search: searchPath,
        }).unwrap();
        if (res?.result?.data?.length) {
          results.push(...res.result.data);
        }
      }
    }
    dispatch(setData(results));
    running.current = false;
  };

  const multipleOrderFetch = async (
    data,
    valueCheck,
    getValue,
    setData,
    running,
  ) => {
    running.current = true;
    const results = [];
    for (const item of data) {
      if (!valueCheck() && item !== "") {
        const res = await getValue({
          status: "active",
          search: item,
        }).unwrap();
        if (res?.result?.data?.length) {
          results.push(...res.result.data);
        }
      }
    }
    dispatch(setData(results));
    running.current = false;
  };

  return { multipleFetch, multipleOrderFetch };
};
