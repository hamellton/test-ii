import styled from "styled-components";

export const MembershipList = styled.ul`
  list-style-type: none;
  padding-left: 0;

  li {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    color: #231F20;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-align: left;

    

    svg {
      width: 16px;
      height: 16px;
      margin-right: 13px;
      flex-shrink: 0;
    }
  }
`;

export const MembershipPlanWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 8;
  flex-wrap: wrap;
  margin: auto;
  padding: 0 11px;
`;

export const MembershipTextWrapper = styled.div`
  text-align: center;
`;