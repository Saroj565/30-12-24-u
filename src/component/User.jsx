import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import "bootstrap/dist/css/bootstrap.min.css";

function User() {
  const [userData, setUserData] = useState({
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
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setUserData((prevState) => ({
      ...prevState,
      country: selectedCountry,
      state: "",
      city: "",
    }));

    const stateList = State.getStatesOfCountry(selectedCountry);
    setStates(stateList);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setUserData((prevState) => ({
      ...prevState,
      state: selectedState,
      city: "",
    }));

    const cityList = City.getCitiesOfState(userData.country, selectedState);
    setCities(cityList);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevState) => ({
        ...prevState,
        profile_image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    // Append profile image to FormData if it exists
    if (userData.profile_image) {
      formData.append("profile_image", userData.profile_image);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/userRouter/userStore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        toast.success("User created successfully");
      } else {
        toast.error("Failed to create user. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the user.");
    }
  };

  return (
    <div className="container ">
      <div className="row">
        <div className="col user mt-3">
          <h2 className=" text-center">
            <strong>Add New User</strong>
          </h2>
          <form onSubmit={handleSubmit} className="row ">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  className="form-control"
                  value={userData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-control"
                  value={userData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  className="form-control"
                  value={userData.country}
                  onChange={handleCountryChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  className="form-control"
                  value={userData.state}
                  onChange={handleStateChange}
                  disabled={!userData.country}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="city"
                  className="form-control"
                  value={userData.city}
                  onChange={handleChange}
                  disabled={!userData.state}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={userData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className="form-control"
                  value={userData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-control"
                  value={userData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="profile_image">Profile Image</label>
                <input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  value={userData.address}
                  onChange={handleChange}
                  required
                  rows="1"
                  cols="1"
                ></textarea>
              </div>
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="user_btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

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
    </div>
  );
}

export default User;
