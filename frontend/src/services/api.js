import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // URL вашего Django бэкенда

const api = axios.create({
    baseURL: API_URL,
});

// Добавляем токен в заголовки при каждом запросе
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обработка ошибок
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (response.data.access) {
                        localStorage.setItem('token', response.data.access);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
            
            // Если обновление токена не помогло, разлогиниваем пользователя
            localStorage.clear();
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = async (credentials) => {
    try {
        const response = await api.post('/token/', {
            email: credentials.email,
            password: credentials.password
        });
        
        if (response.data && response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // Получаем информацию о пользователе
            const userResponse = await api.get('/profile/');
            if (userResponse.data) {
                localStorage.setItem('user', JSON.stringify(userResponse.data));
            }
        }
        return response;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register/', {
            email: userData.email,
            password: userData.password,
            password2: userData.password2,
            first_name: userData.first_name,
            last_name: userData.last_name
        });
        
        if (response.data && response.data.email) {
            const loginResponse = await login({
                email: userData.email,
                password: userData.password
            });
            return loginResponse;
        }
        
        return response;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
    localStorage.clear();
};

// Apartment endpoints
export const getApartments = () => api.get('/apartments/');
export const getApartment = (id) => api.get(`/apartments/${id}/`);

// Booking endpoints
export const getBookings = () => api.get('/bookings/');
export const createBooking = (data) => api.post('/bookings/', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/`, { status: 'cancelled' });

export const addApartment = async (formData) => {
    return api.post('/apartments/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateAvatar = async (formData) => {
    return api.put('/profile/avatar/', formData);
};

export default api; 