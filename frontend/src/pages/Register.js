import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (userData.password !== userData.password2) {
            setError('Пароли не совпадают');
            return;
        }

        const result = await register({
            email: userData.email,
            password: userData.password,
            password2: userData.password2,
            first_name: userData.first_name,
            last_name: userData.last_name,
        });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Регистрация
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Имя"
                            value={userData.first_name}
                            onChange={(e) =>
                                setUserData({ ...userData, first_name: e.target.value })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Фамилия"
                            value={userData.last_name}
                            onChange={(e) =>
                                setUserData({ ...userData, last_name: e.target.value })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                                setUserData({ ...userData, email: e.target.value })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={userData.password}
                            onChange={(e) =>
                                setUserData({ ...userData, password: e.target.value })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Подтверждение пароля"
                            type="password"
                            value={userData.password2}
                            onChange={(e) =>
                                setUserData({ ...userData, password2: e.target.value })
                            }
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                        >
                            Зарегистрироваться
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Уже есть аккаунт?{' '}
                                <Link component={RouterLink} to="/login">
                                    Войти
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 