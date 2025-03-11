import React, { useEffect, useState } from "react";
import "./docbooking.css";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
import axios from "axios";
import TimeTable from "./Timetable";


function Docbooking() {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [gmail,setgmail] = useState('')
    const [college,setclg] = useState('')
    const [slots,setslots] = useState([])
    useEffect(() => {
        // Set current date
        const date = new Date();
        const month = date.getMonth() + 1;
        setCurrentDate(`${date.getFullYear()}-${month}-${date.getDate()}`);

        // Update time every second
        const timeInterval = setInterval(() => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const meridiem = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12; // Adjust hours for 12-hour format
            const formattedTime = [
                hours.toString().padStart(2, "0"),
                minutes.toString().padStart(2, "0"),
                seconds.toString().padStart(2, "0"),
            ].join(".");

            setCurrentTime(`${formattedTime} ${meridiem}`);
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);
    useEffect(() => {
        const userDetails = Cookies.get('userdetails');
        const token = Cookies.get('Uid1');
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
        async function fetchDoctorSlots() {
            if (!gmail) {
                console.warn("No Gmail provided, skipping slots fetch.");
                return;
            }
    
            try {
                console.log("Fetching slots for doctor:", gmail);
    
                const response = await axios.post('http://localhost:3020/getslotsdoc', { gmail });
                
                if (response.data && response.data.slots) {
                    setslots(response.data.slots); // Assuming setSlots sets the slots in state
                    console.log("Slots fetched successfully:", response.data.slots);
                } else {
                    console.error("Slots not found in response.");
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        }
    
        fetchDoctorSlots();
    }, [gmail]);

    // Toggle dropdown visibility
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.matches('.dropbtn')) {
                setDropdownVisible(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div >
            <div className="dbnonnavbar" style={{ marginLeft: "0%", zIndex: "-20" }}>
                <div className="dbhornav">
                    <div className="dbsessions" style={{ marginTop: "2%" }}>
                        <div className="dbtextpart1">
                            <div className="dbtextdiv"style={{margin: "0" , padding: "0"}} >
                                <p id="db"style={{ margin: "0",fontSize: "30px",color:"snow"  }}></p>
                                <p id="db"style={{margin: "0", fontSize: "40px",color:"snow" }}>Slots</p>
                            </div>
                            <div className="dbimgdiv">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-plus" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
                                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="dbdates">
                        <div className="dbtext">
                            <div className="dbdate" style={{margin: "0" , padding: "0"}}>
                                <p id="dbdate" style={{margin: "0" , textAlign: "end", color:"#0A7273",fontSize:"30px" }}>{currentDate}</p>
                                <p id="dbtime" style={{margin: "0" ,marginBottom:"0",color:"#0A7273" ,fontSize:"30px"}}>{currentTime}</p>
                            </div>
                            <div className="dbicon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                                    <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

             
               
                <div className="dbmainbody1" style={{position:'relative'}}>
                <TimeTable availableSlots={slots}/>
                </div>
            </div>
        </div>
    );
}

export default Docbooking;