const systemName = "Genus";
const systemVariant = "DISTRI";
const userRoles = [
  {
    name: "Dashboard",
    child: [{ name: "Dashboard", value: "dashboard" }],
  },
  {
    name: "Account Management",
    child: [
      { name: "User", value: "user" },
      { name: "Roles", value: "roles" },
      { name: "Pending Users", value: "pending" },
    ],
  },
  {
    name: "Masterlist",
    child: [
      {
        name: "Account Title",
        value: "account_title",
      },
      {
        name: "Order Type",
        value: "orderType",
      },
      {
        name: "Customer",
        value: "customer",
      },
      {
        name: "Assets",
        value: "assets",
      },
      {
        name: "Category",
        value: "category",
      },
      {
        name: "Charge of account",
        value: "charging",
      },
      {
        name: "Cutoff",
        value: "cutoff",
      },
      {
        name: "Materials",
        value: "material",
      },
      {
        name: "Uom",
        value: "uom",
      },
      {
        name: "Warehouse",
        value: "warehouse",
      },
    ],
  },
  {
    name: "Ordering",
    child: [
      {
        name: "Auto Approve",
        value: "auto_approve",
      },
      {
        name: "Request",
        value: "request",
      },
      {
        name: "Approver",
        value: "approver",
      },
      {
        name: "Order Taker",
        value: "order_taker",
      },
      {
        name: "Audit",
        value: "audit_serve",
      },
      {
        name: "Order Print",
        value: "printing",
      },
    ],
  },
  {
    name: "Reports",
    child: [{ name: "Generate", value: "generate" }],
  },
];

const exportHeader = [
  {
    name: "Series",
    value: "id",
    source: "order",
  },
  {
    name: "MIR ID",
    value: "id",
    source: "transaction",
  },
  {
    name: "Order No.",
    value: "order_no",
    source: "transaction",
  },
  {
    name: "Date Ordered",
    value: "date_ordered",
    source: "transaction",
    type: "date",
  },
  {
    name: "Date Approved",
    value: "date_approved",
    source: "transaction",
    type: "date",
  },
  {
    name: "Requestor",
    value: "requestor_name",
    source: "transaction",
  },
  // {
  //   name: "Approver",
  //   value: "approver_name",
  //   source: "transaction",
  // },
  // {
  //   name: "Customer Code",
  //   value: "customer_charging_code",
  //   source: "transaction",
  // },
  {
    name: "Customer Name",
    value: "customer_charging_name",
    source: "transaction",
  },
  {
    name: "Charging Code",
    value: "charging_code",
    source: "transaction",
  },
  {
    name: "Charging Name",
    value: "charging_name",
    source: "transaction",
  },
  {
    name: "Material Code",
    value: "material_code",
    source: "order",
  },
  {
    name: "Material Name",
    value: "material_name",
    source: "order",
  },
  {
    name: "Asset Code",
    value: "asset_tag",
    source: "order",
  },
  {
    name: "Category",
    value: "category_name",
    source: "order",
  },
  {
    name: "Uom",
    value: "uom_code",
    source: "order",
  },
  {
    name: "Quantity",
    value: "quantity",
    source: "order",
  },
  {
    name: "Number Served",
    value: "quantity_serve",
    source: "order",
  },
  {
    name: "CIP",
    value: "cip_no",
    source: "transaction",
  },
  {
    name: "Helpdesk No.",
    value: "helpdesk_no",
    source: "transaction",
  },
  {
    name: "Remarks",
    value: "remarks",
    source: "order",
  },
  {
    name: "Rush",
    value: "rush",
    source: "transaction",
  },
  {
    name: "Status",
    value: "status",
    source: "transaction",
  },
];

export { systemName, systemVariant, userRoles, exportHeader };
