import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Box, IconButton, Tooltip } from "@mui/material";
import * as MuiIcons from "@mui/icons-material"; // ✅ Import all MUI icons dynamically
import { navlinks } from "../constants";
import { logo } from "../assets";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("Dashboard");
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "sticky",
        top: "5px",
        height: "93vh",
        backgroundColor: isDarkMode ? "#1c1c24" : "#ffffff",
        padding: "16px",
        borderRadius: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <Link to="/">
        <IconButton sx={{ width: 56, height: 56, bgcolor: isDarkMode ? "#2c2f32" : "#fff", borderRadius: "12px", boxShadow: 2 }}>
          <img src={logo} alt="Logo" style={{ width: "50%", height: "50%" }} />
        </IconButton>
      </Link>

      {/* Navigation Icons */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 3, marginTop: "24px" }}>
        {navlinks.map((link) => {
          const IconComponent = MuiIcons[link.imgUrl]; // ✅ Dynamically map icon name to MUI component

          return (
            <Tooltip key={link.name} title={link.name} placement="right" arrow>
              <IconButton
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  color: isActive === link.name ? "#fff" : "#ccc",
                  backgroundColor: isActive === link.name ? "#1dc071" : "transparent",
                  "&:hover": { backgroundColor: "#00e6e6", transform: "scale(1.1)" },
                }}
                onClick={() => {
                  setIsActive(link.name);
                  navigate(link.link);
                }}
              >
                {IconComponent && <IconComponent fontSize="large" />} {/* ✅ Renders the MUI icon dynamically */}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
