import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  CardMedia,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { loadStripe } from "@stripe/stripe-js";
function CartItem() {
  const { setCartItem, setTotalSum, setTotalQuantity, cartItem, totalSum } =
    useContext(UserContext);

    // console.log("lala", totalSum);
    console.log("cart", cartItem);

  const navigate = useNavigate(); 

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("formData"));
    const userIdValue = userId.data._id;

    const fetchCartData = async () => {
      try {
        const [cartResponse, totalPriceResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/cartRouter/getcartitem/${userIdValue}`
          ),
          axios.get(
            `http://localhost:5000/api/cartRouter/total-price/${userIdValue}`
          ),
        ]);

        setCartItem(cartResponse.data.result);
        setTotalSum(totalPriceResponse.data.result);
        setTotalQuantity(totalPriceResponse.data.result);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleItemDelete = async (_id, index) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cartRouter/cartitem-remove/${_id}`
      );

      if (response.status === 200) {
        toast.success("Item deleted successfully");
        setCartItem((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      toast.error("Failed to delete the item.");
      console.error(error);
    }
  };

  const handleQuantityChange = async (item, increase = true) => {
    try {
      const userId = JSON.parse(sessionStorage.getItem("formData")).data._id;
      const newQuantity = item.quantity + (increase ? 1 : -1);

      if (newQuantity < 1) {
        toast.error("Quantity cannot be less than 1.");
        return;
      }

      if (newQuantity > item.p_stock) {
        toast.error("Cannot add more than available stock.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/cartRouter/quantity-update`,
        {
          userId,
          productId: item.productId,
          newQuantity,
        }
      );

      if (response.status === 200) {
        setCartItem((prev) =>
          prev.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        );
        toast.success("Quantity added successfully.");
       setTimeout(()=>{
         window.location.reload();
       },1000)
      }
    } catch (error) {
      console.error(error);
      toast.error("Out of stock.");
    }
  };

  //payment gateway
  const makePayement =async () => {
   const stripe = await loadStripe(
     "pk_test_51QaWW8K8UN6KZNxY1k1GUe4h2O7kHk4OCb2BahNinoEMsOS8tPyzIvXY2er7lNxsFgAtytbPRUH66oOhk9w0TsY100GpOiGF4r"
   );
   const body = {
     products: cartItem,
     orderDetails: totalSum,
   };
   const headers={
    "Content-Type":"Application/json"
   }

   const response = await fetch(
     "http://localhost:5000/api/payment/create-checkout-session",{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
     }
   );

   const session=await response.json();

   const result=stripe.redirectToCheckout({
    sessionId:session.id
   });

   if(result.error){
    console.log(result.error);
   }
    // navigate("/payment", { state: orderDetails }); 
  };

  return (
    <Container sx={{ p: 3 }}>
      {cartItem.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            component="img"
            src="\1800917.webp"
            alt="Empty Cart"
            sx={{
              mt: 5,
              width: "50%",
              height: "auto",
            }}
          />
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Cart is empty. Start adding items!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {cartItem.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  p: 2,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={`http://localhost:5000/${item.p_image_url}`}
                  alt={item.p_name}
                  sx={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6">{item.p_name}</Typography>
                  <Typography>
                    Price : ₹{item.quantity * item.p_price}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      onClick={() => handleQuantityChange(item, false)}
                      sx={{ minWidth: "30px" }}
                    >
                      <RemoveCircleIcon />
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button
                      onClick={() => handleQuantityChange(item, true)}
                      sx={{ minWidth: "30px" }}
                    >
                      <AddCircleIcon />
                    </Button>
                  </Box>
                </Box>
                <DeleteIcon
                  onClick={() => handleItemDelete(item._id, index)}
                  sx={{ color: "red", fontSize: "30px" }}
                />
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Price Details</Typography>
              {totalSum.map((item, index) => (
                <React.Fragment key={index}>
                  <Typography>Total: ₹{item.allTotalPrice}</Typography>
                </React.Fragment>
              ))}
              <Button
                variant="contained"
                onClick={makePayement}
                sx={{ mt: 2, width: "100%", backgroundColor: "#FB641B" }}
              >
                PLACE ORDER
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartItem;
