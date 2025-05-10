import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Tooltip, Stack, Grow } from '@mui/material';
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

  const getMainImage = () => {
    if (apartment.images && apartment.images.length > 0) {
      const main = apartment.images.find(img => img.is_main);
      return (main && main.image) || apartment.images[0].image;
    }
    return '/placeholders/1.jpeg';
  };

  // Формируем массив тегов (максимум 2)
  const tags = [
    { show: true, element: <Chip label="Выбор гостей" color="primary" size="small" sx={{ fontWeight: 'bold' }} /> },
    { show: isNew, element: <Chip icon={<NewReleasesIcon />} label="Новое" color="success" size="small" /> },
    { show: isSuperhost, element: <Chip icon={<WorkspacePremiumIcon />} label="Суперхозяин" color="warning" size="small" /> },
  ].filter(t => t.show).slice(0, 2);

  return (
    <Grow in={true} timeout={500}>
      <Card
        component={RouterLink}
        to={`/apartments/${apartment.id}`}
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          height: { xs: 'auto', sm: 440 },
          width: { xs: '100%', sm: 360 },
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.22s, box-shadow 0.22s',
          '&:hover': {
            transform: { xs: 'none', sm: 'scale(1.035)' },
            boxShadow: { xs: 3, sm: 10 },
            cursor: 'pointer',
          },
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          p: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={getMainImage()}
            alt={apartment.title}
            sx={{ borderRadius: 4, objectFit: 'cover', width: '100%', height: { xs: 140, sm: 180 } }}
          />
          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: { xs: 8, sm: 16 }, left: { xs: 8, sm: 16 } }}>
            {tags.map((tag, idx) => tag.element)}
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
    </Grow>
  );
};

export default ApartmentCard; 