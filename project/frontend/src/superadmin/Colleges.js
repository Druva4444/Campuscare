import { useState, useEffect } from 'react';
import './Colleges.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Colleges() {
  const [collegesData, setCollegesData] = useState([]);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [collapsedStates, setCollapsedStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        const response = await axios.get('http://localhost:3020/getcollege', { withCredentials: true });
        console.log(response.data);
        setCollegesData(response.data.colleges);
      } catch (error) {
        console.error('Error fetching college data:', error);
      }
    };

    fetchCollegeData();
  }, []);

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

  const toggleCollapse = (index) => {
    setCollapsedStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const handleDeleteCollege = async (event, collegeId) => {
    event.preventDefault();
    console.log(collegeId);
    try {
      const response = await axios.post('http://localhost:3020/deletecollege', { collegeId }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log(response.data.message);
      setCollegesData((prevData) => prevData.filter((college) => college.college._id !== collegeId));
    } catch (error) {
      console.error('Error deleting college:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="nonnavbar1">
      <div className="hornav1" style={{ marginTop: '0', width: '72%' }}>
        <div className="sessions1" style={{ marginTop: '4%' }}>
          <div className="textpart12">
            <div className="textdiv">
              <p style={{ fontSize: '30px', marginBottom: '0' }}>Colleges List</p>
            </div>
            <div className="imgdiv1">
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
        <div className="dates1">
          <div className="text1" style={{ margin: '0' }}>
            <div className="date1" style={{ marginTop: '4%', padding: '0' }}>
              <p id="date" style={{ textAlign: 'end', margin: '0' }}>{date}</p>
              <p id="time" style={{ margin: '0' }}>{time}</p>
            </div>
            <div className="icon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
          
        </div>
      </div>

      <div>
        {collegesData.map((collegeData, index) => (
          <div className="mm" key={index}>
            <div
              className="mainbody1"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleCollapse(index)}
            >
              <div className="userdet1">
                <p>{collegeData.college.name}</p>
              </div>
              <div className="ug1">
                <p>{collegeData.college.fields}</p>
              </div>
              <div className="history1">
                <form
                  onSubmit={(e) => handleDeleteCollege(e, collegeData.college._id)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    id="delete"
                    type="submit"
                    style={{
                      width: '150%',
                      backgroundColor: '#0A7273',
                      color: 'white',
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>

            {collapsedStates[index] && (
              <div className="sec1">
                {/* Doctors Section */}
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    fontSize: '25px',
                    color: '#0A7273',
                  }}>Doctors:</p>
                {collegeData.doctors.map((doctor, idx) => (
                  <div key={idx} className="subdiv" style={{
                    border: '1px solid black',
                    borderRadius: '120px',
                    paddingLeft: '10px',
                    marginTop: '10px',
                    marginLeft: 'auto',
                    width: '90%',
                    marginRight: 'auto',
                    padding: '10px',
                    backgroundColor: 'whitesmoke',
                    color: '#0A7273',
                    boxShadow:
                      '10px 10px 36px #bebebe, -10px -10px 36px #ffffff',
                  }}>
                    <p>Doctor Gmail: {doctor.gmail}</p>
                    <p>Doctor Fields: {doctor.fields}</p>
                  </div>
                ))}

                {/* Students Section */}
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    fontSize: '25px',
                    color: '#0A7273',
                  }}>Students:</p>
                {collegeData.students.map((student, idx) => (
                  <div key={idx} className="subdiv" style={{
                    border: '1px solid black',
                    borderRadius: '120px',
                    paddingLeft: '10px',
                    marginTop: '10px',
                    marginLeft: 'auto',
                    width: '90%',
                    marginRight: 'auto',
                    padding: '10px',
                    backgroundColor: 'whitesmoke',
                    color: '#0A7273',
                    boxShadow:
                      '10px 10px 36px #bebebe, -10px -10px 36px #ffffff',
                  }}>
                    <p>Student Name: {student.gmail}</p>
                  </div>
                ))}

                {/* Completed Appointments */}
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    fontSize: '25px',
                    color: '#0A7273',
                  }}>Completed Appointments:</p>
                {collegeData.completedAppointments.map((appointment, idx) => (
                  <div key={idx} className="subdiv"style={{
                    border: '1px solid black',
                    borderRadius: '120px',
                    paddingLeft: '10px',
                    marginTop: '10px',
                    marginLeft: 'auto',
                    width: '90%',
                    marginRight: 'auto',
                    padding: '10px',
                    backgroundColor: 'whitesmoke',
                    color: '#0A7273',
                    boxShadow:
                      '10px 10px 36px #bebebe, -10px -10px 36px #ffffff',
                  }}>
                    <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                    <p>Description: {appointment.description}</p>
                  </div>
                ))}

                {/* Upcoming Appointments */}
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    fontSize: '25px',
                    color: '#0A7273',
                  }}>Upcoming Appointments:</p>
                {collegeData.upcomingAppointments.map((appointment, idx) => (
                  <div key={idx} className="subdiv" style={{
                    border: '1px solid black',
                    borderRadius: '120px',
                    paddingLeft: '10px',
                    marginTop: '10px',
                    marginLeft: 'auto',
                    width: '90%',
                    marginRight: 'auto',
                    padding: '10px',
                    backgroundColor: 'whitesmoke',
                    color: '#0A7273',
                    boxShadow:
                      '10px 10px 36px #bebebe, -10px -10px 36px #ffffff',
                  }}>
                    <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                    <p>Description: {appointment.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Colleges;