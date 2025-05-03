import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApartment, createBooking } from '../services/api';
import { Container, Typography, Box, Button, TextField, Alert, Modal } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const placeholderImages = [1, 2, 3].map(n => `/placeholders/${n}.jpeg`);

const ApartmentDetail = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingMsg, setBookingMsg] = useState(null);
  const [guests, setGuests] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    getApartment(id)
      .then(res => setApartment(res.data))
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    setBookingMsg(null);
    try {
      await createBooking({
        apartment: id,
        start_date: checkIn,
        end_date: checkOut,
        guests: guests,
      });
      setBookingMsg('Бронирование успешно!');
    } catch (e) {
      if (e.response && e.response.status === 403) {
        window.location.href = '/login';
      } else if (e.response && e.response.data && e.response.data.start_date) {
        setBookingMsg('Ошибка: ' + e.response.data.start_date);
      } else {
        setBookingMsg('Ошибка бронирования');
      }
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!apartment) return null;

  // Список фото для слайдера
  const images = (apartment.images && apartment.images.length > 0)
    ? apartment.images.map(img => img.image)
    : placeholderImages;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <Box sx={{ mb: 2 }}>
          <Slider {...sliderSettings}>
            {images.map((src, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={src}
                  alt={apartment.title}
                  style={{
                    width: 400,
                    height: 260,
                    objectFit: 'cover',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    cursor: 'zoom-in',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => { setLightboxImg(src); setLightboxOpen(true); }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </Box>
            ))}
          </Slider>
        </Box>
        <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}>
            <img
              src={lightboxImg}
              alt="Фото апартамента"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
              onClick={() => setLightboxOpen(false)}
            />
          </Box>
        </Modal>
        <Typography variant="h4" sx={{ mt: 2 }}>{apartment.title}</Typography>
        <Typography variant="subtitle1">{apartment.location}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{apartment.description}</Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>{apartment.price} руб./ночь</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Дата заезда"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
          />
          <TextField
            label="Дата выезда"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
          />
          <TextField
            label="Гостей"
            type="number"
            InputLabelProps={{ shrink: true }}
            value={guests}
            onChange={e => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            sx={{ width: 120 }}
          />
        </Box>
        <Button variant="contained" onClick={handleBooking}>Забронировать</Button>
        {bookingMsg && <Alert sx={{ mt: 2 }} severity={bookingMsg.includes('успешно') ? 'success' : 'error'}>{bookingMsg}</Alert>}
      </Box>
    </Container>
  );
};

export default ApartmentDetail; 