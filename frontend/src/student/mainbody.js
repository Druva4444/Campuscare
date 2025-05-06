import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";

function Mainbody(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLeaveApplied, setIsLeaveApplied] = useState(false); 
     const [leaves, setLeaves] = useState([]);
     const [email, setEmail] = useState('');

    useEffect(()=>{
        const fetchleaves = async()=>{
            const userDetails = Cookies.get('userdetails');
            const token = Cookies.get('Uid2');
            let email = null;
            if(userDetails){
                const parsedDetails = JSON.parse(userDetails);
                email = parsedDetails.gmail;
                setEmail(email)
            }
            else if (token) {
               try {
                const decoded = decodeToken(token);
                email = decoded.gmail;
                setEmail(email)
               } catch (error) {
                console.log("token validation failed" , error)
               }
            }
            if (email) {
           try {
            console.log(email)
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/leaves` , {params:{email}}, {
              withCredentials: true
            } );
            if(response.status ==200){
                setLeaves(response.data)
                console.log(response.data)
            }
             else{
                console.log(response.data.message)
             }
            } 
           catch (error) {
         console.log("error fetching leave details");
     
        }            
            }
        };
        fetchleaves();
    },[]);
    const handleButtonClick = () => {
        setShowDropdown(!showDropdown);
    };

    async function handleApply(e) {
        e.preventDefault();
        try {
            console.log(email,data,startDate,endDate)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/applyleave`, {
                email: props.email,
                data: props.det,
                startDate: startDate,
                endDate: endDate
            }, { withCredentials: true });

            console.log(response.data);
            setIsLeaveApplied(true); 
        } catch (error) {
            console.error("Error applying leave", error);
        }
    }

    return (
        <div className="SCHmainbody" style={{ marginBottom: showDropdown ? "170px" : "100px" }}>
            <div></div>
            <div className="SCHfirstpart">
                <div className="SCHtextpart1">
                    <p id="SCH">Booking Date: {new Date(props.det.created).getDate() + '-' + (new Date(props.det.created).getMonth() + 1) + '-' + new Date(props.det.created).getFullYear()}</p>
                    <p id="SCH">Session No: {props.no + 1}</p>
                    <p id="SCH">Scheduled at: {new Date(props.det.date).getDate() + '-' + (new Date(props.det.date).getMonth() + 1) + '-' + new Date(props.det.date).getFullYear()}</p>
                </div>
                <div className="SCHtextpart2">
                    <p id="SCH">Status: <span id="SCHstatus">Completed</span></p>
                </div>
            </div>
            <div className="SCHsecondpart2">
                <div className="SCHdescription1" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <p style={{ fontSize: "20px", marginBottom: "0", marginTop: "0", paddingLeft: '20px' }}>Description by student: {props.det.description}</p>
                    <p style={{ fontSize: "20px", marginBottom: "0", marginTop: "0", paddingLeft: '20px' }}>Doctor: {props.det.acceptedby}</p>
                    <div>
                        {!isLeaveApplied &&   !leaves.some(leave => leave.appointmentId === props.det._id) && ( 
                            <button 
                                style={{ width: '210px', fontSize: '22px', cursor: 'pointer', backgroundColor: '#0A7273', color: 'white', borderRadius: '10px' }} 
                                onClick={handleButtonClick}
                            >
                                Medical Leave
                            </button>
                        )}
                        {showDropdown && !isLeaveApplied && (
                            <div style={{ marginLeft: '20px', marginTop: '10px', height: "60%", width: "70%", backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '5px' }}>
                                <form onSubmit={handleApply}>
                                    <label>Start Date: </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{ margin: '10px' }}
                                    />
                                    <br />
                                    <label>End Date: </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{ margin: '10px' }}
                                    />
                                    <button type="submit" style={{ width: '100px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#0A7273', color: 'white', borderRadius: '10px' }}>
                                        Apply Leave
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mainbody;
