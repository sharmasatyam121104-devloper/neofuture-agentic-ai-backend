import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.N8N_WEBHOOK, // n8n ya backend URL
  timeout: 600000,
});

export default axiosInstance;