import React from "react";
import "./suserlogin.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
function Suserlg(){
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    async function handleSubmit(e){
        e.preventDefault();
          try {
          await axios.post('http://localhost:3020/getsuserhome', {
            email:email,password:password , rememberMe:rememberMe
          }, { withCredentials: true });
          navigate('/superadmin');
          } catch (error) {
            console.log(error)
          }
        }
    return(
        <div>

<div className="susercontainer" >
        <form className="suserform" onSubmit={handleSubmit}>
            <p id="suserp">lOG IN</p>
            <input  type="email" name="email" placeholder="Username" id="suserin" style={{marginBottom: "2rem;"}} value={email} onChange={(e)=>{setEmail(e.target.value)}}/><br/>
            <div className="suserpassword">
                <input type=    {passwordVisible ? "text" : "password"}  name="password1" placeholder="Password" id="suserpassword1" value={password} onChange={(e)=>{setPassword(e.target.value)}}/><br/>
                <img
                            src={passwordVisible ? 'eyeopen.png' : 'lock.png'}
                            alt="Toggle visibility"
                            id="lockimage"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
            </div>
            <div className="checkbox">
                <input type="checkbox" name="checkbox" value={rememberMe} onChange={(e)=>{setRememberMe(!rememberMe)}}/>
                <label for="">Remember me</label>
            </div>
            
            <input type="submit" value="Sign in" id="signin"/><br/>
            <div className="suernew1">
            <Link  to="/superuser/forgetpassword" id="fp" style={{ marginLeft: "0px" }}>Forgot Password?</Link>
            </div>
           
        </form>
    </div>

        </div>
    )
}
export default Suserlg