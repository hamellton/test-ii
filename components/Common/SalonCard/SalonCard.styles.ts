import styled from "styled-components";

export const EventCardContainer = styled.div<{ isHostPage?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 333px;
  margin: 0 auto;
  font-family: "Abhaya Libre";
  border-radius: 8px;
  box-shadow: ${(props) => (!props.isHostPage ? "0px 24px 48px -12px #0000002E" : "none")};
  border: 1px solid #C4C4C4;
  background-color: ${(props) => (!props.isHostPage ? "#fff" : "#FFFEF4")};

  @media (max-width: 600px) {
    /* width: 100%; */
    width: ${(props) => (!props.isHostPage ? "100%" : "")};
  }
`;

export const EventCardImage = styled.div<{ isSuperSalon?: boolean }>`
  width: 100%;
  height: 203px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;

  img {
    max-height: 187px;
    border: ${props => props.isSuperSalon ? "6px solid #B1A0F4" : "none"};
  }

  div:last-child {
    position: absolute;
    bottom: 0;
    left: 16px;
    display: flex;
    align-items: center;
    
    img {
      border: none;
    }
  }
`;

export const EventCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 9px 16px 16px 16px;
`;

export const EventCardTitle = styled.h3`
  font-family: "Abhaya Libre";
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #231F20;
  margin: 0;
`;

export const SalonInfoRow = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  color: #605759;
  margin-bottom: 4px;
`;

export const SalonDetailsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  color: #605054;
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-bottom: 4px;
`;

export const IconWithText = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1em;
  color: #605759;
`;

export const SalonPrice = styled.span`
  color: #605759;
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  text-transform: uppercase;
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
`;

export const DateText = styled.div`
  margin-top: 0.5rem;
  color: #605759;
`;
