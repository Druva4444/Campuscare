import { useEffect, useState } from 'react';
import './Patientsadmins.css';
import { useNavigate } from 'react-router-dom';
import Mainbody from './Mainbody';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useJwt ,decodeToken} from "react-jwt"; 

function Doctorsadmin() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [students, setStudentsCount] = useState([]);
  const [doctors, setDoctorsCount] = useState([]);
  const [upcoming,setupcomig] = useState([])
  const [completed,setcompleted] = useState([])
  const [gmail,setgmail] = useState('')
  const [college,setclg] = useState('')
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState(false);

  const toggleCollapsible = () => {
    setIsCollapsibleVisible(!isCollapsibleVisible);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    };
    updateDateTime();
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
            const response = await axios.post('http://localhost:3020/getadminhome', { gmail, college });
            setDoctorsCount(response.data.doctor || []);
            setStudentsCount(response.data.students || []);
            setupcomig(response.data.upcomiapp1)
            setcompleted(response.data.accapp1)
          } catch (error) {
            console.error("Error fetching admin home data:", error);
          }
        }
      }
      fetchData();
    }, [gmail, college]); 
    const handleUpload = async (event) => {
      event.preventDefault();
  
      if (!file) {
        setMessage('Please select a file!');
        return;
      }
  
      const formData = new FormData();
      formData.append('json1', file);
      formData.append('college', college);
  
      try {
        const response = await axios.post('http://localhost:3020/doctorupload', formData  );
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage(error.response?.data?.message || 'Something went wrong!');
      }
    };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/adddoctor',{state:{college}});
  };

  return (
    <div className="nonnavbar340" style={{ overflowY: 'auto' }}>
      <div className="hornav340">
        <div className="sessions340" style={{ marginTop: '2%' }}>
          <div className="textpart1340">
            <div className="textdiv40">
              <p style={{ fontSize: '30px' }}>Doctors List</p>
            </div>
            <div className="imgdiv340">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="dates40">
          <div className="text340">
            <div className="date340" style={{ textAlign: 'end',  margin:'0' , padding:'0'}}>
              <p id="date" style={{margin:'0'}}>{date}</p>
              <p id="time" style={{margin:'0'}}>{time}</p>
            </div>
            <div className="icon40">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <button
          id="addpatient"
          type="submit"
          style={{
            marginTop: '50px',
            width: '10%',
            backgroundColor: '#0A7273',
            color: 'white',
            marginLeft: '350px',
          }}
        >
          Add Doctor
        </button>
      </form>
      <form method="post" encType="multipart/form-data" style={{ display: 'flex', justifyContent: 'center',alignItems:'center'}} onSubmit={handleUpload} >
        <input
          type="file"
          name="json1"
          style={{ marginLeft: '30%',  }}
          onChange={handleFileChange}
        />
        <button
          id="addpatient140"
          type="submit"
          style={{
            width: 'auto',
            backgroundColor: '#0A7273',
            color: 'white',
            marginRight:'30%'
          }}
        >
          Upload JSON File
        </button>
      </form>
      {doctors.map((student,index)=><Mainbody key={index} appointments={completed[index]} std ={student} upcoming={upcoming[index]} role='doctor'/>)}
    </div>
  )
}
export default Doctorsadmin;