import React from "react";
import "./verifyotp.css";

function OTP(){

    return(
        <div>


<div className="OTPcontainer"> 
        <form className="OTPform" method="post" action='/verifyotp'>
            <p>REGISTER</p>
            <input type="email"  placeholder="enter email" id="" style={{marginBottom: "2rem"}} name="email"/><br/>
            <div class="OTPpassword">
                <input type="text"  placeholder="enter otp"  style={{marginBottom: "2rem"}} name="otp"/><br/>
                {/* <!--<img src="images/lock.png" alt="" class="OTPlockimage" id="lockimage">--> */}
            </div>
            {/* // <!--<div class="OTPpassword">
            //     <input type="password" name="" placeholder="Confirm password" id="password2"/><br/>
            //     <img src="images/lock.png" alt="" class="OTPlockimage" id="lockimage1">
            // </div>--> */}
            
            <input type="submit" value="Confirm" id="confirm"/><br/>
            <div class="OTPnew1">
                <a href="#" id="su" ></a>
            <a href="#" id="fp"></a>
            </div>
           
        </form>
    </div>

        </div>
    )
}

export default OTP