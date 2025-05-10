import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>О нас</Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      <b>BOOKING APP</b> — современный сервис для поиска и бронирования жилья по всей России. Мы объединяем гостей и хозяев, чтобы сделать путешествия удобными, безопасными и выгодными. Наша команда заботится о вашем комфорте и всегда готова помочь на каждом этапе бронирования!
    </Typography>
    <Box sx={{ mt: 4, color: 'text.secondary' }}>
      <Typography variant="subtitle1">Связаться с нами:</Typography>
      <Typography>Email: info@booking-app.ru</Typography>
      <Typography>Telegram: @yourchannel</Typography>
      <Typography>WhatsApp: +7 999 999-99-99</Typography>
    </Box>
  </Container>
);

export default About; 