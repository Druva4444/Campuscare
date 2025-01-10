function Mainbody(props){
    return (
        <div className="SCHmainbody" style={{ marginTop: "105px"}}>
        <div className="SCHfirstpart">
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
                <button style={{width:'210px',fontSize: '32px',fontWeight: '32px',cursor:'pointer',backgroundColor:'#0A7273',color:'white'}}>medical leave</button>
            </div>

        </div>
    </div>
    )
}

export default  Mainbody