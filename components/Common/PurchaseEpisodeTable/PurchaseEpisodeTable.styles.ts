import styled from "styled-components";

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
  gap: 9px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;
  margin: 0;
`;

export const ToggleButton = styled.button<{ isOpen: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transform: rotate(${({ isOpen }) => (isOpen ? "180deg" : "0deg")});
  transition: transform 0.3s ease-in-out;

  svg {
    fill: #FC714E;
  }
`;

export const DiscountText = styled.div`
  font-family: "Abhaya Libre";
  font-size: 15px;
  font-weight: 700;
  line-height: 23px;
  text-align: left;
  color: #231F20;

  span {
    color: #006622;
  }
`;

export const TableWrapper = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;

  @media (max-width: 768px) {
    max-height: ${({ isOpen }) => (isOpen ? "none" : "0")};
    overflow: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    width: 100%;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  td {
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    text-align: left;
    color: #231F20;
  }

  th {
    font-family: "Abhaya Libre";
    font-size: 15px;
    font-weight: 700;
    line-height: 23px;
    text-align: left;
    color: #231F20;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;

    th, td {
      display: table-cell;
      box-sizing: border-box;
      padding: 20px 16px;
    }

    thead {
      display: table-header-group;
    }

    tbody {
      display: table-row-group;
      max-height: none;
    }
  }
`;

export const Checkbox = styled.div<{ disabled?: boolean; checked?: boolean }>`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  svg {
    stroke-width: 2;
  }
`;

export const StatusIcon = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EpisodeTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #231F20;
`;

export const DateTime = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #231F20;
`;