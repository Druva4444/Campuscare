import React, { useState, useEffect } from "react";
import "./docschedule.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from 'axios'
import Scmain from './scmain.js'
function Docschedule() {
    const [appointment,setappointment] = useState([])
      const [filterDate, setFilterDate] = useState("");
      const [filterCreatedy, setFilterCreatedy] = useState("");
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
      const [sortOrder, setSortOrder] = useState("newest");
      
const [upcom,setupcomi] = useState([])
useEffect(() => {
  const fetchData = () => {
    const userDetails = Cookies.get('userdetails');
    const token = Cookies.get('Uid1');
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
        .post(`${process.env.REACT_APP_API_URL}/gethome`, { email }, {
          withCredentials: true
        })
        .then((response) => {
          setappointment(response.data.total);
          setupcomi(response.data.upcomi);
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  };

  // Fetch immediately
  fetchData();

  // Set up polling
  const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

  // Cleanup on unmount
  return () => clearInterval(interval);
}, []);

    const [insVisible, setInsVisible] = useState(false);
    const navigate = useNavigate();

    // Toggle visibility of .i element
    const toggleInsVisibility = () => setInsVisible(!insVisible);

    
    // Set the current date and time
    useEffect(() => {
        const updateDateTime = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const formattedTime = date.toLocaleTimeString();
            document.getElementById("dsdate").textContent = formattedDate;
            document.getElementById("dstime").textContent = formattedTime;
        };
        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="dsnonnavbar" style={{ marginLeft: "0%", zIndex: "-20" }}>
                <div className="dshornav">
                    <div className="dssessions" style={{ marginTop: "1%" }}>
                        <div className="dstextpart1">
                            <div className="dstextdiv" style={{margin: "0" , padding: "0"}}>
                                <p style={{ margin: "0",fontSize: "30px" ,color:"snow" }}></p>
                                <p style={{ margin: "0",fontSize: "40px" ,color:"snow",padding:"4%" }}>Scheduled sessions</p>
                            </div>
                            <div className="dsimgdiv">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-pulse-fill" viewBox="0 0 16 16">
                                    <path d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9z" />
                                    <path d="M.88 8C-2.427 1.68 4.41-2 7.823 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="dsdates">
                        <div className="dstext">
                            <div className="dsdate" style={{margin: "0" , padding: "0"}}>
                                <p id="dsdate" style={{ margin: "0",textAlign: "end" ,fontSize:"30px",color:"#0A7273"}}></p>
                                <p id="dstime" style={{ marginBottom: "0",fontSize:"30px",color:"#0A7273"}}></p>
                            </div>
                            <div className="dsicon"style={{margin: "0"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                                    <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filters"   style={{marginLeft:"17%",display: "flex", marginTop: "2%",color:"#0A7273",fontSize:"20px",backgroundColor:"whitesmoke",padding:"10px",borderRadius:"10px",alignItems:"center"}}>
  <label>Filter by Date</label>
  <input
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    placeholder="Filter by Date"
    style={{ marginLeft: "10px", marginRight: "10px" }}
  />
  <label>Filter by patient</label>
  <input
    type="text"
    value={filterCreatedy}
    onChange={(e) => setFilterCreatedy(e.target.value)}
    placeholder="Filter by Createdy (name)"
    style={{ marginLeft: "10px", marginRight: "10px" }}
  />
  <label>Filter by Date Range</label>
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    placeholder="Start Range"
    style={{ marginLeft: "10px", marginRight: "10px" }}
  />
  <label>to</label>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    placeholder="End Range"
    style={{ marginLeft: "10px", marginRight: "10px" }}
  />
  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: "10px", marginRight: "10px" }}  >
    <option value="newest">Newest to Oldest</option>
    <option value="oldest">Oldest to Newest</option>
  </select>
</div>
                {console.log(upcom)}
                {upcom.length > 0 ? (
  upcom
    .filter((indi) => {
      const dateObj = new Date(indi.date); // ensure proper Date conversion

      const matchesFilterDate =
        !filterDate || dateObj.toISOString().slice(0, 10)  === filterDate;

      const matchesCreatedy =
        !filterCreatedy || indi.createdy.toLowerCase().includes(filterCreatedy.toLowerCase());

      const matchesDateRange =
        (!startDate || dateObj >= new Date(startDate)) &&
        (!endDate || dateObj <= new Date(endDate));

      return matchesFilterDate && matchesCreatedy && matchesDateRange;
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    )
    .map((indi, index) => (
      <Scmain key={index} det={indi} />
    ))
) : (
  <p className="dstext4">No appointments available</p>
)}


                


            </div>
        </div>
    );
}

export default Docschedule;