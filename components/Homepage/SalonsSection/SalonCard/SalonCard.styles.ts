import styled from "styled-components";

export const EventCardContainer = styled.div<{ isHostPage?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 366px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: ${(props) => (!props.isHostPage ? "0px 24px 48px -12px #0000002E" : "none")};
  border: 1px solid #C4C4C4;
  background-color: #FFF6E3;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const EventCardImage = styled.div<{ isSuperSalon?: boolean }>`
  width: 100%;
  height: 203px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;

  p {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 21px !important;
  text-align: left !important;
  }


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
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  text-align: left;
  color: #231F20;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-bottom: 4px;
`;

export const IconWithText = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1em;
  gap: 10px;
  color: #231F20;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
`;

export const SalonPrice = styled.span`
  color: #605759;
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
`;

export const DateText = styled.div`
  margin-top: 0.5rem;
  color: #231F20;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
`;


export const HostName = styled.div`
  font-size: 15px;
  font-weight: 700;
  line-height: 23px;
  text-align: left;
  color: #231F20;
`;