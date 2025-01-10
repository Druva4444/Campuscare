const mongoose = require('mongoose');

// Helper function to generate time slots
const generateDefaultSlots = () => {
  const slots = [];
  const start = 9 * 60; // 9 AM in minutes
  const end = 17 * 60; // 5 PM in minutes
  const step = 15; // 15-minute intervals

  for (let time = start; time < end; time += step) {
    const startHours = Math.floor(time / 60);
    const startMinutes = time % 60;
    const endHours = Math.floor((time + step) / 60);
    const endMinutes = (time + step) % 60;

    const formattedSlot = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')} - ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    slots.push(formattedSlot);
  }

  return slots;
};

const defaultSlots = generateDefaultSlots();

const doctorschema = new mongoose.Schema({
  gmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  college: {
    type: String,
    required: true,
  },
  fields: {
    type: String,
    required: true,
  },
  slots: {
    Monday: { type: [String], default: defaultSlots },
    Tuesday: { type: [String], default: defaultSlots },
    Wednesday: { type: [String], default: defaultSlots },
    Thursday: { type: [String], default: defaultSlots },
    Friday: { type: [String], default: defaultSlots },
    Saturday: { type: [String], default: defaultSlots },
    Sunday: { type: [String], default: defaultSlots },
  },
  lastUpdated:{
    type:Date
  }
});

const Doctor = mongoose.model('doctor', doctorschema);
module.exports = Doctor;
