import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  //new
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const defaultImage =
    "https://www.freepik.com/free-vector/businessman-character-avatar-isolated_6769264.htm#fromView=keyword&page=1&position=4&uuid=c7f6f4d2-b573-45e8-98d0-a39c3591acfa&query=Default+User";

  const navbarNameClickHandler = () => {
    // navigate("/user/dashboard");
    window.location.reload();
  };

  const showUserModalHandler = () => {
    navigate("/user/profile");
  };
  return (
    <div className="bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="block lg:hidden text-black"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>
          <h2 className="text-lg font-medium text-black">Assignado</h2>
          <div className="max-[400px]:hidden md:block ">
            {user?.role === "admin" ? (
              <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
                Admin
              </div>
            ) : (
              <div
                className="text-[10px] font-medium text-black px-3 py-1 rounded mt-1 hover:bg-gray-200 cursor-pointer"
                onClick={navbarNameClickHandler}
              >
                {user?.name || ""}
              </div>
            )}
          </div>
        </div>

        {/* max-[400px]:hidden md:block */}
        <div className="max-[250px]:hidden md:block">
          <img
            src={user?.profileImageUrl || defaultImage}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover bg-slate-400"
            onClick={showUserModalHandler}
          />
        </div>
      </div>
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
