import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { moveLeft, moveRight } from "../src/redux/features/teamSlice";
import "./aboutus.css";

function Aboutus() {
  const dispatch = useDispatch();
  const position = useSelector((state) => state.team.position);
  const teamMembers = useSelector((state) => state.team.teamMembers);

  const currentMember = teamMembers[position];

  return (
    <>
    <div>
      <h2 style={{ textAlign: "center", fontSize: "40px" }}>Team Members</h2>
      <div className="abtmaindiv">
        <div className="abtleft" onClick={() => dispatch(moveLeft())}>
          <img src="./left.png" alt="Left Arrow" />
        </div>
        <div className="abtdi">
          <div className="abtphoto">
            <img src={currentMember.image} alt={currentMember.name} />
          </div>
          <div className="abtdetails">
            <h2>
              Name: <span>{currentMember.name}</span>
            </h2>
            <h2>
              Roll No: <span>{currentMember.rollno}</span>
            </h2>
            <h2>
              Mail:{" "}
              <a href={`mailto:${currentMember.mail}`}>
                {currentMember.mail}
              </a>
            </h2>
            <h2>
              Number: <span>{currentMember.number}</span>
            </h2>
          </div>
        </div>
        <div className="abtright" onClick={() => dispatch(moveRight())}>
          <img src="./right.png" alt="Right Arrow" />
        </div>
      </div>
    </div>
     <div className="about">
     <h1>About Us</h1>
     <p>
       Welcome to our online medical doctor appointment system tailored
       exclusively for college students! We understand the unique needs and
       challenges that students face when it comes to accessing healthcare
       services, especially amidst their busy academic schedules. That's why
       we've created a convenient and user-friendly platform to bridge the
       gap between colleges and medical professionals.
     </p>
     <p>
       Our journey began with a simple yet profound mission: to provide
       students with easy access to quality healthcare services right within
       their college campuses. We recognized the importance of timely
       medical attention and sought to streamline the process of scheduling
       doctor appointments to ensure students receive the care they need,
       when they need it.
     </p>
     <p>
       Our team is comprised of passionate individuals who share a common
       goal: to improve student health and well-being. From software
       engineers to medical professionals, each member brings unique
       expertise to the table, enabling us to develop innovative solutions
       tailored specifically for college communities.
     </p>
     <p>
       At <b>MEDICORUM</b>, we are committed to revolutionizing the way
       students access healthcare services. Through our intuitive online
       platform, students can conveniently schedule appointments with
       medical professionals, track their medical history, and receive
       timely reminders for upcoming appointments.
     </p>
     <p>
       We firmly believe that every student deserves access to quality
       healthcare, and we are dedicated to making that a reality. By
       partnering with colleges and medical professionals, we aim to create
       a seamless healthcare experience for students, empowering them to
       prioritize their health and succeed academically.
     </p>
     <p>
       Thank you for choosing MEDICORUM for your medical appointment needs.
       We are excited to serve you and your college community, and we look
       forward to supporting your health and well-being throughout your
       academic journey!
     </p>
   </div>
   </>
 
  );
}

export default Aboutus;
