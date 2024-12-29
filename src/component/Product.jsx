import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";

function Product() {
  const [product, setProduct] = useState({
    p_name: "",
    p_description: "",
    p_price: "",
    p_stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("p_name", product.p_name);
      formData.append("p_description", product.p_description);
      formData.append("p_price", product.p_price);
      formData.append("p_stock", product.p_stock);
      formData.append("p_image_url", image);

      const response = await axios.post(
        "http://localhost:5000/api/productRouter/productStore",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product added successfully!");
      setProduct({
        p_name: "",
        p_description: "",
        p_price: "",
        p_stock: "",
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product.");
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Add Product
      </Typography>

      <Box sx={{ mb: 3,  }}>
       {preview!=null ?  <img
          alt="Product Preview"
          src={preview}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />:''}
      </Box>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Product Name"
              name="p_name"
              value={product.p_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Product Price */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Product Price (RS)"
              name="p_price"
              type="number"
              value={product.p_price}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                required
              />
            </Button>
          </Grid>

          {/* Product Stock */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Product Stock"
              name="p_stock"
              type="number"
              value={product.p_stock}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Product Description */}
          <Grid item xs={12}>
            <TextField
              label="Product Description"
              name="p_description"
              value={product.p_description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#FF4500", height: "50px", fontWeight: "bold" }}
              fullWidth
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer
        position="top-center"
        style={{
          width: "80%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          flexWrap: "nowrap",
        }}
        toastStyle={{
          width: "auto",
          margin: "5px",
        }}
        newestOnTop={false}
        closeButton={false}
      />
    </Box>
  );
}

export default Product;
