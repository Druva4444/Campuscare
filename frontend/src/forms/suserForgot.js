import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Axios for API requests
import "./doctorforget.css";

function Suserforget() {
    const [email, setEmail] = useState(""); // State for email input
    const [otp, setOtp] = useState(""); // State for OTP input
    const [step, setStep] = useState(1); // Step state: 1 = Email, 2 = OTP
    const navigate = useNavigate(); // Hook for navigation

    // Handle sending OTP
    const handleSendOtp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/superuser/sendotp`, { email });
            alert(response.data.message); // Show success message
            setStep(2); // Move to OTP input step
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to send OTP");
        }
    };

    // Handle verifying OTP
    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/superuser/handleforget`, { email, otp });
            alert(response.data.message);
            if(response.data.message==='OTP verified successfully'){
                navigate("/suser/newpassword",{ state: { email } });
            } // Show success message
             // Navigate to new password page
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div>
            <div className="doccontainer">
                {step === 1 && (
                    <form style={{ height: "100%" }} className="forgetform" onSubmit={handleSendOtp}>
                        <p id="forget">Enter Your Email</p>
                        <input
                            id="forgetin"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: "2rem" }}
                            required
                        />
                        <input type="submit" value="Send OTP" id="confirm" />
                    </form>
                )}

                {step === 2 && (
                    <form style={{ height: "100%" }} className="forgetform" onSubmit={handleVerifyOtp}>
                        <p id="forget">Enter OTP</p>
                        <input
                            id="forgetin"
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ marginBottom: "2rem" }}
                            required
                        />
                        <input type="submit" value="Verify OTP" id="confirm" />
                    </form>
                )}
            </div>
        </div>
    );
}

export default Suserforget;
