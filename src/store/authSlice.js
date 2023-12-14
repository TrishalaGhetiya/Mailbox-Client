import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  idToken: localStorage.getItem("idToken"),
  email: localStorage.getItem("email"),
  apiKey: "AIzaSyBaMjEyYa1-VQ3dRX6GfB9u_vd7uM8God4",
  notification: {
    message: null,
    variant: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      const { idToken, email } = action.payload;
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthenticated", true);
      state.isAuthenticated = true;
      state.idToken = idToken;
      state.email = email;
    },
    logout: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("email");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
      state.idToken = "";
      state.email = "";
    },
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        variant: action.payload.variant,
      };
    },
  },
});

export const { login, logout, showNotification, setIsLoading } =
  authSlice.actions;
export default authSlice.reducer;