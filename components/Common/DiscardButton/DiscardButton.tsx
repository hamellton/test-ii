import { DiscardButtonStyled } from "./DiscardButton.styles";

const DiscardButton = ({ onClick } : {onClick: () => void} ) => (
  <DiscardButtonStyled onClick={onClick}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8337 1.34199L10.6587 0.166992L6.00033 4.82533L1.34199 0.166992L0.166992 1.34199L4.82533 6.00033L0.166992 10.6587L1.34199 11.8337L6.00033 7.17533L10.6587 11.8337L11.8337 10.6587L7.17533 6.00033L11.8337 1.34199Z" fill="#605054"/>
    </svg>
    <span>Discard</span>
  </DiscardButtonStyled>
);

export default DiscardButton;