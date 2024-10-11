import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, ToastMessage, CloseButton } from "./Toast.styles";
import { RootState, AppDispatch } from "@/store/store";
import { hideToast } from "@/store";

const Toast: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { message, success, duration, autoHide  } = useSelector((state: RootState) => state.toast);

  const handleClose = useCallback(() => {
    dispatch(hideToast());
  }, [dispatch]);

  useEffect(() => {
    if (message && autoHide) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, dispatch, handleClose, autoHide]);

  if (!message) return null;

  return (
    <ToastContainer success={success}>
      <ToastMessage>
        {message}
        <CloseButton onClick={handleClose}>&times;</CloseButton>
      </ToastMessage>
    </ToastContainer>
  );
};

export default Toast;
