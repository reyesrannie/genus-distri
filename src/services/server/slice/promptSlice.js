import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reset: false,
  archive: false,
  create: false,
  update: false,
  approve: false,
  serve: false,
  viewRemarks: false,
  payloadData: null,
  warning: false,
  isNotMatched: false,
  filter: null,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setReset: (state, action) => {
      state.reset = action.payload;
    },
    setArchive: (state, action) => {
      state.archive = action.payload;
    },
    setCreate: (state, action) => {
      state.create = action.payload;
    },
    setPayloadData: (state, action) => {
      state.payloadData = action.payload;
    },
    setUpdate: (state, action) => {
      state.update = action.payload;
    },
    setServe: (state, action) => {
      state.serve = action.payload;
    },
    setApprove: (state, action) => {
      state.approve = action.payload;
    },
    setViewRemarks: (state, action) => {
      state.viewRemarks = action.payload;
    },
    setWarning: (state, action) => {
      state.warning = action.payload;
    },
    setIsNotMatch: (state, action) => {
      state.isNotMatched = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetPrompt: () => {
      return initialState;
    },
  },
});

export const {
  setUpdate,
  setReset,
  setPayloadData,
  setCreate,
  setArchive,
  setServe,
  setApprove,
  setViewRemarks,
  setWarning,
  setIsNotMatch,
  setFilter,
  resetPrompt,
} = promptSlice.actions;

export default promptSlice.reducer;
