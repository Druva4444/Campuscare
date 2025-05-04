import axios from 'axios'
function Scmain(props){
   async function handledelete(event){
    event.preventDefault(); 
     await   axios.post(`${process.env.REACT_APP_API_URL}/dltapp`,{id:props.det._id,acceptedby:props.det.acceptedby}).then((response)=>{
        alert(response.data)
     })
    }
    return (<div className="dsmainbody" style={{marginTop:"100px"}}>
        <form className="dsform" >
            <div className="dsheader1">
                <p id="ds" >Email : {props.det.createdy}</p>
            </div>
            <div className="dsSt">
                <p id="ds"style={{ fontSize:"25px",marginLeft: "8%" }}>Schedule Date : {new Date(props.det.date).getDate()+'-'+(new Date(props.det.date).getMonth()+1)+'-'+new Date(props.det.date).getFullYear()}</p>
                <p id="ds"style={{ fontSize:"25px" ,marginRight: "8%" }}>Scheduled time : {props.det.time}</p>
               
            </div>
            <p style={{ fontSize:"25px",marginLeft: "8%" }}> description :{props.det.description}</p>
            <input type="hidden" value={props.det._id} name="id" />
            <input type="hidden" value={props.det.acceptedby} name="acceptedby" />
            <div className="dsbutt">
                <button className="mainbut" type="submit" onClick={handledelete}>Cancel Appointment</button>
            </div>
        </form>
    </div>)
}
export default Scmain