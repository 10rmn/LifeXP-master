import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_URL = `${API_BASE}/api/habits`;

export const createHabit = async (user_id, name, frequency, category) => {
  try {
    console.log('Creating habit:', { user_id, name, frequency, category });
    const response = await axios.post(`${API_URL}/create`, { user_id, name, frequency, category });
    console.log('Create habit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const editHabit = async (id, name, frequency, category, active) => {
  const response = await axios.put(`${API_URL}/${id}`, { name, frequency, category, active });
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const completeHabit = async (id, user_id) => {
  const response = await axios.post(`${API_URL}/${id}/complete`, { user_id });
  return response.data;
};

export const uncompleteHabit = async (id, user_id) => {
  const response = await axios.post(`${API_URL}/${id}/uncomplete`, { user_id });
  return response.data;
};

export const getUserHabits = async (user_id) => {
  try {
    console.log('Fetching habits for user:', user_id);
    const response = await axios.get(`${API_URL}/user/${user_id}`);
    console.log('Habits response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

export const getUserLogs = async (user_id) => {
  const response = await axios.get(`${API_URL}/logs/${user_id}`);
  return response.data;
};

export const getUserStats = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats if API fails
    return { xp: 0, level: 0, streak: 0, nextLevelXp: 100 };
  }
};
