import React, { useEffect, useState } from "react";
import "./timetable.css";

// Helper function to generate all slots from 9 AM to 5 PM in 15-minute intervals
const generateSlots = () => {
  const slots = [];
  const start = 9 * 60; // 9 AM in minutes
  const end = 16 * 60; // 5 PM in minutes
  const step = 15; // 15-minute intervals

  for (let time = start; time < end; time += step) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    slots.push(formattedTime);
  }
  return slots;
};

// Helper function to convert interval "9:00-9:15" into individual time slots
const convertIntervalToSlots = (interval) => {
  const [startTime, endTime] = interval.split("-");
  const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
  const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

  const slots = [];
  for (let time = startMinutes; time < endMinutes; time += 15) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  }
  return slots;
};

function TimeTable({ availableSlots }) {
  const [bookedSlots, setBookedSlots] = useState({});
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const allSlots = generateSlots();
    const calculatedBookedSlots = {};

    daysOfWeek.forEach((day) => {
      const dayAvailableSlots = availableSlots[day] || [];

      // Convert each interval to individual time slots
      const allAvailableSlots = dayAvailableSlots.flatMap(convertIntervalToSlots);

      // Filter out available slots from allSlots to get booked slots
      calculatedBookedSlots[day] = allSlots.filter(
        (slot) => !allAvailableSlots.includes(slot)
      );
    });

    setBookedSlots(calculatedBookedSlots);
  }, [availableSlots]);

  function add15Minutes(timeString) {
    // Parse the input time string (e.g., "09:30")
    const [hours, minutes] = timeString.split(":").map(Number);

    // Add 15 minutes to the current time
    let newMinutes = minutes + 15;
    let newHours = hours;

    // If minutes exceed 60, adjust hours
    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    // Handle 24-hour time format overflow (e.g., from 23:50 to 00:05)
    if (newHours >= 24) {
      newHours -= 24;
    }

    // Format the result as a string with leading zeros if necessary
    const newTimeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;

    return newTimeString;
  }

  return (
    <div className="timetable" style={{ position: 'absolute', width: '90%', top: '10%', left: '450px' }}>
      <div className="timetable-body">
        {daysOfWeek.map((day) => (
          <div key={day} className="timetable-row">
            <div className="timetable-day">{day}</div>
            <div className="timetable-slots">
              {bookedSlots[day] && bookedSlots[day].length > 0 ? (
                // Display booked slots for the day
                bookedSlots[day].map((slot, index) => (
                  <div key={index} className="timetable-slot booked">
                    {slot} - {add15Minutes(slot)}
                  </div>
                ))
              ) : (
                <div className="timetable-slot-empty">No slots booked</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeTable;
