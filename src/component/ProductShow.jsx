import React, { createContext, useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableViews from "react-swipeable-views";
import {
  Typography,
  Button,
  Grid,
  Container,
  IconButton,
  Box,
  InputBase,
  MobileStepper,
  Link,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";


// Styled expand button for collapsible section
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:active": {
    transform: "rotate(180deg)",
  },
}));

export default function ProductShow() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [activeStep, setActiveStep] = useState(0);
  const { user_id, setUserId } = useContext(UserContext);

  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/productRouter/productGet"
        );
        console.log(response);

        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch product data. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
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
  const handleViewClick = (productId) => {
    navigate(`/product-description/${productId}`);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {products.length === 0 ? (
          <Box
            component="img"
            src="\1800917.webp"
            alt="Example Image"
            sx={{
              mt: 5,
              width: "50%",
              height: "auto",
            }}
          />
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={3} mt={2}>
              <Card sx={{ maxWidth: 300 }}>
              <Box
                      sx={{
                        width: "100%",
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
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {product.p_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      Price: ₹{product.p_price}
                    </Typography>
                    {/* <Button> */}

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleViewClick(product._id)}
                    >
                      View More
                    </Button>

                    {/* </Button> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
