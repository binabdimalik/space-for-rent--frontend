<<<<<<< HEAD
// src/services/api.js - MUST WORK with your backend
import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-url.com"
      : "http://localhost:5555",
});

export const getSpaces = () => API.get("/api/spaces");
export const getSpace = (id) => API.get(`/api/spaces/${id}`);
export const createSpace = (data) => API.post("/api/spaces", data);
export const updateSpace = (id, data) => API.put(`/api/spaces/${id}`, data);
export const deleteSpace = (id) => API.delete(`/api/spaces/${id}`);
export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);

export const getBookings = () => API.get('/api/bookings');
export const getBooking = (id) => API.get(`/api/bookings/${id}`);
export const createBooking = (data) => API.post('/api/bookings', data);
export const updateBooking = (id, data) => API.put(`/api/bookings/${id}`, data);
export const payBooking = (id) => API.post(`/api/bookings/${id}/pay`);
=======
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
