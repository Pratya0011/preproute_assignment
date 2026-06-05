import React from "react";
import { useSelector, UseSelector } from "react-redux";

function Dashboard() {
  const loggedInUserDetails = useSelector(
    (state: any) => state.common.loggedInUserDetails,
  );
  console.log(loggedInUserDetails);
  return <div>Dashboard</div>;
}

export default Dashboard;
