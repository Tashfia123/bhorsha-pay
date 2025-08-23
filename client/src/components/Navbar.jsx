import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { logo, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";
import { ThemeToggle } from "./index";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  
  // Check if user is logged in using AuthContext
  const isAuthenticated = !!user;

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`); // Navigate to search results page
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  const handleShowWelcome = () => {
    if (window.showWelcomePopup) {
      window.showWelcomePopup();
    }
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className={`lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-white border border-gray-200'} rounded-[100px]`}>
        <input
          type="text"
          placeholder="Search for campaigns"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] ${isDarkMode ? 'text-white' : 'text-gray-700'} bg-transparent outline-none`}
        />
        <div
          className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer"
          onClick={handleSearch}
        >
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="sm:flex hidden flex-row justify-end gap-4 items-center">
        <ThemeToggle />
        
        <button
          onClick={handleShowWelcome}
          className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200`}
          title="Welcome Guide"
        >
          <FaInfoCircle size={16} />
        </button>

        <button
          onClick={() => (address ? navigate("create-campaign") : connect())}
          className={`${
            address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"
          } text-white px-4 py-2 rounded-[10px] font-epilogue font-medium`}
        >
          {address ? "Create a campaign" : "Connect"}
        </button>

        {/* Show Login/Register or Logout based on auth state */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-[#ff4d4d] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-[#6a5acd] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-[#4acd8d] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium">
                Register
              </button>
            </Link>
          </>
        )}

        <Link to="/profile">
          <div className={`w-[52px] h-[52px] rounded-full ${isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-200'} flex justify-center items-center cursor-pointer`}>
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4 gap-4">
            <button
              onClick={() =>
                address ? navigate("create-campaign") : connect()
              }
              className={`${
                address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"
              } text-white px-4 py-2 rounded-[10px] font-epilogue font-medium`}
            >
              {address ? "Create a campaign" : "Connect"}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-[#ff4d4d] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-[#6a5acd] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium">
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-[#4acd8d] text-white px-4 py-2 rounded-[10px] font-epilogue font-medium">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
