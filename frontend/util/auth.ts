import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.API_ROUTE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

//bearer token
api.interceptors.request.use(
  async (config) => {
    const ACCESS_TOKEN = await AsyncStorage.getItem('token');
    if (ACCESS_TOKEN) {
      config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function login(username: string, password: string) {
  console.log(process.env.API_ROUTE);
  const result = await api.post('/v1/users/login', {
    name: username,
    password,
  });

  console.log('request done');

  console.log(result);
}

export async function register(username: string, password: string) {
  try {
    console.log(
      'Making request to:',
      `${process.env.API_ROUTE}/v1/users/register`
    );
    console.log('Request payload:', { name: username, password });

    const response = await api.post('/v1/users/register', {
      name: username,
      password,
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
}

export async function deleteUser() {}

export async function getToken() {}
