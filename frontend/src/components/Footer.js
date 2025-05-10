import React from 'react';
import { Box, Container, Typography, Link, Stack, IconButton } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'grey.100', py: 4, mt: 8, borderTop: '1px solid #e0e0e0' }}>
    <Container maxWidth="lg">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            BOOKING APP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Все права защищены
          </Typography>
        </Box>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: { xs: 2, sm: 0 } }}>
          <Link href="/about" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon fontSize="small" sx={{ mr: 0.5 }} /> О нас
          </Link>
          <Link href="/faq" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> FAQ
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: { xs: 2, sm: 0 } }}>
          <IconButton href="mailto:info@booking-app.ru" color="primary"><EmailIcon /></IconButton>
          <IconButton href="https://t.me/yourchannel" target="_blank" color="primary"><TelegramIcon /></IconButton>
          <IconButton href="https://wa.me/79999999999" target="_blank" color="primary"><WhatsAppIcon /></IconButton>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Footer; 