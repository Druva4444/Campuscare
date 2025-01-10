import { useState } from "react";
import Subbody from "./Subbody";
import axios from 'axios'
import { useActionData } from "react-router-dom";
function Mainbody(props){
    const [isCollapsibleVisible, setIsCollapsibleVisible] = useState(false);
    const toggleCollapsible = () => {
        setIsCollapsibleVisible(!isCollapsibleVisible);
      };
      const [msg,setmsg] = useState('')
      
      async function handledelete(event){
        event.preventDefault()
        await axios.post('http://localhost:3020/deletepd',{id:props.std._id,role:props.role}).then((response)=>{setmsg(response.data.msg)
           alert(response.data.msg)})
        
      
      }
return (
    <div>
    {/* Main Body */}
    <div className="mainbody1240" onClick={toggleCollapsible} >
      <div className="userdet1240">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-person-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
        <p>{props.std.gmail}</p>
      </div>
      <div className="ug40">
        <p>{props.std.gmail.split('@')[0]}</p>
      </div>
      <div className="history40">
        <form  method="post" onSubmit={handledelete}>
          <input type="hidden" name="userId" value={props.std._id} />
          <button

            type="submit"
            style={{ width: '150%', backgroundColor: '#0A7273', color: 'white' }}
          >
            Delete
          </button>
        </form>
      </div>
    </div>

    
    <div
      className="collapsible"
      style={{
        display: isCollapsibleVisible ? 'block' : 'none',
        border: '1px solid grey',
        paddingTop: '10px',
        fontSize: '20px',
        width: '70%',
        marginLeft: '22%',
        marginRight: 'auto',
        marginTop: '20px',
        height: '9%',
        borderRadius: '50px',
        paddingLeft: '40px',
        color: '#0A7273',
      }}
    >
        <h1>completed bookings</h1>
        {props.appointments.length > 0 ? (
    props.appointments.map((appointment, index) => (
        <Subbody key={index} app={appointment} upcomig={false} />
    ))
) : (
    <p>No appointments found</p>
)}

        <h1> upcoming bookings</h1>
        {props.upcoming.length > 0 ? (
    props.upcoming.map((appointment, index) => (
        <Subbody key={index} app={appointment} upcomig={true} />
    ))
) : (
    <p>No appointments found</p>
)}
   
    </div>
  </div>
)
}
export default Mainbody