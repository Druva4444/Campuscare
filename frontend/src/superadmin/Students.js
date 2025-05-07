import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
function Students() {
  const [studentsData, setStudentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [selectedStudentAppointments, setSelectedStudentAppointments] = useState(null);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [gmail,setgmail] =useState('');
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
  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getstudents`, { withCredentials: true });
      setStudentsData(response.data.students);
      console.log('inside fetching')
      console.log(response.data.students)
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  const fetchSearchedStudents = async (query) => {
    try {
      if (query.trim() === '') {
        fetchAllStudents();
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/searchstudent?query=${query}`, { withCredentials: true });
      setStudentsData(response.data.students);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSearchedStudents(query);
  };

  const handleStudentClick = async (gmail) => {
    if (selectedStudentEmail === gmail) {
      // If clicked again on the same student, unselect
      setSelectedStudentEmail(null);
      setSelectedStudentAppointments(null);
    } else {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getappointments?email=${gmail}`, { withCredentials: true });
        const appointments = response.data.data; // assume this is an array of appointments
        console.log(appointments)
        const now = new Date();
  
    
        const upcoming = [];
        const completed = [];
        console.log(Array.isArray(appointments)); 
        appointments.forEach(appt => {
          const appointmentDate = new Date(appt.date);
          if (appointmentDate >= now) {
            upcoming.push(appt);
          } else {
            completed.push(appt);
          }
        });
  
        setSelectedStudentAppointments({ upcoming, completed });
        setSelectedStudentEmail(gmail);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
  };
  

  return (
    <div className="nonnavbar1">
      <div className="hornav1" style={{ marginTop: '0', width: '72%' }}>
        <div className="sessions1" style={{ marginTop: '4%' }}>
          <div className="textpart12">
            <div className="textdiv">
              <p style={{ fontSize: '30px', marginBottom: '0' }}>Students List</p>
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
      <div className="students-search">
        <input
          type="text"
          placeholder="Search students by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '20%',
            marginTop: "3%",
            marginLeft: '17%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #0A7273',
            outline: 'none',
            marginBottom: '20px',
          }}
        />
      </div>

      {/* Students List */}
      <div className="students-list">
        {studentsData.length > 0 ? (
          studentsData.map((student, idx) => (
            <div key={idx}>
              <div
                onClick={() => handleStudentClick(student.gmail)}
                className="student-card"
                style={{
                  marginLeft: "20%",
                  width: "70%",
                  border: '1px solid black',
                  borderRadius: '15px',
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: selectedStudentEmail === student.gmail ? '#DFF6F5' : 'whitesmoke',
                  color: '#0A7273',
                  boxShadow: '5px 5px 15px #bebebe, -5px -5px 15px #ffffff',
                  cursor: 'pointer',
                }}
              >
                <p><strong>Email:</strong> {student.gmail}</p>
                <p><strong>College:</strong> {student.college}</p>
              </div>

              {/* Show appointments if this student is selected */}
              {selectedStudentEmail === student.gmail && selectedStudentAppointments && (
                <div style={{ marginLeft: '22%', marginBottom: '20px', width: '66%' }}>
                  {/* Upcoming Appointments */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#0A7273' }}>Upcoming Appointments:</h3>
                    {selectedStudentAppointments.upcoming && selectedStudentAppointments.upcoming.length > 0 ? (
                      selectedStudentAppointments.upcoming.map((appt, index) => (
                        <div key={index} style={{ padding: '10px', border: '1px solid #0A7273', borderRadius: '10px', marginBottom: '10px', backgroundColor: '#E9F7EF' }}>
                          <p><strong>Date:</strong> {appt.date}</p>
                          <p><strong>Time:</strong> {appt.time}</p>
                          <p><strong>Doctor:</strong> {appt.doctor}</p>
                        </div>
                      ))
                    ) : (
                      <p>No upcoming appointments.</p>
                    )}
                  </div>

                  {/* Completed Appointments */}
                  <div>
                    <h3 style={{ color: '#0A7273' }}>Completed Appointments:</h3>
                    {selectedStudentAppointments.completed && selectedStudentAppointments.completed.length > 0 ? (
                      selectedStudentAppointments.completed.map((appt, index) => (
                        <div key={index} style={{ padding: '10px', border: '1px solid #0A7273', borderRadius: '10px', marginBottom: '10px', backgroundColor: '#F9EBEA' }}>
                          <p><strong>Date:</strong> {appt.date}</p>
                          <p><strong>Doctor:</strong> {appt.doctor}</p>
                        </div>
                      ))
                    ) : (
                      <p>No completed appointments.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#0A7273' }}>No students found.</p>
        )}
      </div>
    </div>
  );
}

export default Students;
