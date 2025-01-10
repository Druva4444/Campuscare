import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
function NonNavbar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [colleges, setColleges] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [amount,setAmount]=useState(5000);


  useEffect(() => {
    function handletime() {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }
    handletime();
    const timer = setInterval(handletime, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchhomedata = async () => {
        try {
            const response = await axios.get('http://localhost:3020/gethomedata' , { withCredentials: true }); 
            setColleges(response.data.clgs.length);
            setAdmins(response.data.admins.length);
            setCompletedBookings(response.data.completedapp.length);
            setUpcomingBookings(response.data.upcominapp.length);
            setAmount(response.data.amount);
        } catch (error) {
            console.error('Error fetching college count:', error);
        }
    };

    fetchhomedata();
}, []);


  const welcomeStyle = {
    width: '80%',
    height: '35vh',
    marginLeft: '15%',
    marginRight: 'auto',
    marginTop: '4%',
    backgroundImage: "url('/bg7.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: '2%',
  };

  const textStyle = {
    color: 'white',
  };

  return (
    <div className="nonnavbar20">
      <div className="hornav20">
        <div className="home20">
          <p style={{ marginLeft: '55.5%', fontSize: '3.5rem' , color:'#0A7273', margin:'0',padding:'0' }}>Home</p>
        </div>
        <div className="dates20">
          <div className="text20">
            <div className="date20" style={{margin:"0" ,padding:"0"}}>
              <p id="date20" style={{ textAlign: 'end' , margin:"0" }}>{date}</p>
              <p id="time20" style={{ textAlign: 'end' ,margin:"0"}}>{time}</p>
            </div>
            <div className="icon20" style={{ marginLeft: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 0-.708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="welcome20" style={welcomeStyle}>
        <p style={textStyle}>
          <span style={{ color: 'white', fontSize: '5rem' }}>Welcome back</span>
          <br />
          Superadmin <br />
          Track your admins and colleges
        </p>
      </div>
      <div className="dashboard-container20">
        <div className="nofi20">
          <p>Dashboard</p>
          <div className="sessions20">
            <div className="textpart120">
              <div className="textdiv20" style={{margin:"0" ,padding:"0"}}>
                <p style={{ fontSize: '20px', marginTop:"0" , marginBottom:"0" }}>{upcomingBookings}</p>
                <p style={{ fontSize: '20px', marginTop:"0", marginBottom:"0" }}>Upcoming Bookings</p>
              </div>
              <div className="imgdiv20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="sessions20" style={{ marginTop: '2%' }}>
            <div className="textpart120">
              <div className="textdiv20">
                <p style={{ fontSize: '20px' }}>{completedBookings}</p>
                <p style={{ fontSize: '20px' }}>Completed Bookings</p>
              </div>
              <div className="imgdiv20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-pulse-fill" viewBox="0 0 16 16">
                  <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
                  <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard20">
          <table style={{ marginTop: '0%', width: '100%', marginLeft: '8%' }}>
            <thead>
              <tr>
                <th>Colleges</th>
                <th style={{ borderRadius: '0px 50px 0px 0px' }}>Admins</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{colleges}</td>
                <td>{admins}</td>
              </tr>
              
            </tbody>
          </table>
          <div className="textdiv20" style={{ marginLeft:'60px',paddingTop: '10px',marginTop: '20px',backgroundColor:'#0A7273', width:'70%' }}>
  <p style={{
    fontSize: '30px',
    width: '100%',
    marginTop: '10px',
  }}>
    Total Income: ₹ {amount}
  </p>
</div>

        </div>
      </div>
    </div>
  );
}

export default NonNavbar;
