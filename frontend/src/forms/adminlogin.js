import React, { useState, useEffect } from "react";
import "./dslogin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Adminlogin() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
      
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/adminlogin`, {
                email,
                password1: password,
                checkbox: rememberMe
            }, {
                withCredentials: true,
            }).then((response) => {
                if (response.data.message === "Login Succesful") {
                    navigate("/admin");
                    console.log("Login successful:", response);
                } else {
                    console.error("Login failed:", response.message);
                    alert("Invalid credentials. Please try again.");
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            <div className="lgcontainer">
                <form className="lgform" method="post" onSubmit={handleSubmit}>
                    <p id="lg">LOG IN</p>

                    <input
                        className="lgin"
                        type="email"
                        name="email"
                        placeholder="Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: "2rem" }}
                    />
                    <br />

                    <div className="lgpassword">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password1"
                            placeholder="Password"
                            id="lgpassword1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br />
                        <img
                            src={passwordVisible ? 'eyeopen.png' : 'lock.png'}
                            alt="Toggle visibility"
                            id="lockimage"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                  

                    <div className="checkbox">
                        <input
                            type="checkbox"
                            name="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label>Remember me</label>
                    </div>

                    <input type="submit" value="Sign in" id="signin" />
                    <br />

                    <div className="lgnew1">
                        <Link to="/forgetpassword" id="fp" style={{ marginLeft: "0px" }}>
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Adminlogin;
