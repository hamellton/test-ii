import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastState } from "../types";

const initialState: ToastState = {
  message: "",
  success: true,
  duration: 5000,
  autoHide: true,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<ToastState>) {
      const { message, success, duration, autoHide } = action.payload;
      state.message = message;
      state.success = success;
      state.duration = duration || initialState.duration;
      state.autoHide = autoHide !== undefined ? autoHide : initialState.autoHide;
    },
    hideToast(state) {
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
