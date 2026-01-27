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
