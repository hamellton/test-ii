import styled from "styled-components";
import Button from "@mui/material/Button";

export const HostRequestOverlay = styled.div`
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
  z-index: 1000;
`;

export const HostRequestContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  p {
    margin: 0;
  }

  @media (max-width: 600px) {
    margin: 0 20px;
  }
`;

export const HostStatusContainer = styled.div`
  padding: 1em;
  max-width: 600px;
  margin: 0 auto;
`;

export const HostStatusHeading2 = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0.5em;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const HostStatusParagraph = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 1em;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const HostStatusHeading4 = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 1em;
`;

export const HostStatusButton = styled(Button)`
  min-width: 100px;
`;
