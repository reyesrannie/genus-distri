import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchCount: 0,
  multipleView: false,
  multipleData: null,
  import: false,
  importData: null,
  importError: false,
  importErrorMessage: null,
  isLoading: false,
  userModal: false,
  user: null,
  rolesModal: false,
  roles: null,
  accountTitleModal: false,
  accountTitle: null,
  categoryModal: false,
  category: null,
  uomModal: false,
  uom: null,
  materialsModal: false,
  materials: null,
  warehouseModal: false,
  warehouse: null,
  assetModal: false,
  asset: null,
  approvalSetupModal: false,
  approvalSetup: null,
  cutOffModal: false,
  cutOff: null,
  orderTypeModal: false,
  orderType: null,
  customerModal: false,
  customer: null,
  orderingModal: false,
  ordering: null,
  orders: null,
  selectedIndex: null,
  viewOrdering: false,
  approverModal: false,
  createOrdering: false,
  updateOrdering: false,
  approveOrdering: false,
  serveOrdering: false,
  printableModal: false,
  hasRun: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setSearchCount: (state, action) => {
      state.searchCount = action.payload;
    },
    setMutipleView: (state, action) => {
      state.multipleView = action.payload;
    },
    setMultipleData: (state, action) => {
      state.multipleData = action.payload;
    },
    setImport: (state, action) => {
      state.import = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setImportData: (state, action) => {
      state.importData = action.payload;
    },
    setImportError: (state, action) => {
      state.importError = action.payload;
    },
    setImportErrorMessage: (state, action) => {
      state.importErrorMessage = action.payload;
    },
    setUserModal: (state, action) => {
      state.userModal = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRolesModal: (state, action) => {
      state.rolesModal = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setAccountTitleModal: (state, action) => {
      state.accountTitleModal = action.payload;
    },
    setAccountTitle: (state, action) => {
      state.accountTitle = action.payload;
    },
    setCategoryModal: (state, action) => {
      state.categoryModal = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setUomModal: (state, action) => {
      state.uomModal = action.payload;
    },
    setUom: (state, action) => {
      state.uom = action.payload;
    },
    setMaterialsModal: (state, action) => {
      state.materialsModal = action.payload;
    },
    setMaterials: (state, action) => {
      state.materials = action.payload;
    },
    setWarehouseModal: (state, action) => {
      state.warehouseModal = action.payload;
    },
    setWarehouse: (state, action) => {
      state.warehouse = action.payload;
    },
    setAssetModal: (state, action) => {
      state.assetModal = action.payload;
    },
    setAsset: (state, action) => {
      state.asset = action.payload;
    },
    setApprovalSetupModal: (state, action) => {
      state.approvalSetupModal = action.payload;
    },
    setApprovalSetup: (state, action) => {
      state.approvalSetup = action.payload;
    },
    setCutOffModal: (state, action) => {
      state.cutOffModal = action.payload;
    },
    setCutOff: (state, action) => {
      state.cutOff = action.payload;
    },
    setOrderTypeModal: (state, action) => {
      state.orderTypeModal = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setCustomerModal: (state, action) => {
      state.customerModal = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setOrderingModal: (state, action) => {
      state.orderingModal = action.payload;
    },
    setOrdering: (state, action) => {
      state.ordering = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    setApproverModal: (state, action) => {
      state.approverModal = action.payload;
    },
    setViewOrdering: (state, action) => {
      state.viewOrdering = action.payload;
    },
    setCreateOrdering: (state, action) => {
      state.createOrdering = action.payload;
    },
    setUpdateOrdering: (state, action) => {
      state.updateOrdering = action.payload;
    },
    setApproveOrdering: (state, action) => {
      state.approveOrdering = action.payload;
    },
    setServeOrdering: (state, action) => {
      state.serveOrdering = action.payload;
    },
    setPrintableModal: (state, action) => {
      state.printableModal = action.payload;
    },
    setHasRun: (state, action) => {
      state.hasRun = action.payload;
    },
    resetModal: () => {
      return initialState;
    },
  },
});

export const {
  setSearchCount,
  setMultipleData,
  setMutipleView,
  setImport,
  setIsLoading,
  setImportData,
  setImportError,
  setImportErrorMessage,
  setUserModal,
  setUser,
  setRolesModal,
  setRoles,
  setAccountTitleModal,
  setAccountTitle,
  setCategoryModal,
  setCategory,
  setUomModal,
  setUom,
  setMaterialsModal,
  setMaterials,
  setWarehouseModal,
  setWarehouse,
  setAssetModal,
  setAsset,
  setApprovalSetupModal,
  setApprovalSetup,
  setCutOffModal,
  setCutOff,
  setOrderTypeModal,
  setOrderType,
  setCustomerModal,
  setCustomer,
  setOrderingModal,
  setOrdering,
  setOrders,
  setSelectedIndex,
  setApproverModal,
  setViewOrdering,
  setCreateOrdering,
  setUpdateOrdering,
  setApproveOrdering,
  setServeOrdering,
  setPrintableModal,
  setHasRun,
  resetModal,
} = modalSlice.actions;

export default modalSlice.reducer;
