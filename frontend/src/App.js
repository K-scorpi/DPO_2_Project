import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './utils/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Apartments from './pages/Apartments';
import ApartmentDetail from './pages/ApartmentDetail';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AddApartment from './pages/AddApartment';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import About from './pages/About';
import FAQ from './pages/FAQ';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          <CssBaseline />
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apartments" element={<Apartments />} />
              <Route path="/apartments/:id" element={<ApartmentDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <Bookings />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-apartment" element={<PrivateRoute><AddApartment /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
            <Footer />
          </Router>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
