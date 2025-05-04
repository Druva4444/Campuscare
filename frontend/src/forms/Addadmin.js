import React, { useState, useEffect } from "react";
import "./suserlogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Addadmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(""); 
  const [colleges, setColleges] = useState([]);
  const [confirmpassword, setConfirmpassword] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
};

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetchcolleges`, {
          withCredentials: true, 
        });
        if (response.status === 200) {
          setColleges(response.data);
        } else {
          console.error("Failed to fetch colleges:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    

    fetchColleges();
  }, []);

 
  const addNewAdmin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Addadmin`,
        {
          emailId: email,
          password,
          confirmpassword,
          collegeId: selectedCollege,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert(response.data.message || "Signup successful!");
        navigate('/superadmin_admins');  
      } else {
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error.response ? error.response.data : error.message);

    
      if (error.response) {
     
        alert(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // No response received from the server
        alert("No response received from the server. Please try again later.");
      } else {
        // Error in setting up the request
        alert("Error in setting up the request: " + error.message);
      }
    }
  };


  return (
    <div>
      <div className="susercontainer">
        <form className="suserform" onSubmit={addNewAdmin}>
          <p id="suserp">LOG IN</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            id="suserin"
            style={{ marginBottom: "2rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <div style={{ marginBottom: "0.5rem" }}>
            <select
              name="college"
              id="college"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)} 
              style={{
                width: "300px",
                border: "none",
                borderRadius: "4000px",
                padding: "1em",
                background: "#efeeee",
                marginBottom: "1em",
                color: "#888",
                fontFamily: '"Poppins", sans-serif',
                textDecoration: "none",
              }}
            >
              <option value="">-- Choose a College --</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
          <div className="suserpassword">
            <input
              type= {passwordVisible ? "text" : "password"}
              name="password1"
              placeholder="Password"
              id="suserpassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <img
                            src={passwordVisible ? '/eyeopen.png' : '/lock.png'}
                            alt="Toggle visibility"
                            id="lockimage"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
          </div>
          <div className="suserpassword">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password1"
              placeholder="Confirm Password"
              id="suserpassword1"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <br />
            <img
                            src={passwordVisible ? '/eyeopen.png' : '/lock.png'}
                            alt="Toggle visibility"
                            id="lockimage"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
          </div>

          <input type="submit" value="Sign in" id="signin" />
          <br />
        </form>
      </div>
    </div>
  );
}

export default Addadmin;
