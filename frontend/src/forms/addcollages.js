import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export default function Addclgs() {
  const [array, setArray] = useState([]); 
  const [specialistInput, setSpecialistInput] = useState(""); 
  const [password1, setPassword1] = useState(""); 
  const [password2, setPassword2] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 
  const [arrayError, setArrayError] = useState(""); 
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false); 
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false); 
  const [collegename, setCollegename] = useState("");
  const [students, setStudents] = useState("");
  const [doctors, setDoctors] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState("");
  const [email,setEmail] = useState('');
  const navigate = useNavigate();

  // Add specialist to the array
  const addElement = (e) => {
    e.preventDefault();
    if (specialistInput.trim()) {
      setArray([...array, specialistInput.trim()]);
      setSpecialistInput("");
      setArrayError("");
    }
  };

  // Remove the last specialist
  const removeLastElement = (e) => {
    e.preventDefault();
    setArray(array.slice(0, -1));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password1 !== password2) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      setPasswordError("");
    }

    // Validate specialists array
    if (array.length === 0) {
      setArrayError("Please add at least one specialist.");
      return;
    } else {
      setArrayError("");
    }

    // Prepare data for API
    const requestData = {
      collegename,
      students: parseInt(students),
      doctors: parseInt(doctors),
      
      domain,
      specialists: array,
      admin: {
        email: email,
        password: password1,
      },
      
      plan: plan,
    };
    
 
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addnewclg`, requestData, {
        withCredentials: true
      });
      console.log("request registered successfully:", response.data);
      alert("Request registered successfully! tou will be notified");
      navigate('/')
    } catch (error) {
      console.error("Error registering college:", error);
      alert("Error registering college. Please try again.");
    }
  };

  useEffect(() => {
    console.log(plan);
  }, [plan]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handlesubmit}>
          <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
            Register Your College
          </h2>

          <input
            style={inputStyle}
            type="text"
            placeholder="College Name"
            value={collegename}
            onChange={(e) => setCollegename(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="number"
            placeholder="Max no of Students"
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="number"
            placeholder="Max no of Doctors"
            value={doctors}
            onChange={(e) => setDoctors(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="text"
            placeholder="Enter Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />

          <div style={{ marginBottom: "20px" }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter a field"
              value={specialistInput}
              onChange={(e) => setSpecialistInput(e.target.value)}
            />
            <button
              style={buttonStyle}
              onClick={addElement}
            >
              Add Specialist
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
              onClick={removeLastElement}
            >
              Remove Last
            </button>
          </div>
          {arrayError && <div style={errorStyle}>{arrayError}</div>}
          <p>Specialists: {JSON.stringify(array)}</p>
          <input
            style={inputStyle}
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          {passwordError && <div style={errorStyle}>{passwordError}</div>}


          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#007bff" }}>Select a Plan:</h3>
            
            {/* 3 Months Plan */}
            <div style={planStyle}>
              <h4>3-Months Plan</h4>
              <p>Perfect for short-term needs with access to all features.</p>
              <ul>
                <li>Unlimited consultations</li>
                <li>Free health check-ups</li>
                <li>Priority support</li>
              </ul>
              <label>
                <input
                   style={{width:'30px'}}
                  type="radio"
                  name="plan"
                  onChange={() => setPlan(3)}
                  required
                />
                Subscribe - {200 * students + 400 * doctors}rs
              </label>
            </div>


            {/* 6 Months Plan */}
            <div style={planStyle}>
              <h4>6-Months Plan</h4>
              <p>Great value for extended services and perks.</p>
              <ul>
                <li>Unlimited consultations</li>
                <li>2 Free specialist visits</li>
                <li>Exclusive health tips</li>
              </ul>
              <label>
                <input
                style={{width:'30px'}}
                  type="radio"
                  name="plan"
                  onChange={() => setPlan(6)}
                  required
                />
                Subscribe - {2 * (180 * students + 360 * doctors)}rs
              </label>
            </div>

            {/* 1-Year Plan */}
            <div style={planStyle}>
              <h4>1-Year Plan</h4>
              <p>The best offer for long-term health management.</p>
              <ul>
                <li>Unlimited consultations</li>
                <li>Free health diagnostics</li>
                <li>Annual health screening</li>
              </ul>
              <label>
                <input
                style={{width:'30px'}}
                  type="radio"
                  name="plan"
                  onChange={() => setPlan(12)}
                  required
                />
                Subscribe - {4 * (150 * students + 320 * doctors)}rs
              </label>
            </div>
          </div>

        
          <button type="submit" style={submitButtonStyle}>
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  padding: "10px 20px",
  margin: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const planStyle = {
  padding: "15px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  backgroundColor: "#f9f9f9",
};

const errorStyle = {
  color: "red",
  marginBottom: "10px",
};

const submitButtonStyle = {
  ...buttonStyle,
  width: "100%",
};