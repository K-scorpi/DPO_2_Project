import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Добро пожаловать в систему бронирования жилья
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
          Посмотреть жилье
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
      <DodecahedronCSS />
      {/* <Dodecahedron3D /> */}
    </Container>
  );
};

// --- DodecahedronCSS START ---
const DodecahedronCSS = () => (
  <div className="view">
    <div className="plane main">
      {[...Array(6)].map((_, x) => (
        <div className="circle" key={x} style={{ transform: `rotateZ(${x * 60}deg) rotateX(63.435deg)` }} />
      ))}
    </div>
    <style>{`
      .view {
        position: relative;
        width: 240px;
        height: 240px;
        margin: 40px auto 0 auto;
        perspective: 400px;
      }
      .plane {
        width: 120px;
        height: 120px;
        transform-style: preserve-3d;
      }
      .plane.main {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        margin: auto;
        transform: rotateX(60deg) rotateZ(-30deg);
        animation: rotate 20s infinite linear;
      }
      .circle {
        width: 120px;
        height: 120px;
        position: absolute;
        transform-style: preserve-3d;
        border-radius: 100%;
        box-sizing: border-box;
        box-shadow: 0 0 60px rgba(33,150,243,1), inset 0 0 60px rgba(33,150,243,1);
      }
      .circle::before, .circle::after {
        content: '';
        display: block;
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        margin: auto;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        background: rgba(33,150,243,1);
        box-sizing: border-box;
        box-shadow: 0 0 60px 2px rgba(33,150,243,1);
      }
      .circle::before {
        transform: translateZ(-90px);
      }
      .circle::after {
        transform: translateZ(90px);
      }
      @keyframes rotate {
        0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
        100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
      }
    `}</style>
  </div>
);
// --- DodecahedronCSS END ---

// --- Dodecahedron3D (three.js) оставлен закомментированным ---
// const Dodecahedron3D = ...

export default Home; 