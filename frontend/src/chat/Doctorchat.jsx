import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import "./Dchat.css"
import { decodeToken } from "react-jwt";

const Chatd = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
<<<<<<< HEAD:project/frontend/src/chat/Doctorchat.jsx
  const [loginUser, setLoginUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    useEffect(() => {
            // Set current date
            const date = new Date();
            const month = date.getMonth() + 1;
            setCurrentDate(
              `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
            );
      
            // Update time every second
            const updateTime = () => {
              const now = new Date();
              let hours = now.getHours();
              const minutes = now.getMinutes();
              const seconds = now.getSeconds();
              const meridiem = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;
              const timeString = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} ${meridiem}`;
              setCurrentTime(timeString);
            };
      
            updateTime();
            const timer = setInterval(updateTime, 1000);
      
            return () => clearInterval(timer);
          }, []);
  useEffect(() => {
    async function fetchMessages() {
      if (loginUser && selectedUserId) {
        const response = await axios.post("http://localhost:3020/dgetMessages", { from: loginUser, to: selectedUserId });
        setMessages(response.data);
      }
=======
  const [loginuser,setloginuser]=useState(null)
  const [selectedUserid,setSelectedUserid]=useState(null)
  useEffect(()=>{
    async function fetchmessages(){
        const response = await axios.post("http://localhost:3020/dgetMessages",{from:loginuser,to:selectedUserid}, {
          withCredentials: true
        })
        console.log(response.data)
        setMessages(response.data)
>>>>>>> ef9dbd2d95e994bb90753e4ae8d186708e2e860f:frontend/src/chat/Doctorchat.jsx
    }
    fetchMessages();
  }, [loginUser, selectedUserId]);

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = Cookies.get('userdetails');
      const token = Cookies.get('Uid1');
<<<<<<< HEAD:project/frontend/src/chat/Doctorchat.jsx

      try {
        let email = null;

        if (userDetails) {
          email = JSON.parse(userDetails).gmail;
        } else if (token) {
          const decoded = decodeToken(token);
          email = decoded.gmail;
=======
  
      if (userDetails) {
        try {
          const parsedDetails = JSON.parse(userDetails);
        
  
          const response = await axios.post("http://localhost:3020/getdocobj", { email: parsedDetails.gmail }, {
            withCredentials: true
          });
          
          setloginuser(response.data._id);
        } catch (error) {
          console.error("Error fetching user with userDetails:", error);
        }
      } else if (token) {
        console.log('inside token');
        try {
          const decoded = decodeToken(token);
         
  
          const response = await axios.post("http://localhost:3020/getdocobj", { email: decoded.gmail }, {
            withCredentials: true
          });
          
          setloginuser(response.data._id);
        } catch (error) {
          console.error("Token verification or fetching failed:", error);
>>>>>>> ef9dbd2d95e994bb90753e4ae8d186708e2e860f:frontend/src/chat/Doctorchat.jsx
        }

        if (email) {
          const response = await axios.post("http://localhost:3020/getdocobj", { email });
          setLoginUser(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
<<<<<<< HEAD:project/frontend/src/chat/Doctorchat.jsx

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.post("http://localhost:3020/getstudents", { college: 'nit trichy' });
      setUsers(response.data);
=======
useEffect(()=>{
    async function fetchusers(){
        const response = await axios.post("http://localhost:3020/getstudents",{college:'nit trichy'}, {
          withCredentials: true
        })
        console.log(response.data)
        
        setusers(response.data)
>>>>>>> ef9dbd2d95e994bb90753e4ae8d186708e2e860f:frontend/src/chat/Doctorchat.jsx
    }
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      await axios.post("http://localhost:3020/dcreateMessage", {
        from: loginUser,
        to: selectedUserId,
        message: input,
<<<<<<< HEAD:project/frontend/src/chat/Doctorchat.jsx
      });
=======
      };
      const response = axios.post("http://localhost:3020/dcreateMessage", {from:loginuser,to:selectedUserid,message:input}, {
        withCredentials: true
      });
      console.log(response.data)
>>>>>>> ef9dbd2d95e994bb90753e4ae8d186708e2e860f:frontend/src/chat/Doctorchat.jsx
      setInput("");
    }
  };

  return (
    <div className="APPnonnavbar">
    <div className="APPheader">
            <div className="APPheading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
</svg>
              <p style={{ fontSize: "40px", marginLeft: "10px" }}>Chat</p>
            </div>
            <div className="APPdate" style={{ marginTop: "5%", margin: "0", padding: "0" }}>
              <p id="APPdate" style={{ textAlign: "end", margin: "0" ,marginRight:"40px"}}>{currentDate}</p>
              <p id="APPtime" style={{ margin: "0",marginRight:"40px" }}>{currentTime}</p>
              <div className="APPcalendar">
              <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="APPbi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M3.5 0a.5.5 0 0 1 .5-.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </div>
            </div>
            
    </div>
    <div className="chatbox">
    <div className="chat-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Patients</h2>
        <ul className="user-list">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-card"
              onClick={() => {
                setSelectedUser(user.gmail);
                setSelectedUserId(user._id);
              }}
            >
              <p>{user.gmail}</p>
            </div>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        <div className="chat-header">Chat with {selectedUser}</div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${
                msg.from === loginUser ? "sent" : "received"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Chatd;
