import axios from 'axios';

function Mainbody1(props) {
  async function handle_cancel(event) {
    event.preventDefault(); // Fix capitalization
    try {
      console.log("Canceling appointment with ID:", props.det._id);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/deletebooking`, { id: props.det._id });
      alert(response.data.msg);
      window.location.href='/studentbooking'
    } catch (error) {
      console.error("Error while cancelling appointment:", error);
      alert("An error occurred. Please try again." + error);
    }
  }

  // Format dates for better readability
  const createdDate = new Date(props.det.created).toLocaleDateString(); // Convert to local date format
  const scheduledDate = new Date(props.det.date).toLocaleDateString();

  return (
    <form className="bookform">
      <div className="Bookmainbody">
        <div className="Bookheader1">
          <p id="book">Booking date: {createdDate}</p>
        </div>
        <div className="Bookapno">
          <div className="Bookabc">
            <p id="book" style={{ marginLeft: "5%" }}>Accepted By: {props.det.acceptedby}</p>
          </div>
          <div className="Bookabc">
            <p id="book" style={{ marginLeft: "5%" }}>Scheduled Date: {scheduledDate}</p>
          </div>
        </div>
        <div className="BookSt">
          <p id="book" style={{ marginLeft: "5%" }}>Schedule Time: {props.det.time}</p>
          <p id="book" style={{ marginRight: "8%" }}>Status: Not Completed</p>
        </div>
        <div className="Bookbutt">
          <button type="submit" onClick={handle_cancel}>Cancel Appointment</button>
        </div>
      </div>
    </form>
  );
}

export default Mainbody1;
