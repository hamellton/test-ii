import styled from "styled-components";
import { Box as MuiBox, Typography as MuiTypography, Chip as MuiChip } from "@mui/material";

export const HostsContainer = styled(MuiBox)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  padding: 45px 47px;

  @media (max-width: 600px) {
    padding: 25px;
    align-items: center;
  }
`;

export const HostsHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 107px;

  @media (max-width: 600px) {
    gap: 20px;
    flex-direction: column;
  }
`;

export const HostsTitle = styled(MuiTypography)`
  font-family: "Abhaya Libre";
  font-size: 48px;
  font-weight: 700;
  line-height: 58px;
  text-align: left;

  @media (max-width: 600px) {
    font-size: 40px;
  }
`;

export const HostsFilterContainer = styled(MuiBox)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const HostsChip = styled(MuiChip)<{ alphabeticalSort:boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  padding: 8px 18px;
  color: #605054;
  border: 1px solid #AEA5A5;
  box-shadow: 0px 1px 2px 0px #0000000F;
  box-shadow: 0px 1px 3px 0px #0000001A;
  background-color: transparent;
  background-color: ${({ alphabeticalSort }) => alphabeticalSort ? "#AEA5A5" : "transparent"};
`;

export const HostsGridContainer = styled(MuiBox)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 75px;
  padding: 0 23px;

  &::after {
    content: "";
    flex: auto;
  }

  @media (max-width: 600px) {
    gap: 40px;
    flex-direction: column;
    padding: 0;
  }
`;

export const HostCard = styled(MuiBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  max-width: 270px;

  @media (max-width: 600px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const HostImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
`;

export const ImageStyle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  clip-path: inset(0 0 40px 0);
`;

export const HostName = styled(MuiTypography)`
  font-family: "Abhaya Libre";
  font-size: 22px;
  font-weight: 400;
  line-height: 33px;
  letter-spacing: -0.01em;
  text-align: center;
  color: #000000;
  margin-top: -40px;
`;

export const HostDescription = styled.div`
  font-family: "Abhaya Libre";
  font-size: 15px;
  font-weight: 700;
  line-height: 23px;
  text-align: center;
  color: #460B24E5;
`;

export const HostBio = styled(MuiTypography)`
  font-family: "Abhaya Libre";
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.01em;
  text-align: center;
  margin-top: 12px;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
