import { useState } from "react";

const useArcanaParamsHook = () => {
  const [params, setParams] = useState({
    isActive: true,
    PageNumber: 1,
    PageSize: 10,
  });

  const onPageChange = (PageNumber) => {
    setParams((currentValue) => ({
      ...currentValue,
      PageNumber: PageNumber,
    }));
  };

  const onRowChange = (PageSize) => {
    setParams((currentValue) => ({
      ...currentValue,
      PageNumber: 1,
      PageSize: PageSize.target.value,
    }));
  };

  const onStatusChange = (isActive) => {
    setParams((currentValue) => ({
      ...currentValue,
      isActive: isActive,
      PageNumber: 1,
    }));
  };

  const onSearchData = (search) => {
    setParams((currentValue) => ({
      ...currentValue,
      PageNumber: 1,
      search: search,
    }));
  };

  const onSelectPage = (PageNumber) => {
    setParams((currentValue) => ({
      ...currentValue,
      PageNumber: PageNumber,
    }));
  };

  return {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onStatusChange,
    onSelectPage,
  };
};

export default useArcanaParamsHook;
