import React from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import ScaleIcon from "@mui/icons-material/Scale";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import Dashboard from "../../screen/dashboard/Dashboard";
import MasterList from "../../screen/masterlist/MasterList";
import UserAccounts from "../../screen/user/UserAccounts";
import AccountTitle from "../../screen/masterlist/account_titles/AccountTitle";
import ChargeOfAccounts from "../../screen/masterlist/charging/ChargeOfAccounts";
import UserManagement from "../../screen/user/UserManagement";
import UserRoles from "../../screen/user/UserRoles";
import Category from "../../screen/masterlist/category/Category";
import Uom from "../../screen/masterlist/uom/Uom";
import Materials from "../../screen/masterlist/materials/Materials";
import Warehouse from "../../screen/masterlist/warehouse/Warehouse";
import Assets from "../../screen/masterlist/assets/Assets";
import ApprovalSetup from "../../screen/masterlist/approval_setup/ApprovalSetup";
import Ordering from "../../screen/ordering/Ordering";
import CutOff from "../../screen/masterlist/cutoff/CutOff";
import Approver from "../../screen/approver/Approver";
import OrderTaker from "../../screen/order_taker/OrderTaker";
import OrderType from "../../screen/masterlist/orderType/OrderType";
import Customer from "../../screen/masterlist/customer/Customer";
import PendingAccounts from "../../screen/user/PendingAccounts";

const SystemNavigation = () => {
  const navigation = [
    {
      segment: "",
      title: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      route: "/",
      element: <Dashboard />,
      permission: ["dashboard"],
    },
    {
      segment: "account",
      title: "Accounts",
      icon: <RecentActorsOutlinedIcon />,
      route: "/account",
      element: <UserManagement />,
      permission: ["user", "role"],
      children: [
        {
          segment: "user",
          title: "User Accounts",
          icon: <SupervisorAccountOutlinedIcon />,
          element: <UserAccounts />,
          route: "/account/user",
          permission: ["user"],
        },
        {
          segment: "role",
          title: "User Roles",
          icon: <BadgeOutlinedIcon />,
          element: <UserRoles />,
          route: "/account/role",
          permission: ["user"],
        },
        {
          segment: "pending",
          title: "Pending Accounts",
          icon: <BadgeOutlinedIcon />,
          element: <PendingAccounts />,
          route: "/account/pending",
          permission: ["pending"],
        },
      ],
    },
    {
      segment: "masterlist",
      title: "Masterlist",
      icon: <BallotOutlinedIcon />,
      route: "/masterlist",
      element: <MasterList />,
      permission: [
        "account_title",
        "approver_setup",
        "assets",
        "category",
        "charging",
        "cutoff",
        "material",
        "uom",
        "warehouse",
        "orderType",
      ],
      children: [
        // {
        //   segment: "account_title",
        //   title: "Account Title",
        //   icon: <TitleOutlinedIcon />,
        //   element: <AccountTitle />,
        //   route: "/masterlist/account_title",
        //   permission: ["account_title"],
        // },
        // {
        //   segment: "approval_setup",
        //   title: "Approval Setup",
        //   icon: <HowToRegOutlinedIcon />,
        //   element: <ApprovalSetup />,
        //   route: "/masterlist/approval_setup",
        //   permission: ["approver_setup"],
        // },
        {
          segment: "orderType",
          title: "Order Type",
          icon: <HubOutlinedIcon />,
          element: <OrderType />,
          route: "/masterlist/orderType",
          permission: ["orderType"],
        },
        {
          segment: "customer",
          title: "Customer",
          icon: <SupportAgentOutlinedIcon />,
          element: <Customer />,
          route: "/masterlist/customer",
          permission: ["customer"],
        },
        {
          segment: "assets",
          title: "Assets",
          icon: <LocalOfferOutlinedIcon />,
          element: <Assets />,
          route: "/masterlist/assets",
          permission: ["assets"],
        },
        {
          segment: "category",
          title: "Category",
          icon: <ScatterPlotIcon />,
          element: <Category />,
          route: "/masterlist/category",
          permission: ["category"],
        },
        {
          segment: "charge_of_accounts",
          title: "Charge of Accounts",
          icon: <CreditCardOutlinedIcon />,
          element: <ChargeOfAccounts />,
          route: "/masterlist/charge_of_accounts",
          permission: ["charging"], // "Charge of account" maps to "charging"
        },
        {
          segment: "cutoff",
          title: "Cutoff",
          icon: <TimerOffOutlinedIcon />,
          element: <CutOff />,
          route: "/masterlist/cutoff",
          permission: ["cutoff"],
        },
        {
          segment: "materials",
          title: "Materials",
          icon: <HomeRepairServiceOutlinedIcon />,
          element: <Materials />,
          route: "/masterlist/materials",
          permission: ["material"],
        },
        {
          segment: "uom",
          title: "Uom",
          icon: <ScaleIcon />,
          element: <Uom />,
          route: "/masterlist/uom",
          permission: ["uom"],
        },
        {
          segment: "warehouse",
          title: "Warehouse",
          icon: <WarehouseOutlinedIcon />,
          element: <Warehouse />,
          route: "/masterlist/warehouse",
          permission: ["warehouse"],
        },
      ],
    },

    {
      segment: "ordering",
      title: "Ordering",
      icon: <AddShoppingCartOutlinedIcon />,
      element: <Ordering />,
      route: "/ordering",
      permission: ["request"],
    },
    // {
    //   segment: "approval",
    //   title: "Approval",
    //   icon: <ApprovalOutlinedIcon />,
    //   element: <Approver />,
    //   route: "/approval",
    //   permission: ["approver"],
    // },
    {
      segment: "order_taker",
      title: "Order Taker",
      icon: <PointOfSaleOutlinedIcon />,
      element: <OrderTaker />,
      route: "/order_taker",
      permission: ["order_taker", "audit_serve"],
    },
    {
      segment: "reports",
      title: "Reports",
      icon: <AssessmentOutlinedIcon />,
      route: "/reports",
    },
  ];
  return { navigation };
};

export default SystemNavigation;
