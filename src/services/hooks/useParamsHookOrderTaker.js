import { useState } from "react";

const useParamsHookOrderTaker = () => {
  const [params, setParams] = useState({
    status: "today",
    page: 1,
    per_page: 10,
    pagination: undefined,
    sorts: undefined,
    date_from: undefined,
    date_to: undefined,
  });

  const onPageChange = (_, page) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: page + 1,
    }));
  };

  const onRowChange = (per_page) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: 1,
      per_page: per_page.target.value,
    }));
  };

  const onStatusChange = (status) => {
    setParams((currentValue) => ({
      ...currentValue,
      status: status,
      page: 1,
    }));
  };

  const onSearchData = (search) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: 1,
      search: search,
    }));
  };

  const onSortTable = (sorts) => {
    setParams((currentValue) => ({
      ...currentValue,
      sorts: sorts,
    }));
  };

  const onFilterChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };

  const onFromChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };
  const onToChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };

  const onSelectPage = (page) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: page,
    }));
  };

  const onReset = () => {
    setParams(() => ({
      ...params,
      search: "",
      page: 1,
      per_page: 10,
      pagination: undefined,
      sorts: undefined,
      date_from: undefined,
      date_to: undefined,
    }));
  };

  return {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onStatusChange,
    onSortTable,
    onFilterChange,
    onFromChange,
    onToChange,
    onSelectPage,
    onReset,
  };
};

export default useParamsHookOrderTaker;
