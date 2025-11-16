import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="d-flex">
      <div className="d-none d-lg-block">
        <Sidebar />
      </div>
      <div className="flex-grow-1">
        <Header />
        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
