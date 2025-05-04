import React, { useState, useEffect } from "react";
import "./docpatients.css";
import Ptmain from './ptmain'
import Cookies from 'js-cookie';
import { decodeToken } from "react-jwt";
import axios from 'axios';

function Docpatients() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [filterCreatedy, setFilterCreatedy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Toggle Dropdown Visibility
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = () => {
      const userDetails = Cookies.get('userdetails');
      const token = Cookies.get('Uid1');
      let email;

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
          .post(`${process.env.REACT_APP_API_URL}/getpatients`, {
            email: email,
            page: currentPage,
            limit: 5, // You can adjust this
          })
          .then((response) => {
            setPatients(response.data.patients);
            if (response.data.totalPages) {
              setTotalPages(response.data.totalPages); // Only if backend sends this
            }
            console.log(response.data.patients);
          })
          .catch((error) => {
            console.error("Error fetching patients:", error);
          });
      }
    };

    // Fetch immediately
    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [currentPage]); // depend on currentPage

  useEffect(() => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setDate(formattedDate);

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const meridiem = hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2, "0")} ${meridiem}`;
      setTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputData = Array.from(formData.entries()).map(([key, value]) => ({ key, value }));
    console.log(inputData);
  };

  // Pagination handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <div className="DPnonnavbar" style={{ marginLeft: "0px", zIndex: "-10" }}>
        {/* Header Section */}
        <div className="DPhornav">
          <div className="DPsessions" style={{ marginTop: "2%" }}>
            <div className="DPtextpart1">
              <div className="DPtextdiv">
                <p style={{ fontSize: "30px", marginBottom: "0%", color:"snow"}}>Patients List</p>
              </div>
              <div className="DPimgdiv">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-lines-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="DPdates">
            <div className="DPtext">
              <div className="DPdate" style={{ margin: "0", padding: "0" }}>
                <p id="DPdate" style={{ textAlign: "end", margin: "0", color:"#0A7273", fontSize:"30px" }}>{date} </p>
                <p id="DPtime" style={{ margin: "0", color:"#0A7273", fontSize:"30px"}}>{time}</p>
              </div>
              <div className="DPicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="DPbi bi-calendar-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="filters" style={{ marginLeft: "17%", display: "flex", marginTop: "2%", color:"#0A7273", fontSize:"20px", backgroundColor:"whitesmoke", padding:"10px", borderRadius:"10px", alignItems:"center" }}>
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
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: "10px", marginRight: "10px" }}>
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
          </select>
        </div>

        {/* Patients List */}
        {patients
          .filter((patient) => {
            const patientDate = new Date(patient.date);
            const matchesFilterDate =
              !filterDate ||
              new Date(patient.date).toISOString().slice(0, 10) === filterDate;

            const matchesCreatedy =
              !filterCreatedy || patient.createdy.toLowerCase().includes(filterCreatedy.toLowerCase());
            const matchesDateRange =
              (!startDate || patientDate >= new Date(startDate)) &&
              (!endDate || patientDate <= new Date(endDate));
            return matchesFilterDate && matchesCreatedy && matchesDateRange;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
          })
          .map((patient, ind) => (
            <Ptmain det={patient} key={ind} />
          ))}

        {/* Pagination Buttons */}
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

export default Docpatients;
