import { useState,useEffect } from "react";
import './Homeadmin.css';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useJwt ,decodeToken} from "react-jwt";
function Homeadmin(){
    const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [students, setStudentsCount] = useState([]);
  const [doctors, setDoctorsCount] = useState([]);
  const [upcoming,setupcomig] = useState([])
  const [completed,setcompleted] = useState([])
  const [gmail,setgmail] = useState('')
  const [college,setclg] = useState('')
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    };
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);
useEffect(()=>{
async function y(){
  const userDetails = Cookies.get('userdetails');
  const token = Cookies.get('Uid3'); 
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
}

y()
},[])
useEffect(() => {
  async function fetchData() {
    if (gmail && college) { // Ensure gmail and college are set before making the API call
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/getadminhome`, { gmail, college });
        setDoctorsCount(response.data.doctor || []);
        setStudentsCount(response.data.students || []);
        setupcomig(response.data.upcomingapp)
        setcompleted(response.data.completedapp)
      } catch (error) {
        console.error("Error fetching admin home data:", error);
      }
    }
  }
  fetchData();
}, [gmail, college]); 
    return(
      <div className="nonnavbar231" style={{overflow:'hidden',overflowY:'hidden'}}>
      <div className="hornav231" style={{height:'100px'}}>
        <div className="home31">
          <p style={{ marginLeft: '37.5%', fontSize: '3.5rem' }}>Home</p>
        </div>
        <div className="dates231">
          <div className="text231">
            <div className="date231" style={{margin:'0' ,padding:'0'}}>
              <p id="date31" style={{ textAlign: 'end' , margin:'0' }}>{date}</p>
              <p id="time31" style={{margin:'0'}}>{time}</p>
            </div>
            <div className="icon31" style={{ marginLeft: '10px' }}>
              {/* Calendar icon here */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                        <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                      </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="welcome231">
        <p>
          <span style={{ fontSize: '5rem' }}>Welcome back</span> <br />
          Admin <br />
          Track your Students and Doctors
        </p>
      </div>
    
      {/* Container for Dashboard and Appointments side-by-side */}
      <div className="dashboard-container31">
        <div className="dashboard231" >
          <p style={{ fontSize: '40px', marginBottom:'0'}}>Dashboard</p>
          <div className="schedule231" style={{marginTop:'0'}}>
            <table>
              <thead>
                <tr>
                  <th>No of students</th>
                  <th style={{ borderRadius: '0px 50px 0px 0px' }}>No of doctors</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ borderRadius: '0px 0px 0px 50px' }} id="students">
                    {students.length}
                  </td>
                  <td style={{ borderRadius: '0px 0px 50px 0px' }} id="doctors">
                    {doctors.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="nofi231" style={{marginRight:'100px'}}>
          <div className="sessions231" style={{height:'100px'}}>
            <div className="textpart1231" >
              <div className="textdiv31">
                <p style={{ fontSize: '26px' }} id="comapp">{completed.length}</p>
                <p style={{ fontSize: '24px' }}>Completed Appointments</p>
              </div>
              <div className="imgdiv231">
                {/* Clipboard icon here */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-pulse" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"/>
                          </svg>
              </div>
            </div>
          </div>
    
          <div className="sessions231" style={{height:'100px'}}>
            <div className="textpart1231">
              <div className="textdiv31">
                <p style={{ fontSize: '26px' }} id="upcomapp">{upcoming.length}</p>
                <p style={{ fontSize: '24px' }}>Upcoming Appointments</p>
              </div>
              <div className="imgdiv231">
                {/* Clipboard icon here */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-pulse" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"/>
                              </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    );
};
export default Homeadmin;