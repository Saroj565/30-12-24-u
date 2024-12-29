import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Radio,
  TextField,
  Container,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderAddress() {
  const { _id } = useParams();
  const [products, setProducts] = useState([]);

  console.log("pro", products);

  const session = JSON.parse(sessionStorage.getItem("formData"));
  console.log(session.data.userName);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productRouter/productFind/${_id}`
        );
        const product = response.data.product;
        setProducts(product ? [product] : []);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchProduct();
  }, [_id]);

  // Access the first product directly
  const product = products.length > 0 ? products[0] : null;

  return (
    <Container sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Left Section: Cart Items */}
        <Grid item xs={12} md={8}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                border: "1px solid #e0e0e0",
                background: "#2874F0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    gap: 1,
                    ml: 1,
                  }}
                >
                  DELIVERY ADDRESS
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Radio
                    sx={{
                      color: "#131921",
                      "&.Mui-checked": { color: "#131921" },
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <span>
                      {session.data.userName} | {session.data.phone}
                    </span>
                    <span>
                      {"Vill-"} {session.data.address}, {"Country-"}
                      {session.data.country}, {"State-"}
                      {session.data.state}, {"City-"}
                      {session.data.city} {" ("} {session.data.pincode} {")"}
                    </span>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Order Summary Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                border: "1px solid #e0e0e0",
                background: "#2874F0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    gap: 1,
                    ml: 1,
                  }}
                >
                  ORDER SUMMARY
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                mb: 2,
              }}
            >
              {product ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      p: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                   <Box>
                   <Box
                      sx={{
                        width: "150px",
                        height: "150px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`http://localhost:5000/${product.p_image_url}`}
                        alt={product.p_name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                     
                    </Box>
                    <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Button
                          sx={{ minWidth: "30px" }}
                          // onClick={() => {
                          //   handleDecreaseQuantity(item);
                          // }}
                        >
                          <RemoveCircleIcon sx={{ color: "#FF4500" }} />
                        </Button>
                        <Typography
                          sx={{
                            padding: "4px 8px",
                            textAlign: "center",
                            minWidth: "40px",
                            borderRadius: "5px",
                            backgroundColor: "#F0F8FF",
                            color: "#131921",
                          }}
                        >
                          {/* {item.quantity} */}
                        </Typography>
                        <Button
                          sx={{ minWidth: "30px" }}
                          // onClick={() => {
                          //   handleIncreaseQuantity(item);
                          // }}
                        >
                          <AddCircleIcon color="success" />
                        </Button>
                      </Box>
                   </Box>

                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6">{product.p_name}</Typography>
                      <Typography
                        color="textSecondary"
                        sx={{ fontSize: "18px" }}
                      >
                        {product.p_description}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{ fontSize: "18px" }}
                      >
                        Price: ₹{product.p_price}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography>No product available</Typography>
              )}
            </Box>

            {/* Order Place Button */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "#fff",
                p: 2,
                boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                {"Order confirmation email will be sent to "}
                {session.data.email}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  height: "50px",
                  fontWeight: "bold",
                  background: "#FB641B",
                  width: "30%",
                }}
              >
                CONTINUE
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                border: "1px solid #e0e0e0",
                background: "#2874F0",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    gap: 1,
                    ml: 1,
                  }}
                >
                  PAYMENT OPTION
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Section: Price Details */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            position: "sticky",
            top: "50px",
            alignSelf: "flex-start",
          }}
        >
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              PRICE DETAILS
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {product && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>Price(item 1)</Typography>
                <Typography>₹{product.p_price}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
            {product && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <Typography>Total</Typography>
                <Typography>₹{product.p_price}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderAddress;
