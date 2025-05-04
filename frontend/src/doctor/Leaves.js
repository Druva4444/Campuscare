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
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const filterLeaves = (leaves) => {
    const filtered = leaves.filter((leave) => {
      const matchesEmail = filterEmail === "" || leave.email.includes(filterEmail);
      const matchesStart =
        !filterStartDate || new Date(leave.startdate) >= new Date(filterStartDate);
      const matchesEnd =
        !filterEndDate || new Date(leave.enddate) <= new Date(filterEndDate);
      return matchesEmail && matchesStart && matchesEnd;
    });
  
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.startdate);  // fallback to startdate
      const dateB = new Date(b.createdAt || b.startdate);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  
    return sorted;
  };
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchleaves = async()=>{
      console.log("fetching leaves");
        const userdetails = Cookies.get('userdetails');
        const token = Cookies.get('Uid1');
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
            console.log("fetching leaves12");
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
        else{
          console.log("email not found");
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

const pendingLeaves = filterLeaves(leaves.filter((leave) => leave.status === "pending"));
const completedLeaves = filterLeaves(leaves.filter((leave) => leave.status === "success"));
const rejectedLeaves = filterLeaves(leaves.filter((leave) => leave.status === "rejected"));

  return(
    <div className="leaveSecondPart">
      <h1 className="leaveSecondHeader">Leave Details</h1>

      <section className="leaveMainBody">
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="student Email"
    value={filterEmail}
    onChange={(e) => setFilterEmail(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>start date :</label>
  <input
    type="date"
    value={filterStartDate}
    onChange={(e) => setFilterStartDate(e.target.value)}
    placeholder="Start Date"
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>end date :</label>
  <input
    type="date"
    value={filterEndDate}
    onChange={(e) => setFilterEndDate(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
  <option value="newest">Newest to Oldest</option>
  <option value="oldest">Oldest to Newest</option>
</select>

</div>
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
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="student Email"
    value={filterEmail}
    onChange={(e) => setFilterEmail(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>start date :</label>
  <input
    type="date"
    value={filterStartDate}
    onChange={(e) => setFilterStartDate(e.target.value)}
    placeholder="Start Date"
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>end date :</label>
  <input
    type="date"
    value={filterEndDate}
    onChange={(e) => setFilterEndDate(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
  <option value="newest">Newest to Oldest</option>
  <option value="oldest">Oldest to Newest</option>
</select>

</div>
        <h2 className="leaveFirstPart">Accepted Leaves</h2>
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
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="student Email"
    value={filterEmail}
    onChange={(e) => setFilterEmail(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>start date :</label>
  <input
    type="date"
    value={filterStartDate}
    onChange={(e) => setFilterStartDate(e.target.value)}
    placeholder="Start Date"
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <label>end date :</label>
  <input
    type="date"
    value={filterEndDate}
    onChange={(e) => setFilterEndDate(e.target.value)}
    style={{color:'#0A7273',border:'none',borderRadius:'50px',padding:'10px',width:'200px',backgroundColor:'whitesmoke'}}
  />
  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
  <option value="newest">Newest to Oldest</option>
  <option value="oldest">Oldest to Newest</option>
</select>

</div>
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
