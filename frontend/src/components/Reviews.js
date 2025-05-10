import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, TextField, Button, Paper, Stack, Divider, CircularProgress } from '@mui/material';
import { getReviews, addReview } from '../services/api';
import { useToast } from '../utils/ToastContext';

// Пример начальных отзывов (можно заменить на API)
const initialReviews = [
  { id: 1, name: 'Иван', date: '2024-06-01', rating: 5, text: 'Отличное жильё, всё понравилось!' },
  { id: 2, name: 'Мария', date: '2024-06-03', rating: 4, text: 'Очень уютно, но было шумно на улице.' },
];

const Reviews = ({ apartmentId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    getReviews(apartmentId)
      .then(res => {
        if (Array.isArray(res.data)) {
          setReviews(res.data);
        } else if (Array.isArray(res.data.results)) {
          setReviews(res.data.results);
        } else {
          setReviews([]);
        }
      })
      .catch(() => showToast('Ошибка загрузки отзывов', 'error'))
      .finally(() => setLoading(false));
  }, [apartmentId, showToast]);

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      const res = await addReview(apartmentId, { rating: newRating, comment: newText });
      setReviews([res.data, ...reviews]);
      setNewText('');
      setNewRating(5);
      showToast('Спасибо за ваш отзыв!', 'success');
    } catch (e) {
      showToast('Ошибка при отправке отзыва', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ mt: 6, p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Отзывы</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Rating value={Number(avgRating)} precision={0.1} readOnly />
        <Typography variant="h6">{avgRating}</Typography>
        <Typography variant="body2" color="text.secondary">({reviews.length})</Typography>
      </Stack>
      {user && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Rating value={newRating} onChange={(_, v) => setNewRating(v)} />
            <TextField
              label="Ваш отзыв"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              multiline
              minRows={2}
              sx={{ flex: 1 }}
              required
            />
            <Button type="submit" variant="contained" disabled={submitting || !newText.trim()} sx={{ minWidth: 140 }}>
              Оставить отзыв
            </Button>
          </Stack>
        </Box>
      )}
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {reviews.length === 0 ? (
            <Typography color="text.secondary">Пока нет отзывов</Typography>
          ) : (
            reviews.map(r => (
              <Box key={r.id} sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{r.name || r.user_name || 'Гость'}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.date || r.created_at?.slice(0,10)}</Typography>
                  <Rating value={r.rating} size="small" readOnly sx={{ ml: 1 }} />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>{r.comment}</Typography>
              </Box>
            ))
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default Reviews; 