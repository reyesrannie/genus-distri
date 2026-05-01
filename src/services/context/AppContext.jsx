import React, { createContext, useContext } from "react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const TitleContext = createContext();
export const useTitleContext = () => useContext(TitleContext);
