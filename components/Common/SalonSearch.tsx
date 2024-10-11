import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Select, Chip, FormControl, OutlinedInput, useTheme, SelectChangeEvent, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const selectStyles = {
  borderRadius: 6,
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
  color: '#605054',
  fontWeight: 'bold',
  minWidth: '100px',
  height: '60px',
  textAlign: 'center',
}
const salonTags = [
  'Science',
  'History'
];

const SearchBar = ({ handleSearch }: { handleSearch: (searchTerm: string) => void }) => {
  // State to store the current value of the search input
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('' as string);
  const [type, setType] = useState('both' as string);
  const [tag, setTag] = useState<string[]>([]);

  const theme = useTheme();
  // Using theme.breakpoints.down('sm') to switch to icon on small screens
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // const handleChangeTags = (event: SelectChangeEvent<typeof tag>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setTag(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  // };

  // Function to update the searchTerm state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Function to call the provided handleSearch with the current search term
  const onSearchClick = () => {
    handleSearch(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchClick();
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
    }}>
      <Box sx={{
        display: 'flex',
        width: '100%',
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Start Exploring!"
          style={{
            borderRadius: '8px',
            marginRight: '1em', // To align perfectly with the button
          }}
          value={searchTerm} // Bind the text field's value to the searchTerm state
          onChange={handleChange} // Update searchTerm state on every change
          onKeyDown={handleKeyDown} // Handle key down events
          sx={{
            '& .MuiOutlinedInput-root': {
              // Target the root of the OutlinedInput and apply border radius
              borderRadius: '10px', // You can adjust the value as needed
              height: '60px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
              '& fieldset': {
                border: '2px solid #F6C4B6',
              },
              '&:hover fieldset': {
                borderColor: '#CFC3F7', // Change border color when hovered
              },
              '&.Mui-focused fieldset': {
                borderColor: '#EBC4C6', // Change border color when focused (clicked)
                borderWidth: '2px', // Optional: Change border width when focused
              },
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSearchClick} // Call onSearchClick when the button is clicked
          sx={{
            marginLeft: {
              xs: '-75px',
              md: '-191px'
            },
            minWidth: {
              xs: '60px',
              md: '175px'
            },
            borderRadius: '10px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            ':hover': {
              boxShadow: 'none',
              transform: 'none',
              // If there are other style changes on hover you want to prevent, specify them here as well
            },
          }}
        >
          {isMobile ? <SearchIcon /> : 'Search'}
        </Button>
      </Box>

      {/* 
      <Box sx={{
        mt: 4,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}>
        <TextField
          id="date"
          label="Search from"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          margin="normal"
          name="date"
          inputProps={{
            min: new Date().toISOString().slice(0, 10),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              // Target the root of the OutlinedInput and apply border radius
              borderRadius: '20px', // You can adjust the value as needed
              height: '60px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
              mb: 1,
            },
          }}
        />


        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={selectStyles}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value={'both'}>Online and In Person</MenuItem>
          <MenuItem value={'virtual'}>Online</MenuItem>
          <MenuItem value={'irl'}>In Person</MenuItem>
        </Select>

        <Select
          id="demo-multiple-chip"
          multiple
          value={tag}
          // onChange={handleChangeTags}
          sx={selectStyles}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {salonTags.map((tag) => (
            <MenuItem
              key={tag}
              value={tag}
            >
              {tag}
            </MenuItem>
          ))}
        </Select>
      </Box> */}
    </Box>
  );
};

export default SearchBar;