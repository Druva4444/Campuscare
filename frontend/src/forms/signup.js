import React, { useState ,useEffect} from "react";
import "./signup.css";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Signup() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [colleges,setColleges] = useState([]);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [selectedcollege,setselectedCollege] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:3020/fetchcolleges1", {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:3020/Addstudent",
        {
          email: email,
          password: password1,
          confirmpassword: password2,
          collegeId: selectedcollege,
        },
        {
            headers: {
                'Content-Type': 'application/json',
              },
              withCredentials : true
        }
      );
      if (response.status === 201) {
        
        alert(response.data.message || "Signup successful!");
        navigate('/superadmin_admins'); 
      } else {
        
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error.response ? error.response.data : error.message);
  
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || error.response.statusText}`);
      } 
      
      else if (error.request) {
        alert("No response received from the server. Please try again later.");
      } 
      
      else {
        alert("Error in setting up the request: " + error.message);
      }
    }
  };
  

  return (
    <div>
      <div className="signcontainer">
        <form
          className="signform"
          method="post"
          action="/field"
          id="signupForm"
          onSubmit={handleSubmit}
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
              src={isPasswordVisible1 ? '/eyeopen.' : '/lock.png'}
              alt="Toggle visibility"
              className="lockimage"
              id="lockimage"
              onClick={() => setIsPasswordVisible1(!isPasswordVisible1)}
            />
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
              src={isPasswordVisible2 ? "/eyeopen.png" : "/lock.png"}
              alt="Toggle visibility"
              className="lockimage"
              id="lockimage1"
              onClick={() => setIsPasswordVisible2(!isPasswordVisible2)}
            />
          </div>

          <div>
            <select name="signcollege" id="signcolleges" value={selectedcollege} onChange={(e)=>setselectedCollege(e.target.value)}>
            <option value="">-- Choose a College --</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <input type="submit" value="SIGN UP" id="signup" />
          <br />
          <div className="signnew1">
            <a href="#" id="su"></a>
            <a href="#" id="fp"></a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;