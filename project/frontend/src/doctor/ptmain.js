import React, { useState, useEffect } from "react";

function Ptmain(props){
    const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
    return ( <div className="DPmainbody" onClick={toggleDropdown}>
        <div className="DPuserdet" >
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
          
        </div>
        <p id="DP" style={{ margin: "0" }}>Email : {props.det.createdy}</p>
        <p id="DP" style={{ margin: "0" }}>Scheduled on  :{new Date(props.det.date).getDate() +'-'+(new Date(props.det.date).getMonth()+1)+'-'+new Date(props.det.date).getFullYear()}</p>
        {dropdownVisible && (
          <div className="DPdropdown">
         <p>discription : {props.det.description}  </p>
         <p>Appointment created  on : {new Date(props.det.created).getDate() +'-'+(new Date(props.det.created).getMonth()+1)+'-'+new Date(props.det.created).getFullYear()}</p>
          </div>
        )}
      </div>)
}

export default Ptmain