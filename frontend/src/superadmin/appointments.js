import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useJwt, decodeToken } from "react-jwt";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [filters, setFilters] = useState({
    createdBy: '',
    acceptedBy: '',
    college: '',
    sortOrder: 'newToOld',
    dateRange: { start: '', end: '' }
  });

  const navigate = useNavigate();

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAllapp = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getapp`, { withCredentials: true });
      setAppointments(response.data.app);
      setFilteredAppointments(response.data.app);
      console.log('inside fetching');
      console.log(response.data.app);
    } catch (error) {
      console.error('Error fetching appointments data:', error);
    }
  };

  useEffect(() => {
    fetchAllapp();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    // Apply createdBy filter
    if (filters.createdBy) {
      filtered = filtered.filter(app => 
        app.createdy.toLowerCase().includes(filters.createdBy.toLowerCase())
      );
    }

    // Apply acceptedBy filter
    if (filters.acceptedBy) {
      filtered = filtered.filter(app => 
        app.acceptedby.toLowerCase().includes(filters.acceptedBy.toLowerCase())
      );
    }

    // Apply college filter
    if (filters.college) {
      filtered = filtered.filter(app => 
        app.college?.toLowerCase().includes(filters.college.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= startDate && appDate <= endDate;
      });
    }

    // Apply sorting
    if (filters.sortOrder === 'newToOld') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortOrder === 'oldToNew') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredAppointments(filtered);
  }, [appointments, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setFilters(prev => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name === 'startDate' ? 'start' : 'end']: value }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="nonnavbar1">
      <div className="hornav1" style={{ marginTop: '0', width: '72%' }}>
        <div className="sessions1" style={{ marginTop: '4%' }}>
          <div className="textpart12">
            <div className="textdiv">
              <p style={{ fontSize: '30px', marginBottom: '0' }}>Appointments</p>
            </div>
            <div className="imgdiv1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="dates1">
          <div className="text1" style={{ margin: '0' }}>
            <div className="date1" style={{ marginTop: '4%', padding: '0' }}>
              <p id="date" style={{ textAlign: 'end', margin: '0' }}>{date}</p>
              <p id="time" style={{ margin: '0' }}>{time}</p>
            </div>
            <div className="icon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filters" style={{ margin: '20px 0' }}>
        <input
          type="text"
          name="createdBy"
          placeholder="Filter by Student"
          value={filters.createdBy}
          onChange={handleFilterChange}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          name="acceptedBy"
          placeholder="Filter by Doctor"
          value={filters.acceptedBy}
          onChange={handleFilterChange}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          name="college"
          placeholder="Filter by College"
          value={filters.college}
          onChange={handleFilterChange}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={filters.dateRange.start}
          onChange={handleFilterChange}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={filters.dateRange.end}
          onChange={handleFilterChange}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
          style={{ padding: '5px' }}
        >
          <option value="newToOld">New to Old</option>
          <option value="oldToNew">Old to New</option>
        </select>
      </div>

      {/* Appointment List */}
      {filteredAppointments && filteredAppointments.length > 0 ? (
        filteredAppointments.map((appt, index) => (
          <div key={index} style={{ margin: '10px 22%', padding: '10px', border: '1px solid #ccc' }}>
            <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
            <p><strong>Student:</strong> {appt.createdy}</p>
            <p><strong>Doctor:</strong> {appt.acceptedby}</p>
            <p><strong>Description:</strong> {appt.description}</p>
            {appt.college && <p><strong>College:</strong> {appt.college}</p>}
          </div>
        ))
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default Appointments;