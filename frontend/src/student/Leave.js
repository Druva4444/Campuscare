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
  const [filterEmail, setFilterEmail] = useState("");
const [filterStartDate, setFilterStartDate] = useState("");
const [filterEndDate, setFilterEndDate] = useState("");
const [sortOrder, setSortOrder] = useState("newest");

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/leaves` , {params:{email}} );
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
const filterLeaves = (leaves) => {
  const filtered = leaves.filter((leave) => {
    const matchesEmail = filterEmail === "" || leave.doctoremail.includes(filterEmail);
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


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const pendingLeaves = filterLeaves(leaves.filter((leave) => leave.status === "pending"));
  const completedLeaves = filterLeaves(leaves.filter((leave) => leave.status === "success"));
  const rejectedLeaves = filterLeaves(leaves.filter((leave) => leave.status === "rejected"));
  
  return (
    <div className="leaveSecondPart">
      <h1 className="leaveSecondHeader">Leave Details</h1>

      <section className="leaveMainBody">
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="Doctor Email"
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
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="Doctor Email"
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
      <div className="leaveFilters">
  <input
    type="text"
    placeholder="Doctor Email"
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
