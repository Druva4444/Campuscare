import { Link ,useNavigate} from 'react-router-dom';
import './Index1.css';
import { Helmet } from 'react-helmet';
function Index1(){
    const navigate = useNavigate();
    function handleAboutus(){
         navigate('/aboutus');
    }
    function handleadmin(){
         navigate('/adminloginpage');
    }
    function handleClgAdd(){
         navigate('/ReqAdd');
    }
    function handlelogin(){
         navigate('/a');
    }
    function handlesuperuser(){
         navigate('/suserlogin');
    }
    return (
         <div>
            <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Anta&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Anta&family=Dancing+Script:wght@400..700&display=swap" rel="stylesheet" />
      </Helmet>
             <div>
             <video autoPlay muted id="myVideo" style={{ width: '100%', height: 'auto' }}>
            <source src="./presentation.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
           </video>
            </div>
            <div className="maincontent1">
      <div className="first_block1" id="first">
        <h1 style={{marginLeft:"20p"}}>Schedule an Appointment</h1>
        <p>Booking an appointment with your doctor is now more convenient with customizable time slots</p>
      </div>
      <div className="second_block1" id="second">
        <h1 style={{marginLeft:"20p"}}>Track your Appointment</h1>
        <p>Track an appointment and manage those appointments within your respective college</p>
      </div>
      <div className="third_block1" id="third">
        <h1 style={{marginLeft:"20p"}}>Student Health Record</h1>
        <p>
          A student can confidently access their medical history &amp; comprehensive
          overview of their health journey
        </p>
      </div>
    </div>
    <div className="navbar1">
      <div className="firstpart1">
        <img src="./logo1.png" alt="IIIT Sri City Logo" id="image1" />
        <div className="textpart1">
          <p style={{ display: 'inline-block' }} id="tag1">Campus Care Connect</p>
        </div>
      </div>
      <div className="thirdpart1">
        <p id="clickme" onClick={handleAboutus}>About Us</p>
        <p id="adminlogin" onClick={handleadmin}>Admin Login</p>
        <p id="reqclgadd" onClick={handleClgAdd}>Add college</p>
      </div>
      <div className="secondpart1">
        <button style={{ marginLeft: '25%' }} id="login" onClick={handlelogin} >LOG IN</button>
        <button style={{ marginLeft: '10%' }} id="login1" onClick={handlesuperuser}>SuperUser</button>
      </div>
    </div>
    <div className="text1">
        <h1 id="M">M</h1>
        <h1 id="E">E</h1>
        <h1 id="D">D</h1>
        <h1 id="I">I</h1>
        <h1 id="C">C</h1>
        <h1 id="O">O</h1>
        <h1 id="R">R</h1>
        <h1 id="U">U</h1>
        <h1 id="M1">M</h1>
        
    </div>
    </div>
    );
}
export default Index1;