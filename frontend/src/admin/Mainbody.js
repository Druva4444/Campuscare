import { useState } from "react";
import Subbody from "./Subbody";
import axios from 'axios';

function Mainbody(props) {
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState(false);
  const toggleCollapsible = () => {
    setIsCollapsibleVisible(!isCollapsibleVisible);
  };

  const [msg, setmsg] = useState('');

  async function handledelete(event) {
    event.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/deletepd`, {
      id: props.std._id,
      role: props.role
    }).then((response) => {
      setmsg(response.data.msg);
      alert(response.data.msg);
    });
  }

  const [acceptedByFilter, setAcceptedByFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const filterAppointments = (appointmentsList) => {
    return appointmentsList
      .filter((appointment) => {
        const appDate = new Date(appointment.date);
        const matchesAcceptedBy =
          acceptedByFilter === "" ||
          appointment.acceptedby?.toLowerCase().includes(acceptedByFilter.toLowerCase());
        const matchesStartDate = !startDate || appDate >= new Date(startDate);
        const matchesEndDate = !endDate || appDate <= new Date(endDate);
        return matchesAcceptedBy && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  };

  const filteredAppointments = filterAppointments(props.appointments);
  const filteredUpcomingAppointments = filterAppointments(props.upcoming);

  return (
    <div>
      {/* Main Body */}
      <div className="mainbody1240" onClick={toggleCollapsible}>
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
          <form method="post" onSubmit={handledelete}>
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
        {/* Filters UI */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Filter by accepted by"
            value={acceptedByFilter}
            onChange={(e) => setAcceptedByFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Completed Bookings */}
        <h1>Completed bookings</h1>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <Subbody key={index} app={appointment} upcomig={false} />
          ))
        ) : (
          <p>No appointments found</p>
        )}

        {/* Upcoming Bookings */}
        <h1>Upcoming bookings</h1>
        {filteredUpcomingAppointments.length > 0 ? (
          filteredUpcomingAppointments.map((appointment, index) => (
            <Subbody key={index} app={appointment} upcomig={true} />
          ))
        ) : (
          <p>No upcoming appointments found</p>
        )}
      </div>
    </div>
  );
}

export default Mainbody;
