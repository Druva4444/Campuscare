import { useState,useEffect } from "react";
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios'
import { useJwt,decodeToken } from "react-jwt";
import './Leaves.css'
import { useNavigate } from "react-router-dom";
function Leaves (){
  const[gmail,setgmail] = useState(null);
  const[leaves,setLeaves] =useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchleaves = async()=>{
        const userdetails = Cookies.get('userdetails');
        const token = Cookies.get('uid1');
        let email = null;
        if(userdetails){
            const parsedDetails = JSON.parse(userdetails);
            email = parsedDetails.gmail;
            setgmail(email)
        }
        else if(token){
            try {
                const decoded = decodeToken(token);
                email = decoded.gmail;
                setgmail(email)
            } catch (error) {
                console.log("token validation error" , error);
            }
        }
        if (email) {
         try {
            console.log(email);
            const response = await axios.get('http://localhost:3020/leaves2' , {params:{email}});
            if (response.status ===200) {
                setLeaves(response.data)
                console.log(response.data)
            }
            else{
                console.log(response.data.message);
            }
         } catch (error) {
            console.log("error fetching leave details");
         }
        }
    }; fetchleaves();
  },[])
  async function updateLeaveStatus(leaveid, message) {
    console.log(message + leaveid);
    console.log(gmail);

    try {
        const response = await axios.post("http://localhost:3020/modifyleaves", { leaveid, message });
        if (response.status === 200) {
            console.log(response.data);
            
            
            setLeaves(prevLeaves =>{
               return prevLeaves.map(leave =>
                    leave._id === leaveid ? { ...leave, status: message } : leave
                )}
            );
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

  const pendingLeaves = leaves.filter((leave)=> leave.status ==='pending');
  const completedLeaves = leaves.filter((leave)=>leave.status==='success');
  const rejectedLeaves = leaves.filter((leave)=>leave.status === "rejected");
  return(
    <div className="leaveSecondPart">
      <h1 className="leaveSecondHeader">Leave Details</h1>

      <section className="leaveMainBody">
        <h2 className="leaveFirstPart">Pending Leaves</h2>
        {pendingLeaves.length > 0 ? (
          <ul className="leaveDescription1">
           {pendingLeaves.map((leave) => (
  <li key={leave.id} className="leaveDescription2">
      <div style={{display:"flex" , flexDirection:'column' , width:'80%'}}>
      <div style={{ 
    display: "flex", 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "120%" 
}}>
    <span>Student email: {leave.email}</span>
    <button className="doctorleave-button accept" onClick={() => updateLeaveStatus(leave._id, "success")}>
        Accept
    </button>
</div>

<div style={{ 
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "120%" 
}}>
    <span>
        Leave Request from: {new Date(leave.startdate).toLocaleDateString("en-GB")} 
        to {new Date(leave.enddate).toLocaleDateString("en-GB")}
    </span>
    <button className="doctorleave-button reject" onClick={() => updateLeaveStatus(leave._id, "rejected")}>
        Reject
    </button>
</div>

       </div>
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
     <div style={{display:"flex" , flexDirection:'column' , width:'80%'}}>
     <div style={{ 
   display: "flex", 
   flexDirection: 'row', 
   justifyContent: 'space-between',
   alignItems: 'center',
   width: "120%" 
}}>
   <span>Student email: {leave.email}</span>
  
</div>

<div style={{ 
   display: "flex", 
   flexDirection: "row", 
   justifyContent: "space-between", 
   alignItems: "center", 
   width: "120%" 
}}>
   <span>
       Leave Request from: {new Date(leave.startdate).toLocaleDateString("en-GB")} 
       to {new Date(leave.enddate).toLocaleDateString("en-GB")}
   </span>
   
</div>

      </div>
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
     <div style={{display:"flex" , flexDirection:'column' , width:'80%'}}>
     <div style={{ 
   display: "flex", 
   flexDirection: 'row', 
   justifyContent: 'space-between',
   alignItems: 'center',
   width: "120%" 
}}>
   <span>Student email: {leave.email}</span>
   <button className="doctorleave-button accept" onClick={() => updateLeaveStatus(leave._id, "success")}>
       Accept
   </button>
</div>

<div style={{ 
   display: "flex", 
   flexDirection: "row", 
   justifyContent: "space-between", 
   alignItems: "center", 
   width: "120%" 
}}>
   <span>
       Leave Request from: {new Date(leave.startdate).toLocaleDateString("en-GB")} 
       to {new Date(leave.enddate).toLocaleDateString("en-GB")}
   </span>
   
</div>

      </div>
 </li>
))}

         </ul>
        ) : (
          <p>No rejected leaves.</p>
        )}
      </section>
    </div>
  )

}
export default Leaves;
