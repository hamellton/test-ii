import styled from "styled-components";

export const DiscardButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background-color: #D3D3D3;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #605054;
  cursor: pointer;
  box-shadow: none;

  &:hover {
    background-color: #e0e0e0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
