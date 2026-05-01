import { useState } from "react";

const useParamsHookOrdering = () => {
  const [params, setParams] = useState({
    status: "active",
    page: 1,
    per_page: 20,
    pagination: null,
    sorts: null,
    search: "",
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
      status: "active",
      page: 1,
      per_page: 10,
      pagination: null,
      sorts: null,
      search: "",
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

export default useParamsHookOrdering;
