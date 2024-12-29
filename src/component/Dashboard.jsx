import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../../src/index.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Product from "../component/Product";
import User from "../component/User";
import ProductShow from "./ProductShow";
import ProductDescription from "./ProductDescription";
import { UserContext } from "../context/UserContext";

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] =
    useState("ProductListImage");
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarSrc] = useState("/images/Group 11.png");
  const navigate = useNavigate();
  const user_id = useContext(UserContext);
  console.log("Dashboard", user_id);

  const formData = JSON.parse(sessionStorage.getItem("formData")) || {};
  const user = formData?.data || {};

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    toast.success("Logout successfully completed.", {
      position: "top-center",
      autoClose: 1000,
    });

    setTimeout(() => {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("formData");
      navigate("/login");
      window.location.reload();
    }, 1000);
  };

  const handleImageClick = (component) => {
    setSelectedComponent(component);
  };

  const Search = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: "5px 10px",
    borderRadius: "4px",
    width: "200px",
  }));

  const renderComponent = () => {
    switch (selectedComponent) {
      case "ProductListImage":
        return <ProductShow />;
      case "User":
        return <User />;
      case "ProductShow":
        return <Product />;
      case "ProductDescription":
        return <ProductDescription />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Navbar */}
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <img
              src="logo192.png"
              alt="Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
          </Box>

          <Search>
            <SearchIcon />
            <InputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              sx={{ ml: 1, flex: 1 }}
            />
          </Search>

          <Box display="flex" alignItems="center" ml={2}>
            <IconButton color="inherit">
              <ShoppingCartIcon sx={{ mr: 3 }} />
            </IconButton>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onMouseLeave={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <IconButton
              color="inherit"
              onMouseEnter={handleMenuOpen}
              size="large"
              edge="end"
              aria-label="user account"
              aria-controls="user-menu"
              aria-haspopup="true"
            >
              {" "}
              <AccountCircle />
              <Typography variant="body1" color="green" sx={{ ml: 1 }}>
                {user.userName || "Guest"}
              </Typography>
              <ArrowDropDownIcon className="ArrowDropDownIcon" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        sx={{
          width: "200px",
          backgroundColor: "#f8f9fa",
          height: "100%",
          pt: "64px",
          position: "fixed",
          overflow: "auto",
        }}
      >
        <MenuItem onClick={() => handleImageClick("ProductListImage")}>
          Product Show
        </MenuItem>
        <MenuItem onClick={() => handleImageClick("User")}>
          User Management
        </MenuItem>
        <MenuItem onClick={() => handleImageClick("ProductShow")}>
          Add Product
        </MenuItem>
        <MenuItem onClick={() => handleImageClick("ProductDescription")}>
          Product Description
        </MenuItem>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: "200px",
          mt: "64px",
          overflowY: "auto",
          p: 3,
        }}
      >
        {renderComponent()}
      </Box>

      <ToastContainer position="top-center" />
    </Box>
  );
};

export default Dashboard;
