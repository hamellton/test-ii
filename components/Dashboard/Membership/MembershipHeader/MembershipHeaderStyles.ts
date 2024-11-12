import styled from "styled-components";


export const MembershipHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin-top: 120px;
  margin-bottom: 60px;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

export const MembershipHeaderTitle = styled.div<{ isMembershipPage?: boolean }>`
  font-size: 40px;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 0.05em;
  text-align: center;
  color: ${(props) => (props.isMembershipPage ? "#FC714E" : "#231F20")};
`;

export const TopLeftImage = styled.img<{ isMembershipPage?: boolean }>`
  position: absolute;
  top: -94px;
  width: 127px; // Adjust size as needed
  height: 90px;
  left: ${(props) => (props.isMembershipPage ? "146px" : "16px")};


  transform: rotate(0deg);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(25deg);
  }

  @media (max-width: 768px) {
    top: 25px;
  }
`;

export const BottomRightImage = styled.img<{ isMembershipPage?: boolean }>`
  position: absolute;
  bottom: -29px;
  right: 180px;
  width: 75px; // Adjust size as needed
  height: 74px;
  display: ${(props) => (props.isMembershipPage ? "none" : "block")};

  @media (max-width: 768px) {
    bottom: 20px;
    right: 10px;
  }
`;