import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, useMediaQuery } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, toggleTheme } = useThemeMode();
  let user = null;
  let token = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    token = localStorage.getItem('token');
  } catch (e) {}

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMobileMenu = (event) => setMobileMenu(event.currentTarget);
  const handleMobileClose = () => setMobileMenu(null);

  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    handleMobileClose();
    navigate('/login');
  };

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem disabled>{user?.email}</MenuItem>
      <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Профиль</MenuItem>
      <MenuItem component={RouterLink} to="/bookings" onClick={handleClose}>Мои бронирования</MenuItem>
      <MenuItem component={RouterLink} to="/add-apartment" onClick={handleClose} sx={{ color: 'primary.main', fontWeight: 600 }}>Сдать апартамент</MenuItem>
      <MenuItem onClick={handleLogout}>Выйти</MenuItem>
    </Menu>
  );

  const guestMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem component={RouterLink} to="/register" onClick={handleClose}>Зарегистрироваться</MenuItem>
      <MenuItem component={RouterLink} to="/login" onClick={handleClose}>Войти</MenuItem>
    </Menu>
  );

  const mobileMenuContent = (
    <Menu
      anchorEl={mobileMenu}
      open={Boolean(mobileMenu)}
      onClose={handleMobileClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem component={RouterLink} to="/apartments" onClick={handleMobileClose}>Апартаменты</MenuItem>
      {token && user ? (
        <>
          <MenuItem component={RouterLink} to="/profile" onClick={handleMobileClose}>Профиль</MenuItem>
          <MenuItem component={RouterLink} to="/bookings" onClick={handleMobileClose}>Мои бронирования</MenuItem>
          <MenuItem component={RouterLink} to="/add-apartment" onClick={handleMobileClose} sx={{ color: 'primary.main', fontWeight: 600 }}>Сдать апартамент</MenuItem>
          <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={RouterLink} to="/register" onClick={handleMobileClose}>Зарегистрироваться</MenuItem>
          <MenuItem component={RouterLink} to="/login" onClick={handleMobileClose}>Войти</MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ color: '#fff', textDecoration: 'none' }}>
          BOOKING APP
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMobileMenu}>
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {mobileMenuContent}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/apartments">Апартаменты</Button>
            {token && user ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/add-apartment"
                  sx={{ fontWeight: 600, ml: 1 }}
                >
                  Сдать апартамент
                </Button>
                <IconButton onClick={handleMenu} sx={{ p: 0, ml: 1 }}>
                  <Avatar src={user?.avatar}>
                    {!user?.avatar && (user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?')}
                  </Avatar>
                </IconButton>
                <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {profileMenu}
              </>
            ) : (
              <>
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar />
                </IconButton>
                <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {guestMenu}
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 