import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CastleIcon from '@mui/icons-material/Castle';
import WindPowerIcon from '@mui/icons-material/WindPower';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import VillaIcon from '@mui/icons-material/Villa';

const categories = [
  { label: 'Популярные', icon: <WhatshotIcon /> },
  { label: 'Суперзвезды', icon: <StarIcon /> },
  { label: 'Земляные дома', icon: <HomeIcon /> },
  { label: 'Тропики', icon: <BeachAccessIcon /> },
  { label: 'Вау!', icon: <StarIcon /> },
  { label: 'Замки', icon: <CastleIcon /> },
  { label: 'Ветряные мельницы', icon: <WindPowerIcon /> },
  { label: 'Города мечты', icon: <LocationCityIcon /> },
  { label: 'Особняки', icon: <VillaIcon /> },
];

function CategoriesTabs({ value, onChange }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto' }}>
      <Tabs 
        value={value} 
        onChange={onChange} 
        variant="scrollable" 
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: { xs: 48, sm: 64 },
          '& .MuiTab-root': {
            minHeight: { xs: 48, sm: 64 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1, sm: 2 }
          }
        }}
      >
        {categories.map((cat, idx) => (
          <Tab key={cat.label} icon={cat.icon} label={cat.label} />
        ))}
      </Tabs>
    </Box>
  );
}

export default CategoriesTabs; 