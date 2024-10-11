import styled from "styled-components";
import { Box, Container } from "@mui/material";

export const StyledSalon = {
  DraftBadge: styled.div`
      background-color: #d54c44;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
    `,
  PendingApproveBadge: styled.div`
      background-color: #C4C4C4;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
    `,
  StyledTagsContainer: styled(Box)<{ shadow?: boolean }>`
      display: flex;
      align-items: center;
      gap: 20px;
    `,
  MainContainer: styled(Container)`
      display: flex;
      padding: 0;
      margin-top: 93px;
      margin-bottom: 120px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  
      @media (max-width: 768px) {
        margin-top: 0;
        padding: 24px;
        margin-bottom: 24px;
        max-width: 100%;
      }
    `,
  StyledSimilarsContainer: styled(Box)`
      display: flex;
      flex-direction: column;
      gap: 40px;
  
      @media (max-width: 768px) {
        gap: 16px;
        max-width: 100%;
      }
    `,
  DetailsBox: styled(Box)`
      display: flex;
      flex-direction: column;
      max-width: 686px;
      gap: 2px;
    `,
  ContentWrapper: styled.div`
      display: flex;
      gap: 110px;
      margin-bottom: 100px;
  
      @media (max-width: 768px) {
        flex-direction: column;
        max-width: 100%;
        width: 100%;
        gap: 24px;
        margin-bottom: 0;
      }
    `,
  SalonTitle: styled.div`
      font-size: 32px;
      font-family: "Abhaya Libre";
      font-weight: 700;
      line-height: 48px;
      margin: 16px 0;
      color: #231F20;
  
      @media (max-width: 768px) {
        font-size: 24px;
        line-height: 36px;
        margin: 12px 0 16px 0;
      }
    `,
  ImageWrapper: styled.div<{ superSalon: boolean }>`
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 24px;
  
      img {
        width: 680px;
        height: 400px;
        object-fit: cover;
        border-radius: 12px;
  
        ${({ superSalon }) =>
    superSalon &&
          `
          border: 8px solid #B1A0F4;
        `}
      }
  
      @media (max-width: 768px) {
        img {
          width: 100%;
          height: auto;
          max-height: 188px;
          border-radius: 8px;
          border-radius: 12px;
        }
      }
    `,
  DescriptionTitle: styled(Box)<{ isDescriptionTitle: boolean }>`
      font-family: "Abhaya Libre";
      font-size: ${({ isDescriptionTitle }) => (isDescriptionTitle ? "20px" : "16px")};
      font-weight: 700;
      line-height: ${({ isDescriptionTitle }) => (isDescriptionTitle ? "30px" : "25px")};
      text-align: left;
      margin-top: ${({ isDescriptionTitle }) => (isDescriptionTitle ? "32px" : "16px")};
      color: #231F20;
  
      @media (max-width: 768px) {
        margin-top: ${({ isDescriptionTitle }) => (isDescriptionTitle ? "0" : "16px")};
      }
    `,
  TagsTitle: styled.div`
      font-size: 20px;
      line-height: 30px;
      margin-bottom: 16px;
      font-family: "Abhaya Libre";
      font-weight: 700;
    `,
  TagsInnerContainer: styled.div`
      display: flex;
      align-items: center;
      gap: 16px;
  
      @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 12px;
      }
    `,
  TagsWrapper: styled(Box)`
      padding: 4px 8px;
      border: 1px solid #C4C4C4;
      border-radius: 64px;
      display: inline-flex;
      margin-right: 3px;
  
      @media (max-width: 768px) {
        padding: 8px 16px;
      }
    `,
  StyledTagTypography: styled(Box)`
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
      color: #231F20;
    `,
  TagsContainer: styled(Box)`
      margin-top: 102px;
  
      @media (max-width: 768px) {
        margin-top: 32px;
        margin-bottom: 24px;
      }
    `,
  MobileInfoWrapper: styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 24px;
    `,
};
  