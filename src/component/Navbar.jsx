import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  

  // Use the UserContext correctly
  const { totalQuantity } = useContext(UserContext);

  // Extract totalQuantity from the array
  const totalItems =
    Array.isArray(totalQuantity) && totalQuantity.length > 0
      ? totalQuantity[0].totalQuantity
      : 0;

  const links = [
    { name: "Add Product", to: "/product" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { name: "All Product", to: "/product-show" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    toast.success("Logout successfully complete.", {
      position: "top-center",
      autoClose: 1000,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const name = JSON.parse(sessionStorage.getItem("formData"));

  return (
    <AppBar position="fixed" sx={{ background: "#131921" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="/shopping.png"
            alt="Logo"
            style={{ height: "40px", marginRight: "16px" }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#FFF" }}
          >
            Shopping Cart
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                lineHeight: "50px",
                textDecoration: "none",
                padding: "6px 12px",
                fontWeight: "bold",
                color: "#FFF",
                transition: "border-bottom 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderBottom = "2px solid #FFFFFF")
              }
              onMouseLeave={(e) =>
                (e.target.style.borderBottom = "2px solid transparent")
              }
            >
              {link.name}
            </Link>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: "4px",
              px: 2,
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              sx={{ ml: 1, flex: 1 }}
            />
          </Box>

          <Badge badgeContent={totalItems} color="secondary">
            <Link to="/cart-item">
              <ShoppingCartIcon
                style={{ color: "#9C27B0", cursor: "pointer" }}
              />
            </Link>
          </Badge>

          <IconButton
            color="#9C27B0"
            onClick={handleMenuOpen}
            size="large"
            edge="end"
            aria-label="user account"
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            <AccountCircle sx={{ color: "green" }} />
            <Typography variant="body1" sx={{ ml: 1, color: "green" }}>
              {name?.data?.userName || "Guest"}
            </Typography>
            <ArrowDropDownIcon sx={{ color: "green" }} />
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
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      <ToastContainer />
    </AppBar>
  );
};

export default Navbar;
