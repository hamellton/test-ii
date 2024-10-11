import styled from "styled-components";

export const MembershipList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  font-family: 'Abhaya Libre';
  font-size: 15px;

  li {
    position: relative;
    padding-left: 10px;
    margin-bottom: 10px;
    color: #231F20;
    font-weight: 500;

    &::before {
      content: "-";
      position: absolute;
      left: 0;
      color: black;
    }
  }
`;

export const MembershipNotes = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
  margin-top: 10px;

  li {
    position: relative;
    padding-left: 10px;
    font-weight: 700;

    &::before {
      content: "*";
      position: absolute;
      left: 0;
      color: black;
    }

    &:first-child:last-child::before {
      content: "*";
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