import React, { useState, useEffect } from "react";
import "./home.css";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from 'axios'
function StudHome() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointment, setappointment] = useState([]);
  const[upcomingappointment,setupcomingapp] = useState('');
  const[completedappointment,setcompletedapp] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    setDate(`${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`);
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      const meridiem = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${meridiem}`;
      setTime(formattedTime);
    }, 1000);

    // Fetch medication and appointments data
  
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  useEffect(()=>{
    const userDetails = Cookies.get('userdetails');
    const token = Cookies.get('Uid2');
    if (userDetails) {
      // If userDetails cookie exists, parse and set the gmail state
      const parsedDetails = JSON.parse(userDetails);
      console.log(parsedDetails.gmail)
      axios.post(`${process.env.REACT_APP_API_URL}/getStuhome`, { email: parsedDetails.gmail }, {
        withCredentials: true
      })
      .then(response => {
        setappointment(response.data.total);
        setupcomingapp(response.data.upcom);
        setcompletedapp(response.data.comi);
        console.log(appointment)
        
      })
      .catch(error => {
        console.error("Error fetching appointment count:", error);
      });
      
    } else if (token) {
      try {
        // Decode the JWT token
        const decoded = decodeToken(token); // Make sure the secret matches
        console.log(decoded)
        axios.post(`${process.env.REACT_APP_API_URL}/getStuhome`, { email: decoded.gmail }, {
          withCredentials: true
        })
      .then(response => {
        // Assuming the response contains appointments count
        setappointment(response.data.total);
        setupcomingapp(response.data.upcom);
        setcompletedapp(response.data.comi);
        console.log(appointment)
        
      })
      } catch (error) {
        console.error("Token verification failed:", error);
        // You can clear cookies or redirect to login if token is invalid
      }
    } else {
      console.log("No user details or token found");
    }
  },[])

  return (
    <div className="body">
      <div className="SHnonnavbar">
        <div className="SHhornav" style={{ width: "95%" }}>
          <div className="SHhome">
            <p style={{ marginLeft: "37.5%", fontSize: "3rem" }}>Home</p>
          </div>
          <div className="SHdates">
            <div className="SHtext">
              <div className="SHdate" style={{margin: "0" , padding: "0"}}>
                <p id="SHdate" style={{ margin: "0",textAlign: "end" }}>
                  {date}
                </p>
                <p id="SHtime" style={{margin: "0"}}>{time}</p>
              </div>
              <div className="SHicon" style={{ marginLeft: "10px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="SHbi bi-calendar-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="SHwelcome">
          <p>
            <span style={{ fontSize: "3rem" }}>Welcome back</span> <br /> Student{" "}
            <br /> Track your past and future appointment history
          </p>
        </div>
        <div className="SHdashboard">
          <p style={{ fontSize: "50px" }}>Appointment tracking</p>
          <div className="SHschedule">
             <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th style={{ borderRadius: "0px 50px 0px 0px" }}>Doctor</th>
              </tr>
            </thead>
            <tbody>
            {appointment.length > 0 ? (
  appointment.map((appointment, index) => {
    // Ensure appointment.date is parsed into a Date object
    const appointmentDate = new Date(appointment.date);

    return (
      <tr key={index}>
        <td>
          {appointmentDate instanceof Date && !isNaN(appointmentDate)
            ? `${appointmentDate.getDate()}/${appointmentDate.getMonth() + 1}/${appointmentDate.getFullYear()}`
            : "NA"}
        </td>
        <td>{appointment.time || "NA"}</td>
        <td>{appointment.acceptedby  || "NA"}</td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="3" style={{ textAlign: "center" }}>
      No upcoming appointments
    </td>
  </tr>
)}

            </tbody>
          </table>
          </div>
        </div>
        <div className="SHnofi">
          <div className="SHsessions">
            <div className="SHtextpart1">
              <div className="SHtextdiv"  style={{margin: "0" , padding: "0"}}>
                <p style={{ fontSize: "20px",margin: "0" }} id="main7">
                  {upcomingappointment.length}
                </p>
                <p style={{ fontSize: "24px",margin: "0" }}>Upcoming sessions</p>
              </div>
              <div className="SHimgdiv">
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

          <div className="SHsessions" style={{marginTop:"2%"}}>
            <div className="SHtextpart1">
              <div className="SHtextdiv"  style={{margin: "0" , padding: "0"}}>
                <p style={{ fontSize: "20px",margin: "0" }} id="main7">
                  {completedappointment.length}
                </p>
                <p style={{ fontSize: "24px",margin: "0" }}>Completed sessions</p>
              </div>
              <div className="SHimgdiv">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="SHbi bi-clipboard-pulse"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudHome;