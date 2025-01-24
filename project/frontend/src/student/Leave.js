import React, { useState, useEffect } from "react";
import axios from "axios";
import './Leave.css'
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";
const LeaveDetails = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email,setEmail]  = useState(null);
  
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
        const response = await axios.get("http://localhost:3020/leaves" , {params:{email}} );
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
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const pendingLeaves = leaves.filter((leave) => leave.status === "pending");
  const completedLeaves = leaves.filter((leave) => leave.status === "success");
  const rejectedLeaves = leaves.filter((leave) => leave.status === "Rejected");

  return (
    <div className="leaveSecondPart">
      <h1 className="leaveSecondHeader">Leave Details</h1>

      <section className="leaveMainBody">
        <h2 className="leaveFirstPart">Pending Leaves</h2>
        {pendingLeaves.length > 0 ? (
          <ul className="leaveDescription1">
           {pendingLeaves.map((leave) => (
  <li key={leave.id} className="leaveDescription2">
       <div>Doctor name :{leave.doctoremail}  </div>
       <div> Leave from :{new Date(leave.startdate).toLocaleDateString("en-GB")} to {new Date(leave.enddate).toLocaleDateString("en-GB")}</div>
  </li>
))}

          </ul>
        ) : (
          <p>No pending leaves.</p>
        )}
      </section>

      <section className="leaveMainBody">
        <h2 className="leaveFirstPart">Completed Leaves</h2>
        {completedLeaves.length > 0 ? (
          <ul className="leaveDescription1">
             {completedLeaves.map((leave) => (
  <li key={leave.id} className="leaveDescription2">
       <div>Doctor name :{leave.doctoremail}  </div>
       <div> Leave from :{new Date(leave.startdate).toLocaleDateString("en-GB")} to {new Date(leave.enddate).toLocaleDateString("en-GB")}</div>
  </li>
))}
          </ul>
        ) : (
          <p>No Accepted leaves.</p>
        )}
      </section>

      <section className="leaveMainBody">
        <h2 className="leaveFirstPart">Rejected Leaves</h2>
        {rejectedLeaves.length > 0 ? (
          <ul className="leaveDescription1">
            {rejectedLeaves.map((leave) => (
       <li key={leave.id} className="leaveDescription2">
       <div>Doctor name :{leave.doctoremail}  </div>
       <div> Leave from :{new Date(leave.startdate).toLocaleDateString("en-GB")} to {new Date(leave.enddate).toLocaleDateString("en-GB")}</div>
     </li>
     ))}
          </ul>
        ) : (
          <p>No rejected leaves.</p>
        )}
      </section>
    </div>
  );
};

export default LeaveDetails;
