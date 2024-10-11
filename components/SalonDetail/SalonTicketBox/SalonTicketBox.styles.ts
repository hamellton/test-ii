import styled from "styled-components";
import { Box } from "@mui/material";

export const Styled = {
  FlexRowBox: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 0;
    font-family: "Abhaya Libre";
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
  `,
  PriceText: styled.span`
    font-size: 16px;
  `,
  SpaceText: styled.span<{ available: boolean }>`
    color: ${({ available }) => (available ? "inherit" : "red")};
  `,
  DividerStyled: styled(Box)`
    flex-grow: 1;
    margin-top: 16px;
    margin-bottom: 16px;
  `,
};
