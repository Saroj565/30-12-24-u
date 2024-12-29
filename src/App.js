// App.js
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import Product from "./component/Product";
import ProductShow from "./component/ProductShow";
import ProductDescription from "./component/ProductDescription";
import { useSelector } from "react-redux";
import Navbar from "../src/component/Navbar"; 
import { toast } from "react-toastify";

import CartItem from "./component/CartItem";
import OrderAddress from "./component/OrderAddress";
import Success from "./component/Success";
import Cencel from "./component/Cencel";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    sessionStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    toast.success("Logout successfully completed!", {
      autoClose: 2000,
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000); 
  };

  return (
    <Router>
      <>
        {isLoggedIn && (
          <Navbar
          
            handleLogout={handleLogout} 
          />
        )}

        <div style={{ marginTop: isLoggedIn ? "64px" : "0px" }}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/prduct-show" element={<ProductShow />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product-show" element={<ProductShow />} />
                <Route path="/product-description/:_id" element={<ProductDescription />} />
                <Route path="/cart-item" element={<CartItem />} />
                {/* <Route path="/order-tracker/:_id" element={<OrderAddress />} /> */}
                <Route path="/payment" element={<OrderAddress />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cencel />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
              </>
            )}
          </Routes>
        </div>
      </>
      <ToastContainer />
    </Router>
  );
};

export default App;
