import React from "react";
import "./dochome.css";
import { useState ,useEffect} from "react";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from 'axios'
function Dochome(){
const [currentDate , setCurrentDate] = useState("");
const[currentTime , setCurrentTime] = useState("");
const [appointment,setappointment] = useState([])
const [upcom,setupcomi] = useState([]);
const [blockedDate, setBlockedDate] = useState("");


useEffect(() => {
  // Update date
  const date = new Date();
  const month = date.getMonth() + 1;
  setCurrentDate(`${date.getFullYear()}-${month}-${date.getDate()}`);

  // Update time every second
  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format
    const timeString = [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(".") + ` ${meridiem}`;

    setCurrentTime(timeString);
  };

  updateTime();
  const interval = setInterval(updateTime, 1000);
  return () => clearInterval(interval);
}, []);
useEffect(()=>{
  const userDetails = Cookies.get('userdetails');
  const token = Cookies.get('Uid1');
  if (userDetails) {
    // If userDetails cookie exists, parse and set the gmail state
    const parsedDetails = JSON.parse(userDetails);
    console.log(parsedDetails.gmail)
    axios.post('http://localhost:3020/gethome', { email: parsedDetails.gmail })
    .then(response => {
      // Assuming the response contains appointments count
      setappointment(response.data.total);
      console.log(appointment)
      setupcomi(response.data.upcomi)
      console.log(upcom)
    })
    .catch(error => {
      console.error("Error fetching appointment count:", error);
    });
    
  } else if (token) {
    try {
      // Decode the JWT token
      const decoded = decodeToken(token); // Make sure the secret matches
      console.log(decoded)
      axios.post('http://localhost:3020/gethome', { email: decoded.gmail })
    .then(response => {
      // Assuming the response contains appointments count
      setappointment(response.data.total);
      console.log(appointment)
      setupcomi(response.data.upcomi)
    })
    } catch (error) {
      console.error("Token verification failed:", error);
      // You can clear cookies or redirect to login if token is invalid
    }
  } else {
    console.log("No user details or token found");
  }
},[])


    return(
        <div>
            


<div className="DHnonnavbar" style={{marginLeft:"0",borderLeftWidth:"200px",zIndex: "-20" }}>
      <div className="DHhornav">
        <div className="DHhome">
          <p style={{ marginLeft: "37.5%", fontSize: "3rem" , color:"#0A7273" }}>Home</p>
        </div>

        <div className="DHdates">
          <div className="DHtext">
            <div className="DHdate" style={{margin: "0" , padding: "0"}}>
              <p id="DHdate" style={{ textAlign: "end",margin: "0" ,color:"#0A7273"}}>{currentDate}</p>
              <p id="DHtime"style={{margin: "0",color:"#0A7273"}}>{currentTime}</p>
            </div>
            <div className="DHicon" style={{ marginLeft: "10px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        className="DHwelcome"
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}
      >
        <p id="DH"style={{fontSize:"30px"}}>
          <span style={{ fontSize: "4rem" }}>Welcome back</span> <br />
          Doctor <br />
          Track your appointments and patient's history
        </p >
        
      </div>



      <div className="DHnofi">
        <p id="DH">Dashboard</p>
        <div className="DHsessions">
          <div className="DHtextpart1">
            <div className="DHtextdiv" style={{margin: "0" , padding: "0"}}>
              <p style={{ margin: "0" ,fontSize: "25px", color:"snow" }} id="DH">{upcom?upcom.length:0}</p>
              <p  id="DH" style={{ margin: "0",fontSize: "25px", color:"snow" }}>upcoming</p>
            </div>
            <div className="DHimgdiv">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-bookmark-check-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="DHsessions" style={{ marginTop: "2%" }}>
          <div className="DHtextpart1">
            <div className="DHtextdiv" style={{margin: "0" , padding: "0"}}>
              <p style={{ margin: "0",fontSize: "25px",color:"snow"}} id="DH">{appointment?appointment.length:0}</p>
              <p id="DH" style={{ margin: "0",fontSize: "25px",color:"snow" }}>Completed </p>
            </div>
            <div className="DHimgdiv">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-clipboard2-pulse-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
                <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M9.98 5.356 11.372 10h.128a.5.5 0 0 1 0 1H11a.5.5 0 0 1-.479-.356l-.94-3.135-1.092 5.096a.5.5 0 0 1-.968.039L6.383 8.85l-.936 1.873A.5.5 0 0 1 5 11h-.5a.5.5 0 0 1 0-1h.191l1.362-2.724a.5.5 0 0 1 .926.08l.94 3.135 1.092-5.096a.5.5 0 0 1 .968-.039Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="DHdashboard" style={{ marginLeft: "59%" }}>
        <p id="DH">My upcoming bookings</p>
        <table style={{ marginTop: "0%", width: "100%", marginLeft: "0%" }} className="dhtable">
      <thead>
        <tr>
          <th>Session No</th>
          <th>Date</th>
          <th style={{ borderRadius: "0px 50px 0px 0px" }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {upcom.length > 0 ? (
          upcom.slice(0, 2).map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{appointment.date ? new Date(appointment.date).toLocaleDateString() : "NA"}</td>
              <td>{appointment.time || "NA"}</td>
            </tr>
          ))
          
        ) : (
          <tr>
            <td>1</td>
            <td>NA</td>
            <td>NA</td>
          </tr>
        )}
      </tbody>
    </table>

      </div>
    </div>

        </div>
    )
}

export default Dochome