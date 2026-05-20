import axios from 'axios';
const API_URL =  import.meta.env.VITE_API_URL;


// Get current user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// Create or update profile
const createOrUpdateProfile = async (profileData, token) => {
  console.log(API_URL);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/profiles`, profileData, config);
  return response.data;
};

const profileService = {
  getProfile,
  createOrUpdateProfile,
};

export default profileService;
