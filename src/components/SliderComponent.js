import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const SliderComponent = ({ title, value, onChange, min, max, step, colorScheme }) => {
  return (
    <>
      <Typography variant="body2" gutterBottom className="unselectable">{title}</Typography>
      <Slider
        aria-label={title}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        sx={{
          width: '90%',
          marginBottom: 2,
          color: colorScheme === 'alternative' ? 'black' : '',
          '& .MuiSlider-thumb': {
            color: colorScheme === 'alternative' ? 'black' : '',
          },
          '& .MuiSlider-track': {
            color: colorScheme === 'alternative' ? 'black' : '',
          },
          '& .MuiSlider-rail': {
            color: colorScheme === 'alternative' ? 'black' : '',
          },
        }}
      />
    </>
  );
};

export default SliderComponent;