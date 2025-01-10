import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  position: 0,
  teamMembers: [
    {
      name: "K.Sandeep Kumar",
      rollno: "S20220010118",
      mail: "sandeeepkumar.k22@iiits.in",
      number: "1234567890",
      image: "./user3.png",
    },
    {
      name: "P.Manoj Kumar",
      rollno: "S20220010173",
      mail: "manojkumar.p22@iiits.in",
      number: "1234567890",
      image: "./user1.png",
    },
    {
      name: "G.Vamsi",
      rollno: "S20220010074",
      mail: "vamsi.g22@iiits.in",
      number: "1234567890",
      image: "./user2.png",
    },
    {
      name: "Ch.Druva Kanth",
      rollno: "S20220010049",
      mail: "druvakanth.c22@iiits.in",
      number: "1234567890",
      image: "./user.jpg",
    },
    {
      name: "K.Venkata Sai",
      rollno: "S20220010100",
      mail: "venkatasai.k22@iiits.in",
      number: "1234567890",
      image: "./user4.png",
    },
  ],
};

// Create slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    moveLeft: (state) => {
      state.position = (state.position - 1 + state.teamMembers.length) % state.teamMembers.length;
    },
    moveRight: (state) => {
      state.position = (state.position + 1) % state.teamMembers.length;
    },
  },
});

// Export actions and reducer
export const { moveLeft, moveRight } = teamSlice.actions;
export default teamSlice.reducer;
