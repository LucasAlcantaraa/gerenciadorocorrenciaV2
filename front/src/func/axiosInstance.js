import axios from 'axios';

// Cria uma instância do axios com configurações padrão
const axiosInstance = axios.create({
  baseURL:`http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`,
  withCredentials: true,
  timeout: 50000,
});

export default axiosInstance;
