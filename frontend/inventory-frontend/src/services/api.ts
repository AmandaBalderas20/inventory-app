import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090', // Backend port
});

export default api;
