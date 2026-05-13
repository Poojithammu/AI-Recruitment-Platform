import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true, // Important for cookies (refresh token)
});

// Request interceptor to add access token to headers
authApi.interceptors.request.use(
  (config) => {
    // You could also get it from localStorage if you choose to store it there
    // But since we use Redux, we will often pass it directly or extract it from store
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // We should NOT retry if the request was to login or refresh itself
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/login') &&
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        if (res.status === 200) {
          // Update the token in localStorage and headers
          localStorage.setItem('accessToken', res.data.accessToken);
          authApi.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return authApi(originalRequest);
        }
      } catch (err) {
        // Refresh token failed, force logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export const register = (userData) => authApi.post('/register', userData);
export const verifyEmailOTP = (data) => authApi.post('/verify-email', data);
export const login = (userData) => authApi.post('/login', userData);
export const logout = () => authApi.post('/logout');
export const getMe = () => authApi.get('/me');
export const forgotPassword = (email) => authApi.post('/forgot-password', { email });
export const resetPassword = (token, password) => authApi.post(`/reset-password/${token}`, { password });
