import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Avatar, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email] = useState(user?.email || '');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef();
  // Пароль
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Получение актуального профиля при монтировании
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get('/profile/');
        setFirstName(response.data.user.first_name || '');
        setLastName(response.data.user.last_name || '');
        setAvatarPreview(response.data.avatar || null);
        localStorage.setItem('user', JSON.stringify({
          ...response.data.user,
          avatar: response.data.avatar
        }));
      } catch (e) {
        // обработка ошибки
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const response = await api.put('/profile/', {
        first_name: firstName,
        last_name: lastName,
      });
      setSuccess('Профиль успешно обновлён!');
      // После сохранения обновим профиль
      const updated = await api.get('/profile/');
      setAvatarPreview(updated.data.avatar || null);
      localStorage.setItem('user', JSON.stringify({
        ...updated.data.user,
        avatar: updated.data.avatar
      }));
    } catch (err) {
      setError('Ошибка при обновлении профиля');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      // Проверка!
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ', pair[1]);
      }

      try {
        setError(null);
        const response = await api.put('/profile/avatar/', formData);
        if (response.data && response.data.avatar) {
          setAvatarPreview(response.data.avatar);
          setSuccess('Аватар успешно обновлён!');
          // Обновить user в localStorage
          const updated = await api.get('/profile/');
          localStorage.setItem('user', JSON.stringify({
            ...updated.data.user,
            avatar: updated.data.avatar
          }));
        } else {
          setError('Не удалось получить URL аватара');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка при загрузке аватара');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Заполните все поля' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }
    try {
      await api.post('/profile/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Пароль успешно изменён!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Ошибка при смене пароля' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Профиль</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={avatarPreview}
          sx={{ width: 96, height: 96, mb: 1, fontSize: 40 }}
        >
          {firstName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || '?'}
        </Avatar>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />
        <Button
          variant="outlined"
          startIcon={<PhotoCamera />}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          sx={{ mb: 2 }}
        >
          Загрузить фото
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" value={email} InputProps={{ readOnly: true }} />
        <TextField label="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <TextField label="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} />
        <Button type="submit" variant="contained" color="primary">Сохранить</Button>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" gutterBottom>Смена пароля</Typography>
      <Box component="form" onSubmit={handlePasswordChange} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Текущий пароль"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        <TextField
          label="Новый пароль"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <TextField
          label="Подтвердите новый пароль"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="secondary">Сменить пароль</Button>
        {passwordMsg && <Alert severity={passwordMsg.type}>{passwordMsg.text}</Alert>}
      </Box>
    </Container>
  );
};

export default Profile; 