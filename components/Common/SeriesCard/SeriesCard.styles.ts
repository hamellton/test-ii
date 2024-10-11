import styled from "styled-components";

export const SeriesCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  font-family: "Abhaya Libre";
  border-radius: 8px;
  box-shadow: 0px 24px 48px -12px #0000002E;
  border: 1px solid #C4C4C4
`;

export const SeriesCardImage = styled.div`
  width: 100%;
  height: 203px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;

  img {
    max-height: 187px;
  }

  div:last-child {
    position: absolute;
    bottom: 0;
    left: 16px;
  }
`;

export const SeriesCardTitle = styled.h3`
  font-family: "Abhaya Libre";
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #231F20;
  margin: 0;
`;

export const SeriesCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 9px 16px 16px 16px;
`;

export const SeriesCardBadge = styled.div`
  padding: 4px 8px;
  background-color: #fff;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #231F20;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
`;