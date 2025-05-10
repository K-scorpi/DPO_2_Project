import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ text = 'Ничего не найдено', icon }) => (
  <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
    {icon || (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ marginBottom: 16 }}>
        <circle cx="60" cy="60" r="56" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="4" />
        <rect x="35" y="70" width="50" height="10" rx="5" fill="#E0E0E0" />
        <rect x="45" y="50" width="30" height="20" rx="6" fill="#E0E0E0" />
        <circle cx="60" cy="60" r="5" fill="#BDBDBD" />
      </svg>
    )}
    <Typography variant="h6" sx={{ mt: 2 }}>{text}</Typography>
  </Box>
);

export default EmptyState; 