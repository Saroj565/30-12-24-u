import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Snackbar,
  Button,
} from "@mui/material";
import { Alert } from "@mui/material"; // Update import to MUI v5
import { useNavigate } from "react-router-dom";
function Success() {
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate=useNavigate()

  useEffect(() => {
   
    setTimeout(() => {
      setLoading(false);
      setOpenSnackbar(true); 
    }, 2000);
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const goBack=()=>{
    navigate('/product-show')
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", paddingTop: "50px" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* <Grid item xs={12} className="fadeIn">
            <Typography variant="h4" color="primary" gutterBottom>
              Payment Successful!
            </Typography>
          </Grid> */}
          <img
            src="/success.gif"
            alt="Success"
            style={{
              width: "100%", // Adjust width
              maxWidth: "400px", // Set a maximum width
              height: "auto", // Maintain aspect ratio
              display: "block", // Center in container
              margin: "0 auto", // Center horizontally
            }}
          />
          <Grid item xs={12} className="fadeIn">
            <Typography variant="h6" color="textSecondary">
              Your payment has been successfully processed.
            </Typography>
          </Grid>
          <Grid item xs={12} className="fadeIn">
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={() => {
                goBack();
              }}
            >
              Go to Home
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Snackbar for success message
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Payment has been successfully completed!
        </Alert>
      </Snackbar> */}
    </Container>
  );
}

export default Success;
