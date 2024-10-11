import styled from "styled-components";
import { Alert, Grid, Button  } from "@mui/material";

export const ErrorAndButtonContainer = styled.div`
  width: 100%;
  max-width: 760px;
  margin-top: 50px;

  @media (max-width: 600px) {
    width: 100%;
    margin-top: 20px;
  }
`;

export const ErrorMessage = styled(Alert)`
  margin-bottom: 16px;
`;

export const ActionButtonsContainer = styled(Grid)`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const FormContainer = styled.form`
  margin-top: 50px;
  padding: 0;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 600px) {
    padding: 0;
    margin-top: 20px;
  }
`;

export const MainGridContainer = styled(Grid)`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  flex-direction: column;

  @media (max-width: 600px) {
    flex-direction: row;
  }
`;

export const ButtonWrapper = styled(Grid)`
  display: flex;
  align-items: center;
`;

export const SaveDraftButton = styled(Button)`
    border: 1px solid #231F20;
    color: #333;
    padding: 18px 32px;

    @media (max-width: 768px) {
      padding: 10px 18px;
    }
`;

export const PreviewButton = styled(Button)`
    border: none;
    margin-left: 14px;
    color: #333;
`;

export const SubmitButton = styled(Button)`
    background-color: #0066cc;
    color: white;
    padding: 18px 32px;

    @media (max-width: 768px) {
      padding: 10px 18px;
    }
`;