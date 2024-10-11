import styled from "styled-components";
import { Box } from "@mui/material";
import Link from "next/link";

export const UpcomingEpisodesWrapper = styled(Box)`
  width: 100%;
  margin: 0 auto;
`;

export const UpcomingEpisodesHeading = styled(Box)`

  h2 {
    font-size: 17px;
    font-weight: 700;
    line-height: 26px;
    font-family: "Abhaya Libre";
  }
`;

export const ShowMoreLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  text-decoration: none;
  color: #231F20;
`;

export const ShowMoreIcon = styled.svg`
  stroke: #FC714E;
  stroke-width: 1.66667;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export const SliderContainer = styled(Box)`
  overflow-x: auto;
  white-space: nowrap;
  margin-right: -24px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 769px) {
    overflow-x: visible;
    margin-right: 0;
  }
`;

export const Slider = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  width: calc(100% + 20px);
  max-height: 250px;
  height: auto;

  @media (max-width: 769px) {
    align-items: flex-start;
  }

  img {
    object-fit: cover;
  }
`;

export const EpisodeCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
`;

export const EpisodeImage = styled.div`
  width: 100%;
  height: 120px;
  overflow: hidden;
  position: relative;
  object-fit: cover;
`;

export const EpisodeTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #231F20;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 4px 0;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UpcomingEpisodesType = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #605054;
  padding: 4px 0;
  margin-top: 4px;
`;

export const EpisodeDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #605054;
`;