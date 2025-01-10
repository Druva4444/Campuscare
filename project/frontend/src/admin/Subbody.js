import axios from 'axios'
function Subbody(props){
    const date = new Date(props.app.date);
    const date1 = new Date(props.app.created)
    async function handle_cancel(event) {
      event.preventDefault(); 
      try {
        const response = await axios.post('http://localhost:3020/deletebooking', { id: props.app._id });
        alert(response.data.msg);
        window.localStorage.href='/admindoctors'
      } catch (error) {
        console.error("Error while cancelling appointment:", error);
        alert("An error occurred. Please try again.");
      }
    }
    return(
        <div style={{border:'1px solid black',borderRadius:'5%'}}>
          <div className="1">
        <p> appointment scheduled on : {date.getDate()+'-'+(date.getMonth()+1)+'-'+(date.getFullYear())}</p>
      <p>appointment created on : {date1.getDate()+'-'+(date1.getMonth()+1)+'-'+(date1.getFullYear())}</p>
      <p> apppointment description : {props.app.description} </p>
      </div>
     {props.upcomig&& <div className="2">
        <button onClick={handle_cancel}>cancel</button>
      </div>} 
      </div>
    )
}

export default Subbody