import { useNavigate } from 'react-router-dom';
import './A.css';
function A(){
  const navigate = useNavigate();
  function handlesubmit(){
    navigate('/dslogin');
  }
  function handlesubmit1(){
    navigate('/studentlogin');
  }
    return(
        <div className="main2">
    <div className="doctor2" id="doctor2">
      <img src="./Doctor.png" alt="Doctor_img" onClick={handlesubmit} className='Aimg'/>
      <p className='spec'>Are u Doctor</p>
    </div>
    <div className="student2" id="student2">
      <img src="./student.png" alt="Student_img" onClick={handlesubmit1} className='Aimg'/>
      <p className='spec'>Are u Student</p>
    </div>
  </div>
    )
}
export default A