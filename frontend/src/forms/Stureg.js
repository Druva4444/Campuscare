import React, { useState } from "react";
import axios from 'axios'; // Import axios
import "./signup.css";
import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom'
function Stureg() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [field, setField] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
const navigate =useNavigate()
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const location = useLocation()
  const validateForm = (e) => {
    let isValid = true;

    // Reset error messages
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");

    // Email validation
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password length validation
    if (password1.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    // Password match validation
    if (password1 !== password2) {
      setPasswordMatchError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault(); // Prevent form submission if validation fails
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Validate the form
    if (!validateForm(e)) {
      return;
    }

    // Prepare doctor data for submission
    const doctorData = {
      email,
      password: password1,
      field, // You can add more data as needed
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addstu`, { email,
        password: password1,
        
    college:location.state}, {
      withCredentials: true
    });
      
      if (response.status === 200) {
        // Handle successful doctor creation
        navigate('/adminpatients')
        console.log("Doctor created successfully:", response.data);
        // Redirect or show success message
      } else {
        // Handle errors (e.g., doctor already exists)
        console.log("Error creating doctor:", response.data.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div>
      <div className="signcontainer">
        <form
          className="signform"
          id="signupForm"
          onSubmit={handleSubmit} // Handle form submission
        >
          <p id="signp">REGISTER</p>
          <input
            type="email"
            name="email"
            placeholder="Username"
            id="signupin"
            style={{ marginBottom: "1.5rem" }}
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {emailError && <span id="signemailError" className="error">{emailError}</span>}

          <div className="signpassword">
            <input
              type={isPasswordVisible1 ? "text" : "password"}
              name="password1"
              placeholder="Password"
              id="signpassword1"
              className="input"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <br />
            <img
              src={isPasswordVisible1 ? 'eyeopen.png' : 'lock.png'}
              alt="Toggle visibility"
              className="lockimage"
              id="lockimage"
              onClick={() => setIsPasswordVisible1(!isPasswordVisible1)}
            />
            {passwordError && <span id="signpassword1Error" className="error">{passwordError}</span>}
          </div>

          <div className="signpassword">
            <input
              type={isPasswordVisible2 ? "text" : "password"}
              name="password2"
              placeholder="Confirm password"
              id="signpassword2"
              className="input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <br />
            <img
              src={isPasswordVisible2 ? 'eyeopen.png' : 'lock.png'}
              alt="Toggle visibility"
              className="lockimage"
              id="lockimage1"
              onClick={() => setIsPasswordVisible2(!isPasswordVisible2)}
            />
            {passwordMatchError && (
              <span id="signpassword2Error" className="error">{passwordMatchError}</span>
            )}
          </div>

          

          <input type="submit" value="SIGN UP" id="signup" />
        </form>
      </div>
    </div>
  );
}

export default Stureg;
