import styled from "styled-components";
import { Box  } from "@mui/material";

export const SimilarEventsWrapper = styled(Box)`
  width: 100%;
  /* max-width: 1150px; */
  margin: 0 auto;
  border-top: 1px solid #C4C4C4;
  padding-top: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  .similar-events {

    &-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__title {
        font-family: "Abhaya Libre";
        font-size: 24px;
        font-weight: 700;
        line-height: 36px;

        @media (max-width: 768px) {
          font-size: 20px;
          line-height: 30px;
        }
      }

      &__show-more {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 16px;
        font-weight: 600;
        line-height: 19px;

        @media (max-width: 768px) {
          justify-content: flex-end;
          margin-top: 20px;
          font-size: 15px;
          line-height: 23px;
        }
      }
    }
  }
`;