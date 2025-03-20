import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://localhost:7039',
  withCredentials: true,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login page)
      console.error('Unauthorized access! Redirecting to login...');
      window.location.href = '/account/login';
    } else if (error.response.status === 404) {
      // Handle not found errors
      console.error('Resource not found!');
    } else {
      // Handle other errors
      console.error('An error occurred:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;