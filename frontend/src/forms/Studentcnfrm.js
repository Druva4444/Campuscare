import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Axios for API requests
import "./doctorforget.css";
import { useLocation } from "react-router-dom";
function NewPasswords() {
    const location = useLocation();
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const navigate = useNavigate(); // Hook for navigation

    const handlePasswordReset = async (event) => {
        event.preventDefault(); // Prevent default form submission

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!"); // Alert if passwords don't match
            return;
        }

        try {
            // Send password update request to the backend
            const response = await axios.post("http://localhost:3020/resetpasswords", {
                password: newPassword,email:location.state?.email
            });

            alert(response.data.message); // Show success message
            if (response.data.success) {
                if(location.state?.loc==='fromset'){
                    navigate('/studentsetting')
                }
                else{
                    navigate("/dslogin");
                }
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div>
            <div className="doccontainer">
                <form style={{ height: "100%" }} className="forgetform" onSubmit={handlePasswordReset}>
                    <p id="forget">Reset Your Password</p>
                    <input
                        id="forgetin"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ marginBottom: "1rem" }}
                        required
                    />
                    <input
                        id="forgetin"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ marginBottom: "2rem" }}
                        required
                    />
                    <input type="submit" value="Submit" id="confirm" />
                </form>
            </div>
        </div>
    );
}

export default NewPasswords;
