import './acccollege.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function AccCollege() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [colleges, setcolleges] = useState([])
  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      setCurrentDate(date.toLocaleDateString());
      setCurrentTime(date.toLocaleTimeString());
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);
  async function fetchColleges() {
    const response = await fetch('http://localhost:3020/waitingclgs');
    const data =await response.json();
    console.log(data.clgs);
    setcolleges(data.clgs);
    
  }
  useEffect(() => {
    fetchColleges();
  }, [])
  const handleAccept=async(id , email ,password, name)=>{
    console.log(id,email)
     await axios.post(`http://localhost:3020/acceptclgreq/${id}/${email}/${password}/${name}`).then((response)=>{
        if (response.ok) {
          alert("accepted Successfully")
          fetchColleges();
        }
     });
  }
  const handleDelete=async (id,email)=>{
    console.log(id,email)
     await axios.post(`http://localhost:3020/deleteclgreq/${id}/${email}`).then((response)=>{
           fetchColleges()
     });
  }
  // if (colleges.length===0) {
  //   return <p>no clgs available</p>
  // }
  return (
    <div className="addclg-nonnavbar16">
      <div className="addclg-hornav16" style={{ marginTop: '0' }}>
        <div className="addclg-sessions16">
          <div className="addclg-textpart126">
            <div className="addclg-textdiv16">
              <p style={{ fontSize: '30px', marginBottom: '0' }}>Requests</p>
            </div>

            <div className="addclg-imgdiv16">
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

        <div className="addclg-dates16">
          <div className="addclg-text16">
            <div className="addclg-date16" style={{ margin: '0' }}>
              <p id="date" style={{ textAlign: 'end', margin: '0' }}>{currentDate}</p>
              <p id="time" style={{ margin: '0' }}>{currentTime}</p>
            </div>
            <div className="addclg-icon16">
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
      {colleges.map((college) => (
  <div className="addclg-mainbody16" style={{ marginLeft: '22%' }} key={college._id}> 
    <div className="addclg-collegeName">
      <p>{college.name}</p> {/* Display college name here */}
    </div>

    <div className="addclg-details">
      <p>No. of Students: {college.noOfStudents}</p>
      <p>No. of Doctors: {college.noOfDoctors}</p>
      <p>Plan Expires: {new Date(college.plan).toLocaleDateString()}</p>
      <p>Admin email : {college.credentials[0].email}</p>
    </div>
    <div className="addclg-details">
      <p>Amount: {college.amount}</p> 
      <p>Domain: {college.domain}</p>
      <span>Fields: </span>
      {college.fields.map((field)=>(
        <span>{field +"  ,"}</span>
      ))}
    </div>

    <div className="addclg-actions">
      <button
        className="addclg-acceptBtn"
        style={{
          marginRight: "10px",
          backgroundColor: "#0A7273",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
        onClick={() => handleAccept(college._id ,college.credentials[0].email,college.credentials[0].password,college.name )} // Call accept function here
      >
        Accept
      </button>
      <button
        className="addclg-deleteBtn"
        style={{
          backgroundColor: "#0A7273",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
        onClick={() => handleDelete(college._id , college.credentials[0].email )} // Call delete function here
      >
        Delete
      </button>
    </div>
  </div>
))}


    </div>
  );
}

export default AccCollege;
