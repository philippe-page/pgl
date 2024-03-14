import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import SliderComponent from './SliderComponent';

const ControlPanel = ({ settings, handleSettingChange, togglePause, randomizeSettings, toggleColorScheme, colorScheme, formulaString }) => {
  return (
    <Box className="control-panel" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
      <SliderComponent title="Repulsion Distance" value={settings.repulsionDistance} onChange={(e, val) => handleSettingChange('repulsionDistance', val)} min={0} max={200} step={1} colorScheme={colorScheme} />
      <SliderComponent title="Attraction Distance" value={settings.attractionDistance} onChange={(e, val) => handleSettingChange('attractionDistance', val)} min={0} max={200} step={1} colorScheme={colorScheme} />
      <SliderComponent title="Lifespan" value={Math.floor(settings.lifespan / 30)} onChange={(e, val) => handleSettingChange('lifespan', val * 30)} min={1} max={300} step={10} colorScheme={colorScheme} />
      <SliderComponent title="Growth Rate" value={settings.boidsPerSecond} onChange={(e, val) => handleSettingChange('boidsPerSecond', val)} min={1} max={300} step={1} colorScheme={colorScheme} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 1 }}>
        <IconButton onClick={togglePause} sx={{ marginLeft: 1, height: '40px', width: '40px' }}>
          {settings.isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
        <IconButton onClick={randomizeSettings} sx={{ marginLeft: 1, height: '40px', width: '40px' }}>
          <ShuffleIcon />
        </IconButton>
        <Switch
          checked={colorScheme === 'alternative'}
          onChange={toggleColorScheme}
          inputProps={{ 'aria-label': 'toggle dark mode' }}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: colorScheme === 'alternative' ? 'black' : '',
              '&:hover': {
                backgroundColor: colorScheme === 'alternative' ? 'rgba(0, 0, 0, .03)' : 'rgba(0, 0, 0, .04)', // Optional: change on hover
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: colorScheme === 'alternative' ? 'black' : '', // Track color when checked
            },
          }}
        />
      </Box>
      <Typography variant="body2" className="unselectable" gutterBottom>{formulaString}</Typography>
    </Box>
  );
};

export default ControlPanel;