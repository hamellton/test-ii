import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const GradientButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '24px',
  background: 'linear-gradient(89.31deg, #FFC2B3 0%, #CFC3FF 100%)',
  borderRadius: '8px',
  border: 0,
  color: 'black',
  padding: '10px 18px',
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .3)',
    transform: 'scale(1.05)',
  },
  '&:active': {
    boxShadow: '0 1px 5px 2px rgba(255, 105, 135, .3)',
  },
}));
export default GradientButton;