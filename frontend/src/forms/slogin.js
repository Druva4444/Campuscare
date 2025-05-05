import React, { useState, useEffect } from "react";
import "./dslogin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
function Slogin() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [colleges, setColleges] = useState([]); 
    const [selectedCollege, setSelectedCollege] = useState(""); 
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/getcolleges`);
                const data = await response.json();
                setColleges(data);
                if (data.length > 0) {
                    setSelectedCollege(data[0].name); // Correctly set the first college
                }
            } catch (error) {
                console.error("Error fetching colleges:", error);
            }
        };

        fetchColleges();
    }, []);


 
 
   // Ensure this is imported

   const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/slogin`, {
            email,
            password1: password,
            college: selectedCollege,
            checkbox: rememberMe
        }, {
            withCredentials: true,
        });

        console.log(response.data.message);

        if (response.data.message === "Login Succesful") {
            // Set userdetails cookie
            const userdetailsString = encodeURIComponent(JSON.stringify(response.data.userdetails));
            document.cookie = `userdetails=${userdetailsString}; path=/; secure; samesite=None`;

            // Set token as Uid2 if present
            if (response.data.token) {
                document.cookie = `Uid2=${response.data.token}; path=/; secure; samesite=None`;
            }

            console.log("Login successful:", response);
            navigate("/studenthome");
        } else {
            console.error("Login failed:", response.message);
            alert("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
};


    return (
        <div>
            <div className="lgcontainer">
                <form className="lgform" method="post" action="/student/home" onSubmit={handleSubmit}>
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
                            src={passwordVisible ? './eyeopen.png' : './lock.png'}
                            alt="Toggle visibility"
                            id="lockimage"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                    
                    <div>
                        <select
                            name="college"
                            id="colleges"
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                        >
                            
                            {colleges.map((college) => (
                                <option key={college._id} value={college.name}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
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
                        <Link to="/forgetpasswords" id="fp" style={{ marginLeft: "0px" }}>
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Slogin;
