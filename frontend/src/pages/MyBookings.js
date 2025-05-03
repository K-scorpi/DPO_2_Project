import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings...');
        const response = await getBookings();
        console.log('Bookings response:', response);

        if (response && response.data) {
          console.log('Response data:', response.data);
          const data = Array.isArray(response.data) ? response.data : response.data.results;
          console.log('Processed data:', data);
          
          if (data) {
            setBookings(data);
          } else {
            setError('Некорректный формат данных бронирований');
          }
        } else {
          setError('Данные бронирований не получены');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });

        if (error.response) {
          if (error.response.status === 401) {
            console.log('Unauthorized, removing token and redirecting');
            localStorage.removeItem('token');
            navigate('/login');
          } else if (error.response.status === 403) {
            setError('У вас нет прав для просмотра бронирований');
          } else {
            setError(`Ошибка сервера: ${error.response.status}`);
          }
        } else {
          setError('Ошибка при загрузке бронирований');
        }
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Загрузка бронирований...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          Войти
        </Button>
      </Container>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">У вас нет активных бронирований</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои бронирования
      </Typography>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {booking.apartment?.title || 'Название апартаментов не указано'}
                </Typography>
                <Typography color="text.secondary">
                  Дата заезда: {new Date(booking.start_date).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">
                  Дата выезда: {new Date(booking.end_date).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">
                  Статус: {booking.status || 'Не указан'}
                </Typography>
                {booking.apartment?.id && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/apartments/${booking.apartment.id}`)}
                  >
                    Подробнее об апартаментах
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyBookings; 