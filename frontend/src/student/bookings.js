import React, { useEffect, useState } from "react";
import "./booking.css";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from 'axios'
import Mainbody1 from "./Mainbody1";

function StudBook() {
    // State for the current date and time
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [appointment,setappointment] = useState([])
    const [com,setcomi] = useState([])
    const [filterDate, setFilterDate] = useState('');
    const [filterAcceptedBy, setFilterAcceptedBy] = useState('');
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); 
    let filteredCom = appointment.filter(indi => {
        const itemDate = new Date(indi.date);
        const startDate = rangeStart ? new Date(rangeStart) : null;
        const endDate = rangeEnd ? new Date(rangeEnd) : null;
    
        return (
          (!filterDate || itemDate.toISOString().slice(0, 10) === filterDate) &&
          (!filterAcceptedBy || indi.acceptedby.includes(filterAcceptedBy)) &&
          (!startDate || itemDate >= startDate) &&
          (!endDate || itemDate <= endDate)
        );
      });
      filteredCom.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    // Set current date on mount
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const formattedDate= `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;

        setCurrentDate(formattedDate);
        
        // Function to update time every second
        const displayTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const meridiem = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = (hours < 10 ? "0" : "") + hours;
            minutes = (minutes < 10 ? "0" : "") + minutes;
            seconds = (seconds < 10 ? "0" : "") + seconds;
            const timeString = `${hours}.${minutes}.${seconds} ${meridiem}`;
            setCurrentTime(timeString);
        };
        
        displayTime();
        const intervalId = setInterval(displayTime, 1000);
        
        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        const fetchData = () => {
          const userDetails = Cookies.get('userdetails');
          const token = Cookies.get('Uid2');
          let email = null;
      
          if (userDetails) {
            const parsedDetails = JSON.parse(userDetails);
            email = parsedDetails.gmail;
          } else if (token) {
            try {
              const decoded = decodeToken(token);
              email = decoded.gmail;
            } catch (error) {
              console.error("Token verification failed:", error);
            }
          }
      
          if (email) {
            axios
              .post(`${process.env.REACT_APP_API_URL}/getStuhome`, { email }, {
                withCredentials: true
              })
              .then((response) => {
                console.log()
                setappointment(response.data.total);
                setcomi(response.data.comi);
              })
              .catch((error) => {
                console.error("Error fetching appointments:", error);
              });
          }
        };
      
        // Fetch immediately
        fetchData();
      
        // Set up polling
        const interval = setInterval(fetchData, 50000); // Poll every 5 seconds
      
        // Cleanup on unmount
        return () => clearInterval(interval);
      }, []);
    // Dropdown toggle function
    const toggleDropdown = () => {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    };

    useEffect(() => {
        // Attach window click event to close dropdowns
        window.onclick = (event) => {
            if (!event.target.matches(".dropbtn")) {
                toggleDropdown();
            }
        };
    }, []);

    return (
        <div >
            
            <div className="Booknonnavbar">
                <div className="Bookheader">
                    <div className="Bookheading" style={{marginTop: "4%"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                        </svg>
                        <p style={{fontSize: "30px", marginTop: "0%", marginLeft: "15px", marginBottom: "0"}}>My Bookings</p>
                    </div>
                    <div className="Bookdate" style={{ marginTop: "4%" , margin: "0" , padding: "0"}}>
                        <p id="Bookdate" style={{ textAlign: "end" ,margin: "0",marginRight:"40px" }}>{currentDate}</p>
                        <p id="Booktime" style={{ margin: "0",marginRight:"40px" }}>{currentTime}</p>
                        <div className="Bookcalendar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Booking details section */}
                <div className="filteringpart" style={{display: "flex", marginTop: "2%",color:"#0A7273",fontSize:"20px",backgroundColor:"whitesmoke",padding:"10px",borderRadius:"10px",alignItems:"center",justifyContent:"space-between"}}>
        <p>Based on Date</p>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{border:'none'}} />

        <p>Based on  doctor</p>
        <input type="text" placeholder="Enter doctor email..." value={filterAcceptedBy} onChange={e => setFilterAcceptedBy(e.target.value)} style={{border:'none'}} />

        <p>From Date Range</p>
        <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} style={{border:'none'}} />
        <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} style={{border:'none'}}/>

        <p>Sort by Date</p>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Oldest to Newest</option>
          <option value="desc">Newest to Oldest</option>
        </select>
      </div>
                {filteredCom.length > 0 ? (
  filteredCom.map((val, index) => <Mainbody1 key={index} det={val} />)
) : (
  <div
    className="Bookmainbod"
    style={{
      marginTop: "200px",
      marginLeft: "500px",
      color: "#0A7273",
    }}
  >
    <h1>No upcoming bookings</h1>
  </div>
)}

            </div>
        </div>
    );
}

export default StudBook;