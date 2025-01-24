import { useState,useEffect } from "react";
import axios from 'axios';
function Mainbody(props){
    const [showDropdown, setShowDropdown] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    const handleButtonClick = () => {
      setShowDropdown(!showDropdown);
    };
    async function handleapply(e){
        e.preventDefault();
       try {
          const response = await axios.post("http://localhost:3020/applyleave" , {
            email : props.email,
            data : props.det,
            startDate:startDate,
            endDate:endDate
          }, {withCredentials:true})
          console.log(response.data)
       } catch (error) {
        
       }
    }
    return (
        <div className="SCHmainbody"  style={{marginBottom:showDropdown?"170px":"100px"}}>
        <div></div>
        <div className="SCHfirstpart" >
            <div className="SCHtextpart1">
                <p id="SCH">Booking Date: {new Date(props.det.created).getDate()+'-'+(new Date(props.det.created).getMonth()+1)+'-'+new Date(props.det.created).getFullYear()}</p>
                <p id="SCH">Session No: {props.no+1}</p>
                <p id="SCH">Scheduled at: {new Date(props.det.date).getDate()+'-'+(new Date(props.det.date).getMonth()+1)+'-'+new Date(props.det.date).getFullYear()}</p>
            </div>
            <div className="SCHtextpart2">
                <p id="SCH">Status: <span id="SCHstatus">Completed</span></p>
            </div>
        </div>
        <div className="SCHsecondpart2">
            <div className="SCHdescription1" style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                <p style={{fontSize:"20px",marginBottom:"0",marginTop:"0",paddingLeft:'20px'}}>Description by student:{props.det.description}</p>
                <div>
                <button style={{width:'210px',fontSize: '22px',fontWeight: '32px',cursor:'pointer',backgroundColor:'#0A7273',color:'white' , borderRadius:'10px'} } onClick={handleButtonClick}>medical leave</button>
                {showDropdown && (
        <div
          style={{
            marginLeft:'20px',
            marginTop: '10px',
            height:"60%",
            width:"70%",
            backgroundColor: '#f1f1f1',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <form  onSubmit={handleapply}>
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
            <button type="submit" style={{width:'100px',fontSize: '18px',fontWeight: '32px',cursor:'pointer',backgroundColor:'#0A7273',color:'white' , borderRadius:'10px'} }>Apply leave</button>

          </form>
        </div>
      )}
                </div>
            </div>


        </div>
    </div>
    )
}

export default  Mainbody