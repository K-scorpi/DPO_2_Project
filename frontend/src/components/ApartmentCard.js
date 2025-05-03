import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Tooltip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import KitchenIcon from '@mui/icons-material/Kitchen';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// Тестовые удобства (можно расширить)
const amenities = [
  { icon: <WifiIcon fontSize="small" />, label: 'Wi-Fi' },
  { icon: <LocalParkingIcon fontSize="small" />, label: 'Парковка' },
  { icon: <KitchenIcon fontSize="small" />, label: 'Кухня' },
];

const ApartmentCard = ({ apartment }) => {
  // Бейдж "Новое" — если создано за последние 7 дней
  const isNew = apartment.created_at && (Date.now() - new Date(apartment.created_at).getTime() < 7 * 24 * 60 * 60 * 1000);
  // Бейдж "Суперхозяин" — тестово, если цена > 2000
  const isSuperhost = apartment.price > 2000;
  // Тестовое количество отзывов
  const reviewsCount = apartment.reviews_count || Math.floor(Math.random() * 20 + 1);
  const rating = apartment.average_rating || (Math.random() * 2 + 3).toFixed(1);

  return (
    <Card
      component={RouterLink}
      to={`/apartments/${apartment.id}`}
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.22s, box-shadow 0.22s',
        '&:hover': {
          transform: 'scale(1.035)',
          boxShadow: 10,
          cursor: 'pointer',
        },
        minWidth: 360,
        maxWidth: 460,
        width: '100%',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        p: 2,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image={
            apartment.images && apartment.images.length > 0 && apartment.images[0].image
              ? apartment.images[0].image
              : '/placeholders/1.jpeg'
          }
          alt={apartment.title}
          sx={{ borderRadius: 4, objectFit: 'cover', minHeight: 260 }}
        />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16 }}>
          <Chip label="Выбор гостей" color="primary" size="small" sx={{ fontWeight: 'bold' }} />
          {isNew && (
            <Chip icon={<NewReleasesIcon />} label="Новое" color="success" size="small" />
          )}
          {isSuperhost && (
            <Chip icon={<WorkspacePremiumIcon />} label="Суперхозяин" color="warning" size="small" />
          )}
        </Stack>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {apartment.location}
        </Typography>
        <Typography variant="h5" fontWeight="bold" noWrap>
          {apartment.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {apartment.description}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <StarIcon sx={{ color: '#FFD600', fontSize: 20 }} />
          <Typography variant="body2" fontWeight="bold">{rating}</Typography>
          <Typography variant="body2" color="text.secondary">({reviewsCount})</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {amenities.map((a, idx) => (
            <Tooltip title={a.label} key={idx}>
              <Box>{a.icon}</Box>
            </Tooltip>
          ))}
        </Stack>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
          <b>{Number(apartment.price).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} руб.</b> за ночь
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard; 