import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { addApartment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddApartment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setMainImageIdx(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title || !description || !price || !location) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (images.length === 0) {
      setError('Загрузите хотя бы одно фото');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    images.forEach((img) => {
      formData.append('images', img);
    });
    formData.append('main_image_index', mainImageIdx);
    try {
      await addApartment(formData);
      setSuccess('Апартамент успешно добавлен!');
      setTimeout(() => navigate('/apartments'), 1500);
    } catch (e) {
      setError('Ошибка при добавлении апартамента');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Добавить апартамент</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Название" value={title} onChange={e => setTitle(e.target.value)} required />
        <TextField label="Описание" value={description} onChange={e => setDescription(e.target.value)} required multiline rows={3} />
        <TextField label="Цена за ночь" type="number" value={price} onChange={e => setPrice(e.target.value)} required inputProps={{ min: 0 }} />
        <TextField label="Локация" value={location} onChange={e => setLocation(e.target.value)} required />
        <Button variant="contained" component="label">
          Загрузить фото
          <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </Button>
        {images.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {images.map((img, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="radio"
                  name="mainImage"
                  checked={mainImageIdx === idx}
                  onChange={() => setMainImageIdx(idx)}
                  style={{ accentColor: '#1976d2' }}
                />
                <Typography variant="body2">
                  {img.name} {mainImageIdx === idx && '(главное)'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary">Добавить</Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
    </Container>
  );
};

export default AddApartment; 