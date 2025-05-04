import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useJwt ,decodeToken} from "react-jwt";


const Chatd = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users,setusers]=useState([])
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loginuser,setloginuser]=useState(null)
  const [selectedUserid,setSelectedUserid]=useState(null)
  useEffect(()=>{
    async function fetchmessages(){
        const response = await axios.post("http://localhost:3020/dgetMessages",{from:loginuser,to:selectedUserid})
        console.log(response.data)
        setMessages(response.data)
    }
    fetchmessages()
  },[loginuser,selectedUserid])
  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = Cookies.get('userdetails');
      const token = Cookies.get('Uid1');
  
      if (userDetails) {
        try {
          const parsedDetails = JSON.parse(userDetails);
        
  
          const response = await axios.post("http://localhost:3020/getdocobj", { email: parsedDetails.gmail });
          
          setloginuser(response.data._id);
        } catch (error) {
          console.error("Error fetching user with userDetails:", error);
        }
      } else if (token) {
        console.log('inside token');
        try {
          const decoded = decodeToken(token);
         
  
          const response = await axios.post("http://localhost:3020/getdocobj", { email: decoded.gmail });
          
          setloginuser(response.data._id);
        } catch (error) {
          console.error("Token verification or fetching failed:", error);
        }
      } else {
        console.log("No user details or token found");
      }
    };
  
    fetchUser();
  }, []);
useEffect(()=>{
    async function fetchusers(){
        const response = await axios.post("http://localhost:3020/getstudents",{college:'nit trichy'})
        console.log(response.data)
        
        setusers(response.data)
    }
fetchusers()
},[])
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        from: loginuser,
        to: selectedUserid,
        message: input,
      };
      const response = axios.post("http://localhost:3020/dcreateMessage", {from:loginuser,to:selectedUserid,message:input});
      console.log(response.data)
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-4">patients</h2>
        <ul>
        {users.map((user, index) => (
  <div key={user._id} className="p-4 border rounded mb-2 shadow" onClick={() => {setSelectedUser(user.gmail);setSelectedUserid(user._id)}}>
    <p> {user.gmail}</p>
    {/* Optionally show slots or other fields if needed */}
  </div>
))}

        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white font-semibold">
          Chat with {selectedUser}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
{/* Messages */}
<div className="flex-1 p-4 overflow-y-auto space-y-2">
  {messages.map((msg, idx) => (
    <div
      key={idx}
      className={`max-w-xs p-2 rounded-lg shadow-md ${
        msg.from === loginuser
          ? "ml-auto bg-blue-500 text-white text-right"
          : "mr-auto bg-gray-200 text-black text-left"
      }`}
    >
      {msg.message}
    </div>
  ))}
</div>

        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border p-2 rounded mr-2 focus:outline-none focus:ring"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatd;
