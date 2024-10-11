import { Radio, styled } from '@mui/material';
import { CSSProperties } from 'react';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { width } from '@mui/system';

/* Salon Creation Page */
export const StyledRadio = styled(Radio)({
  // Hide the default radio button icon
  '&.MuiSvgIcon-root': {
    display: 'none',
  },
});

// Styled components for a more specific look
export const StyledIconButton = styled(IconButton)({
  border: '1px solid rgba(0, 0, 0, 0.23)',
  borderRadius: '50%', // Makes it circular
  width: '44px',
  height: '44px',
  margin: '0 8px', // Spacing between buttons and text field
  padding: 0, // Remove padding to reduce the size
});

export const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    borderRadius: 4, // Gives the textField rounded corners
    width: '74px',
    height: '56px', // Set height to match IconButton
  },
  '& input': {
    textAlign: 'center',
    padding: '9px 0', // Padding top and bottom to center the text vertically
  },
  '&&&': {
    margin: 0, // Remove margin
  },
});

// Function to determine styles for radio buttons based on the selection
export const getFormControlLabelStyles = (isSelected: boolean) => ({
  padding: '0 7.11px', // To set width to be 90px
  marginRight: '10px', // Gap between two icons
  marginLeft: "0",
  height: '32px',
  backgroundColor: isSelected ? '#605054' : '#FFFFFF', // Conditional background color
  border: '1px solid #AEA5A5',
  borderRadius: '28px',
  color: isSelected ? '#F1EFE2' : '#605054', // Online/In Person text
  '& .MuiButtonBase-root': { //Span around icon
    padding: '0 2px'
  },
  '& .MuiFormControlLabel-label': {
    fontSize: '16px',
    fontWeight: 600,
  }
});

export const salonBoxStyle = (isFirstBox: boolean = false) => ({
  width: '768px',
  padding: '32px',
  border: '1px solid #00000029',
  borderRadius: '12px',
  backgroundColor: '#FFF',
  marginTop: isFirstBox ? '0' : '40px'
})

export const salonBoxHeadingStyle = () => ({
  marginBottom: '25px',
  fontWeight: 700,
  fontSize: '28px',
  lineHeight: '42px'
})

export const profileModalStyle = (width: string) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  p: 4,
  width: width,
  outline: 0
});

export const cartModalStyle = () => ({
  '& .MuiDialog-paper': {
    position: 'absolute',
    top: 0, // Anchors the dialog to the top of the page
    maxWidth: '70%', // Set to a percentage of the viewport width or a specific value
    width: 'auto', // Adjust width as necessary
    maxHeight: 'calc(100% - 64px)', // Avoid touching the very top of the viewport
    overflowY: 'auto', // Allows for scrolling within the modal
    bgcolor: 'background.paper',
    borderRadius: '12px',
    p: 4,
    mx: 'auto' // Horizontally centers the dialog if it's smaller than the max width

  }
})

export const salonTitleBoxStyle = () => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: 'text.secondary',
  mb: 1
})

export const salonFormHeadingStyle = () => ({
  marginBottom: '15px',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '30px'
})

export const salonFormTextStyle = () => ({
  margin: '15px 0',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '25.6px'
})

export const cartFormStyle = (): CSSProperties => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column', // This is correctly typed as 'column' is a valid FlexDirection value
  justifyContent: 'space-between'
});

export const attendeeBoxStyle = () => ({
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on extra-small devices, horizontally on small devices and up
  gap: 2,
  width: '100%',
  mb: 2,
})

export const hostBoxStyle = () => ({
  background: '#E8E5D4',
  borderRadius: '12px',
  width: '333px',
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  mb: 4,
  gap: 2
})

export const tagsStyle = () => ({
  padding: '4px 8px',
  border: '1px solid #C4C4C4',
  borderRadius: '64px',
  display: 'inline-flex',
  mr: 3,
  pl: '16px',
  pr: '16px',
  pt: '8px',
  pb: '8px'
})

export const ticketBoxStyle = () => ({
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #CAC6AF',
  width: '333px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  mb: 4
})

export const broadcastModalStyle = () => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  p: 4,
  outline: 0,
});

export const ticketCardStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'white',
  borderRadius: 2,
  border: '1px solid #E5E5E5',
  padding: 4,
  maxWidth: 730,
  mb: 2,
});

export const salonInfoStyle = () => ({
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #CAC6AF',
  width: '333px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
});

export const explorePageSalonCardStyle = () => ({
  display: 'absolute',
  marginLeft: '-48px',
  width: '16px', // Size of the circle
  height: '16px', // Size of the circle
  borderRadius: '50%', // Makes it round
  background: '#F1EFE2', // Color of the circle
  border: '1px solid #605054', // Optional: Border around the circle,
});

export const explorePageSalonBoxStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  mt: { xs: 5, md: 10 },
  ml: { xs: 0, md: 20 },
  mr: { xs: 0, md: 20 },
  pl: { xs: 2 },
  pr: { xs: 2 }
});