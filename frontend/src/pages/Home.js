import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Добро пожаловать в систему бронирования апартаментов
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Найдите идеальное место для вашего отдыха
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/apartments"
          variant="contained"
          size="large"
          sx={{ mr: 2 }}
        >
          Посмотреть апартаменты
        </Button>
        <Button
          component={RouterLink}
          to="/bookings"
          variant="outlined"
          size="large"
        >
          Мои бронирования
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 