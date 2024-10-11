import styled from "styled-components";
import { Box } from "@mui/material";

export const SimilarEventsWrapper = styled(Box)`
  width: 100%;
  /* max-width: 1150px; */
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  .similar-events {
    &-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      &__title {
        font-family: "Abhaya Libre";
        font-size: 24px;
        font-weight: 700;
        line-height: 36px;
      }

      &__show-more {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 16px;
        font-weight: 600;
        line-height: 19px;
      }
    }

    .slider-container {
      overflow-x: auto;
      white-space: nowrap;
      padding: 1rem 0;
      margin-right: -24px;

      @media (min-width: 769px) {
        overflow-x: visible;
        margin-right: 0;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .slider {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: calc(100% + 1rem);

      @media (max-width: 769px) {
        align-items: flex-start;
      }
    }
  }
`;
