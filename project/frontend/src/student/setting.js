import React, { useState, useEffect } from "react";
import "./setting.css";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
function Set() {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [showReportInput, setShowReportInput] = useState(false);
    const [report,setreport] = useState('')
    const [email,setemail] = useState('')
    const [college,setclg] = useState('')
    const navigate = useNavigate()
    const submit = async (event) => {
        event.preventDefault();
        console.log(report)
        try {
            const response = await axios.post('http://localhost:3020/postreport', {
                report,
                email,
                college
            });
    
            if (response.data.msg === 'succesfull') {
                alert('Report sent');
                // Simulate a click on the div with ID 'x'
                const divElement = document.getElementById('SETrap');
                if (divElement) {
                    divElement.click();
                } else {
                    console.error("Div with ID 'x' not found");
                }
            } else {
                alert('Some error occurred');
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            alert('Failed to submit the report. Please try again.');
        }
    };
    useEffect(()=>{  const userDetails = Cookies.get('userdetails');
        const token = Cookies.get('Uid1');
        let email = null;
    
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          email = parsedDetails.gmail;
          setemail(email)
          setclg(parsedDetails.college)
        } else if (token) {
          try {
            const decoded = decodeToken(token);
            email = decoded.gmail;
            setemail(email)
            setclg(decoded.college)
          } catch (error) {
            console.error("Token verification failed:", error);
          }
        }},[])
    
    // Set current date when the component is mounted
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const formattedDate= `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;

        setCurrentDate(formattedDate);
    }, []);

    // Display current time and update it every second
    useEffect(() => {
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
        return () => clearInterval(timeInterval); // Cleanup the interval on component unmount
    }, []);

    // Handlers
    const handleReportClick = () => {
        setShowReportInput(!showReportInput);
    };

    const handleChangePasswordClick = () => {
        navigate('/newpasswordstu',{state:{email,loc:'fromset'}})
    };

    return (
        <div >
        
            <div className="SETnonnavbar">
                <div className="SETheader">
                    <div className="SETheading" style={{marginTop:"0"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="SETbi bi-gear-fill" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                        <p style={{ fontSize: "2.7rem", marginLeft: "15px", marginTop: "0%", marginBottom: "0px" }}>Settings</p>
                    </div>

                    <div className="SETdate" style={{ marginTop: "4%", margin: "0", padding: "0" }}>
                        <p id="SETdate" style={{ textAlign: "end", margin: "0",marginRight:"40px" }}>{currentDate}</p>
                        <p id="SETtime" style={{ margin: "0",marginRight:"40px" }}>{currentTime}</p>
                        <div className="SETcalendar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="SETbi bi-calendar-check" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="SETmainbody">
                    <div className="SETdiv1" id="SETcp" onClick={handleChangePasswordClick}>
                        <p id="D1">Change Password</p>
                    </div>

                    <div className="SETdiv3" id="SETrap" onClick={handleReportClick}>
                        <p id="D1">Report a Problem</p>
                    </div>

                    
                    <div className="dseti" style={{ width: "90%" }}>
                        {showReportInput && (
                            <form style={{ height:"30%", width:"87%",marginLeft:"38px"}} id="dsetform" >
                                <input
                                    type="text"
                                    style={{ width: "100%", height: "100px", fontSize: "15px",marginTop:"-35px"}}
                                    name="content"
                                    placeholder="Describe the problem" onChange={(event)=>{setreport(event.target.value)}}
                                />
                                <button id="send" style={{marginLeft:"25%",height:'40px'}}type="submit"  onClick={submit}>Send</button>
                            </form>
                        )}
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default Set;