import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const extractRequirements = async (jobDescription, token, provider = 'gemini') => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/extract`, { jobDescription, provider }, config);
  return response.data;
};

const getHistory = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/history`, config);
  return response.data;
};

const getExtractionById = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

const reprocessExtraction = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/reprocess/${id}`, {}, config);
  return response.data;
};

const requirementService = {
  extractRequirements,
  getHistory,
  getExtractionById,
  reprocessExtraction
};

export default requirementService;
