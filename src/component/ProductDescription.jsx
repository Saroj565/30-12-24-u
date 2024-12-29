
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, CardMedia, Button, Grid, Box, Container } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import { toast } from "react-toastify";

function ProductDescription() {
  const { _id } = useParams();
  // console.log("skm",_id);
const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productRouter/productFind/${_id}`
        );
        const product = response.data.product;
        setProducts(product ? [product] : []);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch product details. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading products...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (products.length === 0) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        No product found.
      </Typography>
    );
  }

 
  const user_id = JSON.parse(sessionStorage.getItem("formData"));
  console.log("user_id",user_id.data._id);
 const addToCart = async (e) => {
   e.preventDefault();

   if (!user_id || !user_id.data) {
     toast.error("User not logged in.");
     return;
   }

   setIsSubmitting(true);

   try {
     const payload = {
       quantity:1, // Default to 1 if stock is undefined
       userId: user_id.data._id,
       productId: _id,
     };

     const response = await axios.post(
       "http://localhost:5000/api/cartRouter/cartitem",
       payload,
       {
         headers: { "Content-Type": "application/json" },
       }
     );

     const successMessage =
       response.status === 201
         ? "Item added successfully!"
         : response.data.message;

     toast.success(successMessage);
    //  setTimeout(()=>{
    //   window.location.reload(true);
    //  },2000)
   } catch (error) {
     console.error("Add to Cart Error:", error);
     toast.error("Failed to add item. Please try again.");
   } finally {
     setIsSubmitting(false);
   }
 };

 const handleBuyButton = (productId) => {
  navigate(`/order-tracker/${productId}`);
};


  return (
    <Container sx={{ p: 3 }}>
      {products.map((product) => (
        <Grid container spacing={2} key={product._id}>
          {/* Left Section: Image */}
          <Grid item xs={12} md={4} lg={6}>
            <Box>
              <CardMedia
                component="img"
                image={`http://localhost:5000/${product.p_image_url}`}
                alt={product.p_name}
                sx={{
                  objectFit: "contain",
                  minWidth: "500px",
                  maxHeight: "500px",
                }}
              />
              <Box sx={{ mt: 3, display: "flex", gap: "10px", width: "100%" }}>
                <Button
                  sx={{
                    mb: 2,
                    background: "#FF9F00",
                    width: "49%",
                    height: "50px",
                    color: "#fff !important",
                    fontWeight: "bold",
                    gap: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={addToCart}
                  disabled={isSubmitting}
                >
                  <ShoppingCartIcon />
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mb: 2,
                    background: "#FB641B",
                    width: "49%",
                    height: "50px",
                    color: "#fff !important",
                    fontWeight: "bold",
                    gap: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}

                  onClick={()=>{handleBuyButton(product._id)}}
                >
                  <PaymentIcon />
                  BUY NOW
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Section: Product Details */}
          <Grid item xs={12} md={8} lg={6}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.p_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {product.p_description}
              </Typography>
              <Typography
                variant="h5"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                ₹{product.p_price}{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    ml: 1,
                    color: "text.secondary",
                  }}
                >
                  ₹4,499
                </Typography>{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: "green", ml: 1 }}
                >
                  55% off
                </Typography>
              </Typography>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Available Offers
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • 10% off up to ₹750 on HDFC Bank Credit Card EMI on 3 months
                  tenure. Min. Txn Value: ₹5000
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • No Cost EMI on Bajaj Finserv EMI Card on cart value above
                  ₹2999
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Container>
  );
}

export default ProductDescription;



