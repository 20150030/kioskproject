import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import foodReducer from "./foodSlice";

const store = configureStore({
  reducer: {
    food: foodReducer,
    auth: authReducer,
  },
});

export default store;