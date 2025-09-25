import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

let authToken = null;

instance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const api = {
  setToken(token) {
    authToken = token;
  },
  async get(path, params) {
    const { data } = await instance.get(path, { params });
    return data;
  },
  async post(path, body) {
    const { data } = await instance.post(path, body);
    return data;
  },
  async put(path, body) {
    const { data } = await instance.put(path, body);
    return data;
  },
  async del(path) {
    const { data } = await instance.delete(path);
    return data;
  },
};
