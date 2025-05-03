import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { getBookings, cancelBooking } from '../services/api';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';

const statusColors = {
  confirmed: 'success',
  cancelled: 'error',
  pending: 'warning',
};

const DetailImage = styled('img')({
  width: '100%',
  maxHeight: 300,
  objectFit: 'cover',
  borderRadius: 8,
});

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        let data = response.data;
        // Универсальная обработка: если массив — используем, если объект с results — используем results
        const bookingsArray = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
        setBookings(bookingsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(selectedBooking.id);
      // Обновляем список бронирований
      const response = await getBookings();
      const bookingsArray = Array.isArray(response.data) ? response.data : (Array.isArray(response.data.results) ? response.data.results : []);
      setBookings(bookingsArray);
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleDetailOpen = (booking) => {
    setDetailBooking(booking);
    setDetailDialogOpen(true);
  };
  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setDetailBooking(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои бронирования
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Апартамент</TableCell>
              <TableCell>Фото</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Дата заезда</TableCell>
              <TableCell>Дата выезда</TableCell>
              <TableCell>Гостей</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
              <TableCell>Подробнее</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => {
              const apt = booking.apartment;
              const photo = apt.images?.[0]?.image || apt.image || '';
              const address = apt.address || apt.city || apt.location || '';
              const canCancel = booking.status === 'confirmed';
              const canReview = booking.status === 'confirmed' && new Date(booking.end_date) < new Date();
              return (
                <TableRow key={booking.id} hover>
                  <TableCell>{apt.title}</TableCell>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={photo}
                      alt={apt.title}
                      sx={{ width: 56, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{address}</TableCell>
                  <TableCell>{new Date(booking.start_date || booking.check_in).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.end_date || booking.check_out).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.guests || booking.guest_count || 1}</TableCell>
                  <TableCell>{booking.total_price ? `${booking.total_price} ₽` : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={statusColors[booking.status] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        sx={{ mb: 0.5 }}
                        onClick={() => handleCancelClick(booking)}
                      >
                        Отменить
                      </Button>
                    )}
                    {canReview && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<RateReviewIcon />}
                        sx={{ mt: 0.5 }}
                        disabled
                      >
                        Оставить отзыв
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => handleDetailOpen(booking)}
                    >
                      Подробнее
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelClose}
        aria-labelledby="cancel-dialog-title"
      >
        <DialogTitle id="cancel-dialog-title">Отмена бронирования</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите отменить бронирование апартаментов "{selectedBooking?.apartment?.title}"?
            Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Нет, оставить</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Да, отменить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailDialogOpen}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Детали бронирования</DialogTitle>
        <DialogContent dividers>
          {detailBooking && (() => {
            // фильтрация уникальных фото по url
            const images = detailBooking.apartment?.images
              ? detailBooking.apartment.images.filter((img, idx, arr) => arr.findIndex(i => i.image === img.image) === idx)
              : [];
            return (
              <Box>
                {/* Фото слайдер */}
                {images.length > 0 ? (
                  <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                    {images.map((img, idx) => (
                      <Box key={idx} sx={{ px: 1 }}>
                        <DetailImage src={img.image || img} alt={`Фото ${idx + 1}`} />
                      </Box>
                    ))}
                  </Slider>
                ) : (
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar variant="rounded" sx={{ width: 120, height: 90, mx: 'auto', bgcolor: 'grey.700' }}>
                      <ImageIcon fontSize="large" />
                    </Avatar>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Нет фото
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>{detailBooking.apartment?.title}</Typography>
                  {detailBooking.apartment?.id && (
                    <Button
                      href={`/apartments/${detailBooking.apartment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      sx={{ ml: 1 }}
                    >
                      Перейти к апартаменту
                    </Button>
                  )}
                </Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {detailBooking.apartment?.address || detailBooking.apartment?.city || detailBooking.apartment?.location}
                </Typography>
                {detailBooking.apartment?.description && (
                  <Typography sx={{ mb: 2, whiteSpace: 'pre-line' }} color="text.secondary">
                    {detailBooking.apartment.description}
                  </Typography>
                )}
                <Box sx={{ mb: 1 }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Гостей: {detailBooking.guests}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Цена: {detailBooking.total_price ? `${detailBooking.total_price} ₽` : (detailBooking.apartment?.price ? `${detailBooking.apartment.price} ₽/ночь` : '-')}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Даты: {new Date(detailBooking.start_date).toLocaleDateString()} — {new Date(detailBooking.end_date).toLocaleDateString()}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={detailBooking.status}
                    color={statusColors[detailBooking.status] || 'default'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                {/* Удобства */}
                {detailBooking.apartment?.amenities?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Удобства:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {detailBooking.apartment.amenities.map((am, idx) => (
                        <Chip key={idx} label={am} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                {/* Контакты хозяина */}
                {detailBooking.apartment?.host && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Хозяин:</Typography>
                    <Typography>
                      {detailBooking.apartment.host.first_name || ''} {detailBooking.apartment.host.last_name || ''}
                      {detailBooking.apartment.host.email ? ` (${detailBooking.apartment.host.email})` : ''}
                    </Typography>
                  </Box>
                )}
                {/* Прочие поля */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">ID бронирования: {detailBooking.id}</Typography>
                  <Typography variant="subtitle2">Создано: {new Date(detailBooking.created_at).toLocaleString()}</Typography>
                  <Typography variant="subtitle2">Обновлено: {new Date(detailBooking.updated_at).toLocaleString()}</Typography>
                </Box>
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings; 