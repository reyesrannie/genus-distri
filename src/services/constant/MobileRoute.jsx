import React from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Dashboard from "../../screen/dashboard/Dashboard";
import MasterList from "../../screen/masterlist/MasterList";
import UserManagement from "../../screen/user/UserManagement";

const MobileRoute = () => {
  const mobileRoutes = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      route: "/",
      element: <Dashboard />,
    },
    {
      label: "Accounts",
      icon: <RecentActorsOutlinedIcon />,
      route: "/accounts",
      element: <UserManagement />,
    },
    {
      label: "Masterlist",
      icon: <BallotOutlinedIcon />,
      route: "/masterlist",
      element: <MasterList />,
    },
    {
      label: "Ordering",
      icon: <AddShoppingCartOutlinedIcon />,
      route: "/ordering",
    },
    // {
    //   label: "Approval",
    //   icon: <ApprovalOutlinedIcon />,
    //   route: "/approval",
    // },
    {
      label: "Reports",
      icon: <AssessmentOutlinedIcon />,
      route: "/reports",
    },
  ];

  return { mobileRoutes };
};

export default MobileRoute;
