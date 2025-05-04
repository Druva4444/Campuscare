import { configureStore } from "@reduxjs/toolkit";
import teamReducer from "../features/teamSlice";

// Create the store
const store = configureStore({
  reducer: {
    team: teamReducer,
  },
});

export default store;
