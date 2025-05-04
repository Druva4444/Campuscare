
import Vernav from './superadmin/Vernav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './superadmin/Dashboard';
import Colleges from './superadmin/Colleges';
import Admins from './superadmin/Admins';
import Vernavstud from './student/Vernavstud';
import Students from './superadmin/Students';
import Home from './student/Home';
import StudAppoint from './student/appointment';
import StudBook from './student/bookings';
import StudSch from './student/schedule';
import Set from './student/setting';
import Docvernav from './doctor/docvernav';
import Dochome from './doctor/dochome';
import Docbooking from './doctor/docbooking';
import Docschedule from './doctor/docschedule';
import Docpatients from './doctor/docpatients';
import Docsetting from './doctor/docsetting';
import Aboutus from './aboutus';
import Login from './forms/dslogin';
import Index1 from './Index1';
import A from './A';
import Suserlg from './forms/suserlogin';
import Vernavadmin from './admin/Vernavadmin';
import Homeadmin from './admin/Homeadmin';
import Patientsadmin from './admin/Patientsadmins';
import Reports from './admin/Reportsadmin';
import Docforget from './forms/doctorforget';
import Doctorsadmin from './admin/Doctorsadmin';
import Slogin from './forms/slogin'
import Adminlogin from './forms/adminlogin';
import NewPassword from './forms/doctorcnfrm';
import Stuforget from './forms/studentforget';
import NewPasswords from './forms/Studentcnfrm';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Docreg from './forms/Docreg';
import Stureg from './forms/Stureg';
import AccCollege from './superadmin/AccCollege'
import AddClgs from './forms/addcollages'
import SuserNewPassword from './forms/SuserNewPAssword';
import Suserforget from './forms/suserForgot';
import Addadmin from './forms/Addadmin';
import LeaveDetails from './student/Leave';
import Leaves from './doctor/Leaves';  
import Chatd from './chat/Stundetchat';
import Chats from './chat/Doctorchat';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
      <Route 
  path="/" 
  element={
    Cookies.get('Uid1') ? (
      // Redirect to /doctorhome if
      <Navigate to="/doctorhome" />
    ) : Cookies.get('Uid2') ? (
      
      <Navigate to="/studenthome" />
    ) : Cookies.get('Uid3') ? (
      // Redirect to /admin if Uid3 cookie is present
      <Navigate to="/admin" />
    ) : Cookies.get('Uid4') ? (
      // Redirect to /admin if Uid3 cookie is present
      <Navigate to="/superadmin" />
    ) :(
      // Render the Index1 component if no Uid1, Uid2, or Uid3 cookies are found
      <div><Index1 /></div>
    )
  }
/>
          <Route path="/superadmin" element={<div><Vernav/><Dashboard/></div>}/>    
          <Route path="/students" element={<div><Vernav/><Students></Students></div>}/>    
          <Route path="/superadmincolleges" element={<div style={{marginTop:'-25px'}}><Vernav/><Colleges></Colleges></div>} /> 
          <Route path="/superadmin_admins" element={<><Vernav /><Admins/></>} /> 
          <Route path="/studenthome" element={<><Vernavstud /><Home></Home></>} /> 
          <Route path="/studentappointment" element={<><Vernavstud /><StudAppoint></StudAppoint></>} /> 
          <Route path="/studentbooking" element={<><Vernavstud style={{marginTop:'-25px'}} /><StudBook></StudBook></>} /> 
          <Route path="/studentschedule" element={<><Vernavstud  /><StudSch></StudSch></>} /> 
          <Route path="/studentsetting" element={<><Vernavstud  /><Set></Set></>} /> 
          <Route path="/leave" element={<><Vernavstud  /><LeaveDetails></LeaveDetails></>} /> 
          <Route path="/doctorhome" element={<><Docvernav></Docvernav><Dochome></Dochome></>} /> 
          <Route path="/doctorbooking" element={<><Docvernav></Docvernav><Docbooking></Docbooking></>} /> 
          <Route path="/doctorschedule" element={<><Docvernav></Docvernav><Docschedule></Docschedule></>} /> 
          <Route path="/doctorpatients" element={<><Docvernav></Docvernav><Docpatients></Docpatients></>} /> 
          <Route path="/doctorsetting" element={<><Docvernav></Docvernav><Docsetting></Docsetting></>} /> 
          <Route path="/doctorleaves" element={<><Docvernav></Docvernav><Leaves></Leaves></>} /> 
          <Route path='/aboutus' element={<Aboutus></Aboutus>}></Route>
          <Route path='/a' element={<A/>}></Route>
          <Route path='/suserlogin' element={<Suserlg/>}></Route>
          <Route path='/dslogin' element={<Login/>}></Route>
          <Route path='/admin' element={<div style={{overflow:'hidden'}}><Vernavadmin></Vernavadmin><Homeadmin></Homeadmin></div>}></Route>
          <Route path='/adminpatients' element={<><Vernavadmin></Vernavadmin><Patientsadmin></Patientsadmin></>}></Route>
          <Route path='/admindoctors' element={<><Vernavadmin></Vernavadmin><Doctorsadmin></Doctorsadmin></>}></Route>
          <Route path='/adminreports' element={<><Vernavadmin></Vernavadmin><Reports></Reports></>}></Route>
          <Route path='/forgetpassword' element={<Docforget/>}></Route>
          <Route path='/forgetpasswords' element={<Stuforget/>}></Route>
          <Route path ='/studentlogin' element={<Slogin/>}></Route>
          <Route path ='/adminloginpage' element={<Adminlogin/>}></Route>
          <Route path='/newpassword' element={<NewPassword/>}/>
          <Route path='/newpasswordstu' element={<NewPasswords/>}/> 
          <Route path='/adddoctor' element={<Docreg/>}/>
          <Route path='/addstudent' element={<Stureg/>}/>
          <Route path='/noti' element={<><Vernav/><AccCollege/></>}/>
          <Route path='/ReqAdd' element={<AddClgs/>}/>
          <Route path='/superuser/forgetpassword' element={<Suserforget/>}/>
          <Route path='/suser/newpassword' element={<SuserNewPassword/>}/>
          <Route path='/admin/signup' element={<Addadmin/>}/>
          <Route path='/chat' element={<Chatd/>}/>
          <Route path='/doctorchat' element={<Chats/>}/>
        </Routes>
      </Router>
       
    </div>
  );
}

export default App;
