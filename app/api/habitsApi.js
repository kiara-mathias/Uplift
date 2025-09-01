import axios from 'axios';
const BASE_URL = 'http://192.168.1.4:5001';

export const getHabits = () => axios.get(`${BASE_URL}/habits`);
export const addHabit = (habit) => axios.post(`${BASE_URL}/habits`, habit);
export const updateHabit = (id, habit) => axios.put(`${BASE_URL}/habits/${id}`, habit);
export const deleteHabit = (id) => axios.delete(`${BASE_URL}/habits/${id}`);
