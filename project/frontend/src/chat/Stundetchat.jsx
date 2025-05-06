import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { decodeToken } from "react-jwt";
import "./Schat.css"; // Add this line for CSS

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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
        const response = await axios.post("http://localhost:3020/sgetMessages", {
          from: loginUser,
          to: selectedUserId
        });
        setMessages(response.data);
      }
    }
    fetchMessages();
  }, [loginUser, selectedUserId]);

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = Cookies.get('userdetails');
      const token = Cookies.get('Uid2');

      try {
        let email = null;
        if (userDetails) {
          email = JSON.parse(userDetails).gmail;
        } else if (token) {
          const decoded = decodeToken(token);
          email = decoded.gmail;
        }

        if (email) {
          const response = await axios.post("http://localhost:3020/getstuobj", { email });
          setLoginUser(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.post("http://localhost:3020/getdoctors", { college: 'nit trichy' });
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      await axios.post("http://localhost:3020/screateMessage", {
        from: loginUser,
        to: selectedUserId,
        message: input,
      });
      setInput("");
    }
  };

  return (
    <div className="Appnonnavbar" style={{marginLeft: '10%' ,width:'90%'}}>
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
    <div className="S-chatbox">  
    <div className="S-chat-container">
      {/* Sidebar */}
      <div className="S-sidebar">
        <h2 className="S-sidebar-title">Doctors</h2>
        <ul className="S-user-list">
          {users.map((user) => (
            <div
              key={user._id}
              className="S-user-card"
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

      {/* Chat Area */}
      <div className="S-chat-area">
        <div className="S-chat-header">Chat with {selectedUser}</div>

        <div className="S-chat-messages">
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

        <div className="S-chat-input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="S-chat-input"
          />
          <button onClick={sendMessage} className="S-send-button">
            Send
          </button>
        </div>
      </div>
    </div>
    </div>    
    </div>
  );
};

export default Chats;
