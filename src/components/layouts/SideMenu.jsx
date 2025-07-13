import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  // console.log("uuuu", user);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 ">
      <div className="flex justify-center pt-5">
        <button
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-default text-gray-950 font-medium leading-6`}
          disabled
        >
          <span className="text-xl opacity-0">•</span>{" "}
          {/* Empty icon space for alignment */}
          Overview
        </button>
      </div>
      {sideMenuData?.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] 
        ${
          activeMenu == item.label
            ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
            : ""
        } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" /> {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
