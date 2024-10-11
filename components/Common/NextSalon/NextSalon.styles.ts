import styled from "styled-components";

export const NextSalonHostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 17px 0 0 0;
`;

export const HostDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  .host-title {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #605759;
  }

  .host-name {
    font-size: 15px;
    line-height: 23px;
    color: #231F20;
    font-family: "Abhaya Libre";
    font-weight: 700;
  }
`;