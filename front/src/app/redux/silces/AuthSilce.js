import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken } from "../../../axiosInstance";
import jwt_decode from "jwt-decode";
const isEmpty = require("is-empty");
let initialState = {
  form: "signin",
  loggedInUser: null,
  isAuthenticated: false,
  resetPassword: false,
  errors: "",
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeForm(state, action) {
      state.form = action.payload;
    },
    login(state, action) {
      localStorage.setItem("token", action.payload);
      // Set token to Auth header
      setAuthToken(action.payload);
      // Decode token to get user data
      const decoded = jwt_decode(action.payload);
      state.loggedInUser = decoded;
      state.isAuthenticated = !isEmpty(decoded);
    },
    setLoggedInUser(state, action) {
      state.loggedInUser = action.payload;
      state.isAuthenticated = !isEmpty(action.payload);
    },
    logoutUser(state) {
      localStorage.removeItem("token");
      state.loggedInUser = null;
      state.isAuthenticated = false;
      setAuthToken(false);
    },
    resetPassword(state, action) {
      
      state.resetPassword = action.payload;
    },
    setEmail(state, action) {
      
        state.email = action.payload;
      },

  
  },
});

export const isAuthenticated = (state) => {
  return state.authSilce.isAuthenticated;
};
export const loggedInUser = (state) => {
  return state.authSilce.loggedInUser;
};
export const emailValue = (state) => {
    return state.authSilce.email;
  };
export const resetPasswordBooelan = (state) => {
  return state.authSilce.resetPassword;
};

export const { changeForm, login,setEmail, resetPassword, setLoggedInUser, logoutUser } =
  authSlice.actions;
export default authSlice.reducer;
