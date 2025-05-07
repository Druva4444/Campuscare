import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
function Students() {
  const [appointments, setappointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
 useEffect(() => {
    const fetchEmail = () => {
      try {
        const userDetails = Cookies.get('userdetails');
  
        if (userDetails) {
          const parsed = JSON.parse(userDetails);
          setgmail(parsed.email);
        } else {
          const token = Cookies.get('Uid4');
          if (token) {
            const decoded = decodeToken(token); // decode without verification
            if (decoded && decoded.email) {
              setgmail(decoded.email);
            } else {
              console.warn("Invalid token structure");
            }
          } else {
            console.warn("No userdetails or token cookie found");
          }
        }
      } catch (err) {
        console.error("Error reading cookies:", err);
      }
    };
  
    fetchEmail();
  }, []);
  const fetchAllapp = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getapp`, { withCredentials: true });
      setappointments(response.data.app);
      console.log('inside fetching')
      console.log(response.data.app)
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };



  useEffect(() => {
    fetchAllapp();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSearchedStudents(query);
  };


  

  return (
    <div className="nonnavbar1">
      <div className="hornav1" style={{ marginTop: '0', width: '72%' }}>
        <div className="sessions1" style={{ marginTop: '4%' }}>
          <div className="textpart12">
            <div className="textdiv">
              <p style={{ fontSize: '30px', marginBottom: '0' }}>appointments </p>
            </div>
            <div className="imgdiv1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="dates1">
          <div className="text1" style={{ margin: '0' }}>
            <div className="date1" style={{ marginTop: '4%', padding: '0' }}>
              <p id="date" style={{ textAlign: 'end', margin: '0' }}>{date}</p>
              <p id="time" style={{ margin: '0' }}>{time}</p>
            </div>
            <div className="icon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      {appointments && appointments.length > 0 ? (
  appointments.map((appt, index) => (
    <div key={index}>
      <p>date : {appt.date.toLocaleDateString()}</p>
      <p> student : {appt.createdy}</p>
      <p> doctor :{appt.acceptedby}</p>
      <p> descrption :{appt.description} </p>
      {/* Add any more appointment fields */}
    </div>
  ))
) : (
  <p>No appointments found.</p>
)}

      
    </div>
  );
}

export default Students;
