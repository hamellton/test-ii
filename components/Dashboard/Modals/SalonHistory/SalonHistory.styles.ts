import styled from "styled-components";

export const SalonHistoryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export const SalonHistoryContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;

  p {
    margin: 0;
  }

  @media (max-width: 600px) {
    padding-top: 20px;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    align-items: center;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 3%;
  left: 3%;
  z-index: 10001;
  background-color: #F9F9F9;
  border-radius: 50%;

  @media (max-width: 600px) {
    top: 1%;
    left: 1%;
  }
`;

export const SalonHistoryTitle = styled.div`
  font-weight: 700;
  font-size: 32px;
  margin-bottom: 1em;
  display: flex;


  @media (max-width: 600px) {
    font-size: 24px;
    margin-bottom: 1em;
  }
`;
