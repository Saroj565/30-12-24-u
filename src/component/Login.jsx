import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import Person2TwoToneIcon from "@mui/icons-material/Person2TwoTone";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Card,
  CardContent,
  CardHeader,
  Modal,
} from "@mui/material";

// Initial state for reducer
const initialState = {
  action: "Login",
  userName: "",
  email: "",
  password: "",
  address: "",
  pincode: "",
  country: "",
  state: "",
  city: "",
  phone: "",
  dob: "",
  gender: "",
  profile_image: null,
  error: "",
};

// Reducer function to manage state transitions
const reducer = (state, action) => {
  switch (action.type) {
    case "set_action":
      return { ...state, action: action.payload };
    case "set_field":
      return { ...state, [action.field]: action.payload };
    case "set_error":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  // Populate countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  //handle modal open close

  const handleOpne = async () => {
    setOpen(true);
  };
  const handleClose = async () => {
    setOpen(false);
  };

  const handlEmailSubmit = async () => {
    try {
      const response = await axios(
        "http://localhost:5000/api/userRouter/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data) {
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };

  const handlePasswordSubmit = async () => {
    if (newPassword != confirmPassword) {
      toast.error("Password do not match!");
    }

    try {
      const response = await axios(
        "http://localhost:5000/api/userRouter/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        }
      );

      const data = response.json();
      if (data.success) {
        toast.success("Password reset successfully!");
        handleClose();
      } else {
        toast.error("Error resetting password!");
      }
    } catch (error) {
      toast.error("Error resetting password!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if ((file && file.type === "image/jpeg") || file.type === "image/png") {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
      dispatch({
        type: "set_field",
        field: "profile_image",
        payload: file,
      });
    } else {
      toast.error("Please select only PNG and JPG .");
    }
  };

  const handleCountryChange = (countryCode) => {
    dispatch({ type: "set_field", field: "country", payload: countryCode });
    const stateList = State.getStatesOfCountry(countryCode);
    setStates(stateList);
    setCities([]);
    dispatch({ type: "set_field", field: "state", payload: "" });
    dispatch({ type: "set_field", field: "city", payload: "" });
  };

  const handleStateChange = (stateCode) => {
    const selectedCountryCode = state.country;
    dispatch({ type: "set_field", field: "state", payload: stateCode });
    const cityList = City.getCitiesOfState(selectedCountryCode, stateCode);
    setCities(cityList);
    dispatch({ type: "set_field", field: "city", payload: "" });
  };

  const handleAction = async (e) => {
    e.preventDefault();
    dispatch({ type: "set_error", payload: "" });

    try {
      if (state.action === "Signup") {
        const formData = new FormData();
        Object.entries(state).forEach(([key, value]) => {
          if (key !== "action" && key !== "error") {
            formData.append(key, value);
          }
        });

        const response = await axios.post(
          "http://localhost:5000/api/userRouter/userStore",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.success) {
          toast.success("Signup successfully.");
          dispatch({ type: "set_action", payload: "Login" });
        } else {
          toast.error(response.data.message || "Signup failed.");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/userRouter/userLogin",
          {
            email: state.email,
            password: state.password,
            pincode:state.pincode,
            country:state.country,
            state:state.state,
          }
        );

        if (response.data.success) {
          toast.success("Login successful!", {
            position: "top-center",
            autoClose: 1000,
            onClose: () => {
              sessionStorage.setItem("isLoggedIn", "true");
              sessionStorage.setItem("formData", JSON.stringify(response.data));

              navigate("/product-show");
              window.location.reload();
            },
          });
        } else {
          toast.error(response.data.message || "Login failed.", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data;

        if (
          serverError.error &&
          serverError.error.includes("validation failed")
        ) {
          toast.error("All fields are required.", {
            position: "top-right",
            autoClose: 2000,
          });
        } else {
          toast.error(
            serverError.message || "An error occurred on the server.",
            {
              position: "top-right",
              autoClose: 2000,
            }
          );
        }
      } else if (error.request) {
        toast.error("No response from the server. Please try again later.", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error(error.message || "An unexpected error occurred.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card>
        <CardHeader
          title={state.action === "Login" ? "Login" : "Signup"}
          titleTypographyProps={{
            variant: "h5",
            align: "center",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          {state.action === "Signup" && (
            <>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={2}
                  lg={12}
                  style={{ textAlign: "center" }}
                >
                  <input
                    type="file"
                    accept="image/jpeg image/png"
                    id="profile-image-input"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />

                  <label htmlFor="profile-image-input">
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: selectedImage
                          ? `url(${selectedImage}) center/cover no-repeat`
                          : "<Person2TwoToneIcon />",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        // border: "1px solid #",
                      }}
                    >
                      {!selectedImage && (
                        <Person2TwoToneIcon
                          style={{ fontSize: "40px", color: "#aaa" }}
                        />
                      )}
                    </div>
                  </label>
                  {/* <TextField
                    label="Profile Image URL"
                    fullWidth
                    value={selectedImage || ""}
                    style={{ marginTop: "16px" }}
                    disabled
                  /> */}
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <TextField
                    label="Username"
                    fullWidth
                    value={state.userName}
                    required
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        field: "userName",
                        payload: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <TextField
                    label="Villege"
                    fullWidth
                    value={state.address}
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        field: "address",
                        payload: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    value={state.phone}
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        field: "phone",
                        payload: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={state.dob}
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        field: "dob",
                        payload: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <TextField
                    label="Pincode"
                    fullWidth
                    value={state.pincode}
                    onChange={(e) =>
                      dispatch({
                        type: "set_field",
                        field: "pincode",
                        payload: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={2} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={state.gender}
                      onChange={(e) =>
                        dispatch({
                          type: "set_field",
                          field: "gender",
                          payload: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={state.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      <MenuItem value="">Select Country</MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                      value={state.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      <MenuItem value="">Select State</MenuItem>
                      {states.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={2} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                      value={state.city}
                      onChange={(e) =>
                        dispatch({
                          type: "set_field",
                          field: "city",
                          payload: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">Select City</MenuItem>
                      {cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: "set_field",
                    field: "email",
                    payload: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: "set_field",
                    field: "password",
                    payload: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            sx={{
              mt: 2,
              color: "#FFF !important",
              width: "50%",
              background: "#F3714E",
            }}
            onClick={handleAction}
          >
            {state.action === "Login" ? "Login" : "Signup"}
          </Button>
          <Button sx={{ mt: 2, ml: 5 }} onClick={handleOpne}>
            {state.action == "Login" ? (
              <a sx={{ color: "blue !important" }}>Forgot Password?</a>
            ) : (
              ""
            )}
          </Button>
          {state.action == "Login" ? (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  p: 4,
                  boxShadow: 24,
                  width: 500,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  id="forgot-password"
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  {step === 1 ? "Forgot Password" : "Reset Your Password"}
                </Typography>
                <Typography
                  id="forgot-password-modal-description"
                  sx={{ mt: 2 }}
                >
                  {step === 1
                    ? " Enter your email address to reset your password."
                    : "Enter your new password and confirm password."}
                </Typography>

                {step === 1 ? (
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mt: 2 }}
                    required
                  />
                ) : (
                  <>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      sx={{ mt: 2 }}
                      required
                    />
                    <TextField
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ mt: 2 }}
                      required
                    />
                  </>
                )}

                <Button
                  variant="contained"
                  sx={{ mt: 2, background: "#F3714E" }}
                  fullWidth
                  onClick={step===1?handlEmailSubmit:handlePasswordSubmit}
                >
                  {step===1?"Send":"Reset Password"}
                </Button>
              </Box>
            </Modal>
          ) : (
            ""
          )}

          <Box textAlign="center" sx={{ mt: 2 }}>
            {state.action === "Login" ? (
              <Typography>
                Don&apos;t have an account?{" "}
                <Button
                  sx={{ color: "blue !important" }}
                  onClick={() =>
                    dispatch({ type: "set_action", payload: "Signup" })
                  }
                >
                  Signup
                </Button>
              </Typography>
            ) : (
              <Typography>
                Already have an account?{" "}
                <Button
                  sx={{ color: "blue !important" }}
                  onClick={() =>
                    dispatch({ type: "set_action", payload: "Login" })
                  }
                >
                  Login
                </Button>
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <ToastContainer />
    </Container>
  );
};

export default Login;
