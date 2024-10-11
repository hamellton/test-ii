import styled from "styled-components";

interface ToastContainerProps {
  success?: boolean;
}

export const ToastContainer = styled.div<ToastContainerProps>`
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 1em;
  background-color: ${props => props.success === undefined ? "gray" : (props.success ? "green" : "#d54c44")};
  color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    width: 90%;
    top: 10%;
  }
`;

export const ToastMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  margin-left: 1em;

  &:hover {
    opacity: 0.8;
  }
`;
