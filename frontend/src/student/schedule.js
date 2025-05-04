import React, { useEffect, useState } from "react";
import "./schedule.css";
import Mainbody from "./mainbody";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from 'axios'
function StudSch() {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [appointment,setappointment] = useState([])
    const [com,setcomi] = useState([]);
const[email,setEmail]  = useState(null)
const [filterDate, setFilterDate] = useState('');
const [filterAcceptedBy, setFilterAcceptedBy] = useState('');
const [rangeStart, setRangeStart] = useState('');
const [rangeEnd, setRangeEnd] = useState('');
const [sortOrder, setSortOrder] = useState('asc'); 
 const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
let filteredCom = com.filter(indi => {
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

  // Sort the filtered data
  filteredCom.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });


    useEffect(() => {
        // Set the current date
        const date = new Date();
        const month = date.getMonth() + 1;
        const formattedDate= `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;

        setCurrentDate(formattedDate);

        // Set the current time
        const displayTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const meridiem = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            const timeString = `${hours}.${minutes}.${seconds} ${meridiem}`;
            setCurrentTime(timeString);
        };

        displayTime();
        const timeInterval = setInterval(displayTime, 1000);

        return () => clearInterval(timeInterval); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        const fetchData = () => {
          const userDetails = Cookies.get('userdetails');
          const token = Cookies.get('Uid2');
          let email = null;
          
      
          if (userDetails) {
            const parsedDetails = JSON.parse(userDetails);
            email = parsedDetails.gmail;
            setEmail(email)
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
              .post(`${process.env.REACT_APP_API_URL}/getStuhome`, { email:email,page:currentPage,limit:5 })
              .then((response) => {
                console.log()
                setappointment(response.data.total);
                setcomi(response.data.comi);
                if (response.data.totalPages) {
                  setTotalPages(response.data.totalPages); // Only if backend sends this
                }
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
      }, [currentPage]);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.matches('.dropbtn')) {
                setIsDropdownVisible(false);
            }
        };
        
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);
    const handlePageChange = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
  
    return (
        <div >
           

            <div className="SCHsecondpart">
                <div className="SCHheader">
                    <div className="SCHheading" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="SCHbi bi-clipboard-pulse" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"/>
                        </svg>
                        <p style={{fontSize: "40px", marginTop: "0%" , marginLeft: "15px" , marginBottom:"0px"}}>My History</p>
                    </div>
                    
                    <div className="SCHdate" style={{marginTop: "5%" , margin: "0" , padding: "0"}}>
                        <p id="SCHdate" style={{textAlign: "end", margin: "0",marginRight:"40px" }}>{currentDate}</p>
                        <p id="SCHtime" style={{ margin: "0",marginRight:"40px" }}>{currentTime}</p>
                        <div className="SCHcalendar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="SCHbi bi-calendar-check" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                            </svg>
                        </div>
                    </div>
                </div>
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

     

      {console.log(filteredCom)}
      {filteredCom.length > 0
        ? filteredCom.map((indi, index) => (
            <Mainbody key={index} det={indi} email={email} no={index} />
          ))
        : <p style={{marginLeft:'40%',marginTop:'25%',fontSize:'40px',color:'#0A7273'}}>No History found</p>}
             

                {/* More history items can be added here */}

                <div className="SCHmarginpart">
                    <pre style={{marginTop: "40px"}}>   </pre>
                </div>
                <div className="pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    style={{ marginRight: "10px" }}
  >
    Previous
  </button>
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      style={{
        margin: "0 5px",
        backgroundColor: currentPage === index + 1 ? "#0A7273" : "transparent",
        color: currentPage === index + 1 ? "white" : "black",
      }}
    >
      {index + 1}
    </button>
  ))}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    style={{ marginLeft: "10px" }}
  >
    Next
  </button>
</div>
            </div>
        </div>
    );
}

export default StudSch;
