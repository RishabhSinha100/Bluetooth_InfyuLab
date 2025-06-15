import axios from 'axios';

const BASE_URL = 'https://futureagriinnovationlabs.in';

export const registerUser = async (formData) => {
  return await axios.post(`${BASE_URL}/api/auth/register`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const loginUser = async (data) => {
  return await axios.post(`${BASE_URL}/api/auth/login`, data);
};

export const getUserDetails = async (token) => {
  return await axios.get(`${BASE_URL}/api/user/user-details`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
