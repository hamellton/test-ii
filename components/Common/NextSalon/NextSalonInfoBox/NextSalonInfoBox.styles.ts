import styled from "styled-components";
import { Box } from "@mui/material";

export const NextSalonInfoBoxContainer = styled(Box)`

`;

export const DetailsItem = styled(Box)<{ isDate?: boolean, isMap?: boolean }>`
    display: flex;
    align-items: ${({ isDate }) => isDate ? "flex-start" : "center"};
    gap: 8px;
    margin-top: 16px;
    font-size: 16px;
    line-height: 26px;
    color: #231F20;
    max-width: ${({ isMap }) => isMap ? "100%" : "209px"};
    font-family: "Abhaya Libre";
    font-weight: 700;

    svg {
        width: 24px;
    }
`;