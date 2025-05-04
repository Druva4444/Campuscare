  import React, { useState, useEffect } from "react";
  import "./appointment.css";
  import Cookies from 'js-cookie';
  import { useJwt ,decodeToken} from "react-jwt";
  import axios from "axios";
  function StudAppoint() {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [doctors,setdoctors] =useState([])
    const [date,setdate] = useState()
    const [description,setdescription] = useState('')
    const [gmail,setgmail] = useState('')
      const [college,setclg] = useState('')
      const [selectedSlot, setSelectedSlot] = useState(""); 
      const [selectedDoctor, setSelectedDoctor] = useState("");
      const [day, setDay] = useState(new Date().toLocaleString("en-US", { weekday: "long" }));
      useEffect(() => {
        const userDetails = Cookies.get('userdetails');
        const token = Cookies.get('Uid2');
    console.log(userDetails)
    console.log(token)
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          console.log(parsedDetails.gmail)
          setgmail(parsedDetails.gmail);
          setclg(parsedDetails.college)
        } else if (token) {
          try {
            const decoded = decodeToken(token); 
            console.log(decoded)
            setgmail(decoded.gmail); 
            setclg(decoded.clg)
          } catch (error) {
            console.error("Token verification failed:", error);
          }
        } else {
          console.log("No user details or token found");
        }
      }, []);
    useEffect(() => {
      // Set current date
      const date = new Date();
      const month = date.getMonth() + 1;
      setCurrentDate(
        `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
      );

      // Update time every second
      const updateTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const timeString = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} ${meridiem}`;
        setCurrentTime(timeString);
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      // Add animations on load
      const mainbody = document.querySelector(".APPmainbody");
      if (mainbody) mainbody.classList.add("animate-up");
      const header = document.querySelector(".APPheader");
      if (header) header.classList.add("slide-down");

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }, []);

    useEffect(() => {
      const today = new Date();
      const nextSevenDays = new Date(today);
      nextSevenDays.setDate(today.getDate() + 7);

      // Format dates in YYYY-MM-DD format
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      
      setMinDate(formatDate(today));
      setMaxDate(formatDate(nextSevenDays));

      // Generate time slots for dropdown (9 AM to 5 PM in 15-minute intervals)
      const generateTimeSlots = () => {
        const slots = [];
        const start = 9 * 60; // 9 AM in minutes
        const end = 17 * 60; // 5 PM in minutes
        const step = 15; // 15-minute intervals

        for (let time = start; time < end; time += step) {
          const startHour = Math.floor(time / 60);
          const startMinute = time % 60;
          const endHour = Math.floor((time + step) / 60);
          const endMinute = (time + step) % 60;

          // Format start time
          const startFormatted = `${startHour < 10 ? "0" : ""}${startHour}:${startMinute < 10 ? "0" : ""}${startMinute}`;
          // Format end time
          const endFormatted = `${endHour < 10 ? "0" : ""}${endHour}:${endMinute < 10 ? "0" : ""}${endMinute}`;

          // Create the time interval string (e.g., "09:00 AM - 09:15 AM")
          const timeInterval = `${startFormatted} - ${endFormatted}`;
          slots.push(timeInterval);
        }
        setTimeSlots(slots);
      };

      generateTimeSlots();
    }, []);
    useEffect(()=>{
      async function z(){
        const response =await axios.post('http://localhost:3020/getdoc',{college})
        console.log(response.data.msg)
        setdoctors(response.data.msg)
      }
      z()
    },[college])
    useEffect(() => {
      async function fetchSlots() {
        if (selectedDoctor) {
          console.log("Fetching slots for doctor:", selectedDoctor, "on day:", day);
          try {
            const response = await axios.post("http://localhost:3020/getslots", {
              gmail: selectedDoctor,
              date,
            });
            console.log("Response from getslots:", response.data);
            if (response.data.slots) {
              setTimeSlots(response.data.slots);
            } else {
              console.error("No slots provided for the selected doctor.");
              setTimeSlots([]);
            }
          } catch (error) {
            console.error("Error fetching slots:", error);
            setTimeSlots([]);
          }
        }
      }
    
      fetchSlots();
    }, [selectedDoctor, date]);
    useEffect(() => {
      if (doctors.length > 0 && !selectedDoctor) {
        setSelectedDoctor(doctors[0].gmail);
      }
    }, [doctors, selectedDoctor]);
    useEffect(() => {
      async function fetchDoctors() {
        try {
          const response = await axios.post('http://localhost:3020/getdoc', { college });
          console.log("Doctors fetched:", response.data.msg);
          setdoctors(response.data.msg);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      }
      if (college) {
        fetchDoctors();
      }
    }, [college]);  
    const handleBookNow = async (event) => {
      event.preventDefault();

      if (!selectedDoctor || !day || !selectedSlot) {
          alert('Please select a doctor, day, and time slot.');
          return;
      }

      try {
        let starttime = selectedSlot.split(' ')[0]
        const [hours, minutes] = starttime.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0)
          const response = await axios.post('http://localhost:3020/bookslot', {
              gmail: selectedDoctor,
              day,
              timeSlot: selectedSlot,
              description,
              date:newDate ,
              user:gmail,
              college
          });
          if (response.status === 200) {
              alert('Slot booked successfully!');
              setTimeSlots(prevSlots => prevSlots.filter(slot => slot !== selectedSlot));
              setSelectedSlot(""); // Reset selected slot after booking
          }
      } catch (error) {
          console.error('Error booking slot:', error);
          alert('Failed to book slot. Please try again.'+error);
      }
  };

  const filteredSlots = timeSlots.filter((slot) => {
    const [start] = slot.split(' - '); // Extract start time (e.g., "9:00")
    const [hours, minutes] = start.split(':').map(Number); // Split hours and minutes
  
    // Create a Date object for the slot's start time
    const slotDate = new Date(date)
    slotDate.setHours(hours, minutes, 0, 0); // Set the time on today's date
  
    return slotDate > new Date(); // Keep only future slots
  });
    
    return (
      <div className="body">
        <div className="APPnonnavbar">
          <div className="APPheader">
            <div className="APPheading">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="APPbi bi-clipboard2-plus" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                <path d="M8.5 6.5a.5.5 0 0 0-1 0V8H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H10a.5.5 0 0 0 0-1H8.5z" />
              </svg>
              <p style={{ fontSize: "40px", marginLeft: "10px" }}>Schedule a New Appointment</p>
            </div>
            <div className="APPdate" style={{ marginTop: "5%", margin: "0", padding: "0" }}>
              <p id="APPdate" style={{ textAlign: "end", margin: "0" ,marginRight:"40px"}}>{currentDate}</p>
              <p id="APPtime" style={{ margin: "0",marginRight:"40px" }}>{currentTime}</p>
              <div className="APPcalendar">
              <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="APPbi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5-.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
            </div>
            
          </div>
          <form className="appointform" action="/appointment" method="post">
            <div className="APPmainbody">
            <div className="APPSt">
        {/* Doctor Dropdown */}
        <label style={{ marginLeft: "50px", fontSize: "120%" }}>Select Doctor:</label>
        <select
          name="doctor"
          style={{ marginLeft: "20px", marginBottom: "0px" }}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor.gmail}>
              {doctor.gmail.split("@")[0]} ({doctor.fields})
            </option>
          ))}
        </select>
        </div>

              <div className="APPSt">
                <label style={{ marginLeft: "50px", fontSize: "120%" }}>Schedule Date:</label>
                <input id="APPin" type="date" style={{ marginLeft: "20px", marginBottom: "0px" }} name="date" min={minDate} max={maxDate} onChange={(event)=>{setdate(event.target.value)}}/>
              </div>
              <div className="APPSt">
    <label style={{ marginLeft: "50px", fontSize: "120%" }}>Schedule Time:</label>
    <select
      name="time"
      style={{ marginLeft: "20px", marginBottom: "0px" }}
      value={selectedSlot} // Bind the dropdown value to the state
      onChange={(e) => setSelectedSlot(e.target.value)} // Update the state on selection
    >
      
      <option value="">Select a time slot</option>
      {filteredSlots.length > 0 ? (
  filteredSlots.map((slot, index) => (
    <option key={index} value={slot}>
      {slot}
    </option>
  ))
) : (
  <option value="" disabled>
    No slots available
  </option>
)}
    </select>
  </div>

            
              <div className="APPdesc">
                <p style={{ marginLeft: "50px" }}>Description of Health Issues:</p>
              </div>
              <div className="APPin">
                <input
                  type="text"
                  id="APPmyInput"
                  autoComplete="on"
                  placeholder="Enter your text here"
                  style={{
                    border: "1px solid #0A7273",
                    paddingLeft: "0px",
                    marginBottom: "0",
                  }}
                  name="description"
                  onChange={(event)=>{setdescription(event.target.value)}}
                />
              </div>
              <div className="APPbutt">
                <button id="B" type="submit" style={{ marginRight: "20%" }} onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default StudAppoint;
